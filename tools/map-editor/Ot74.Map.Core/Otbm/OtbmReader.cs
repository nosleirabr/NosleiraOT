namespace Ot74.Map.Core.Otbm;

/// <summary>Event surfaced by <see cref="OtbmReader"/> on the current position.</summary>
public enum OtbmReadState
{
	/// <summary>Nothing read yet.</summary>
	Initial,

	/// <summary>Positioned on a node header; <see cref="OtbmReader.NodeType"/> and properties are available.</summary>
	NodeStart,

	/// <summary>The current node was closed.</summary>
	NodeEnd,

	/// <summary>The whole document was consumed.</summary>
	EndOfFile
}

/// <summary>
/// Forward-only reader over the OTBM node tree, in the spirit of <c>XmlReader</c>.
/// </summary>
/// <remarks>
/// Streaming is deliberate: the real map is around 60 MB over a 65000x65000 grid, so materialising
/// every node as an object is not affordable. Properties are exposed still escaped
/// (<see cref="RawProps"/>) so a copy can be written back byte for byte; call
/// <see cref="ReadProps"/> only for the nodes actually being inspected.
/// </remarks>
public sealed class OtbmReader : IDisposable
{
	const int DefaultBufferSize = 64 * 1024;

	readonly Stream _stream;
	readonly bool _leaveOpen;
	readonly byte[] _buffer;
	int _bufferLength;
	int _bufferPosition;

	byte[] _props = new byte[256];
	int _propsLength;

	public OtbmReader(Stream input, bool leaveOpen = false, int bufferSize = DefaultBufferSize)
	{
		ArgumentNullException.ThrowIfNull(input);
		_stream = input;
		_leaveOpen = leaveOpen;
		_buffer = new byte[bufferSize];
		Identifier = new byte[OtbmSpecialBytes.IdentifierLength];
	}

	public static OtbmReader Open(string path) =>
		new(new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, DefaultBufferSize, FileOptions.SequentialScan));

	/// <summary>The four bytes preceding the root node.</summary>
	public byte[] Identifier { get; private set; }

	public OtbmReadState State { get; private set; } = OtbmReadState.Initial;

	/// <summary>Type of the node the reader is positioned on. Only valid on <see cref="OtbmReadState.NodeStart"/>.</summary>
	public byte NodeType { get; private set; }

	/// <summary>Node type as the enum mirroring <c>OTBM_NodeTypes_t</c>.</summary>
	public OtbmNodeType NodeTypeValue => (OtbmNodeType)NodeType;

	/// <summary>Nesting level of the current node; the root node sits at depth 1.</summary>
	public int Depth { get; private set; }

	/// <summary>Properties exactly as stored on disk, escape bytes included.</summary>
	public ReadOnlySpan<byte> RawProps => _props.AsSpan(0, _propsLength);

	/// <summary>Allocates an unescaped copy of the current node properties.</summary>
	public byte[] ReadProps() => OtbmEscaping.Unescape(RawProps);

	/// <summary>
	/// Advances to the next node start or node end. Returns false once the document is consumed.
	/// </summary>
	public bool Read()
	{
		if (State == OtbmReadState.EndOfFile)
		{
			return false;
		}

		if (State == OtbmReadState.Initial)
		{
			ReadIdentifier();
			ExpectByte(OtbmSpecialBytes.NodeStart, "the root node marker");
			ReadNodeStart();
			return true;
		}

		var next = ReadByteOrEof();
		if (next < 0)
		{
			return FinishDocument();
		}

		switch ((byte)next)
		{
			case OtbmSpecialBytes.NodeStart:
				ReadNodeStart();
				return true;

			case OtbmSpecialBytes.NodeEnd:
				CloseNode();
				return true;

			default:
				throw new InvalidDataException(
					$"Expected a node marker after a node boundary but found 0x{next:X2}.");
		}
	}

	void ReadIdentifier()
	{
		var identifier = new byte[OtbmSpecialBytes.IdentifierLength];
		for (var i = 0; i < identifier.Length; i++)
		{
			var value = ReadByteOrEof();
			if (value < 0)
			{
				throw new InvalidDataException("OTBM file is too short to contain the identifier.");
			}

			identifier[i] = (byte)value;
		}

		var isMap = identifier.AsSpan().SequenceEqual(OtbmSpecialBytes.MapIdentifier);
		var isWildcard = identifier.AsSpan().SequenceEqual(OtbmSpecialBytes.WildcardIdentifier);
		if (!isMap && !isWildcard)
		{
			throw new InvalidDataException(
				$"Unexpected OTBM identifier 0x{Convert.ToHexString(identifier)}; expected 'OTBM' or four zero bytes.");
		}

		Identifier = identifier;
	}

	void ReadNodeStart()
	{
		var type = ReadByteOrEof();
		if (type < 0)
		{
			throw new InvalidDataException("OTBM ended before the node type byte.");
		}

		NodeType = (byte)type;
		_propsLength = 0;

		// Properties run until the next unescaped node marker, which belongs to a child or to this node's end.
		while (true)
		{
			var peeked = PeekByteOrEof();
			if (peeked < 0)
			{
				throw new InvalidDataException("OTBM ended inside node properties.");
			}

			if (peeked is OtbmSpecialBytes.NodeStart or OtbmSpecialBytes.NodeEnd)
			{
				break;
			}

			var value = (byte)ReadByteOrEof();
			AppendProp(value);
			if (value != OtbmSpecialBytes.Escape)
			{
				continue;
			}

			// Keep the escaped byte verbatim so the payload can be written back unchanged.
			var escaped = ReadByteOrEof();
			if (escaped < 0)
			{
				throw new InvalidDataException("OTBM ended right after an escape byte.");
			}

			AppendProp((byte)escaped);
		}

		Depth++;
		State = OtbmReadState.NodeStart;
	}

	void CloseNode()
	{
		if (Depth == 0)
		{
			throw new InvalidDataException("Found a node end without a matching node start.");
		}

		Depth--;
		_propsLength = 0;
		State = OtbmReadState.NodeEnd;
	}

	bool FinishDocument()
	{
		if (Depth != 0)
		{
			throw new InvalidDataException($"OTBM ended with {Depth} node(s) still open.");
		}

		State = OtbmReadState.EndOfFile;
		return false;
	}

	void ExpectByte(byte expected, string what)
	{
		var value = ReadByteOrEof();
		if (value != expected)
		{
			throw new InvalidDataException($"Expected {what} (0x{expected:X2}) but found 0x{value:X2}.");
		}
	}

	void AppendProp(byte value)
	{
		if (_propsLength == _props.Length)
		{
			Array.Resize(ref _props, _props.Length * 2);
		}

		_props[_propsLength++] = value;
	}

	int ReadByteOrEof()
	{
		if (_bufferPosition >= _bufferLength && !FillBuffer())
		{
			return -1;
		}

		return _buffer[_bufferPosition++];
	}

	int PeekByteOrEof()
	{
		if (_bufferPosition >= _bufferLength && !FillBuffer())
		{
			return -1;
		}

		return _buffer[_bufferPosition];
	}

	bool FillBuffer()
	{
		_bufferLength = _stream.Read(_buffer, 0, _buffer.Length);
		_bufferPosition = 0;
		return _bufferLength > 0;
	}

	public void Dispose()
	{
		if (!_leaveOpen)
		{
			_stream.Dispose();
		}
	}
}
