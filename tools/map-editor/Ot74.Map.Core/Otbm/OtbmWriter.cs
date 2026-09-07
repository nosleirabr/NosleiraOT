namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Forward-only writer for the OTBM node tree.
/// </summary>
/// <remarks>
/// Two ways to supply properties. <see cref="WriteNodeStartRaw"/> takes bytes that are already
/// escaped, which is what copying an untouched node from <see cref="OtbmReader"/> needs and what
/// makes a byte-identical round trip possible. <see cref="WriteNodeStart"/> escapes the payload and
/// is what callers producing new content should use.
/// </remarks>
public sealed class OtbmWriter : IDisposable
{
	const int DefaultBufferSize = 64 * 1024;

	readonly Stream _stream;
	readonly bool _leaveOpen;
	readonly byte[] _buffer;
	int _bufferLength;
	int _openNodes;

	public OtbmWriter(Stream output, ReadOnlySpan<byte> identifier, bool leaveOpen = false, int bufferSize = DefaultBufferSize)
	{
		ArgumentNullException.ThrowIfNull(output);
		if (identifier.Length != OtbmSpecialBytes.IdentifierLength)
		{
			throw new ArgumentException(
				$"Identifier must be {OtbmSpecialBytes.IdentifierLength} bytes.", nameof(identifier));
		}

		_stream = output;
		_leaveOpen = leaveOpen;
		_buffer = new byte[bufferSize];
		WriteBytes(identifier);
	}

	public static OtbmWriter Create(string path, ReadOnlySpan<byte> identifier) =>
		new(new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, DefaultBufferSize), identifier);

	/// <summary>Opens a node using properties that already carry their escape bytes.</summary>
	public void WriteNodeStartRaw(byte type, ReadOnlySpan<byte> escapedProps)
	{
		WriteByte(OtbmSpecialBytes.NodeStart);
		WriteByte(type);
		WriteBytes(escapedProps);
		_openNodes++;
	}

	/// <summary>Opens a node, escaping the supplied payload.</summary>
	public void WriteNodeStart(byte type, ReadOnlySpan<byte> props)
	{
		WriteByte(OtbmSpecialBytes.NodeStart);
		WriteByte(type);
		WriteEscaped(props);
		_openNodes++;
	}

	/// <inheritdoc cref="WriteNodeStart(byte, ReadOnlySpan{byte})"/>
	public void WriteNodeStart(OtbmNodeType type, ReadOnlySpan<byte> props) => WriteNodeStart((byte)type, props);

	public void WriteNodeEnd()
	{
		if (_openNodes == 0)
		{
			throw new InvalidOperationException("There is no open node to close.");
		}

		WriteByte(OtbmSpecialBytes.NodeEnd);
		_openNodes--;
	}

	/// <summary>Fails when nodes were left open, which would produce a file the server cannot load.</summary>
	public void EnsureAllNodesClosed()
	{
		if (_openNodes != 0)
		{
			throw new InvalidOperationException($"{_openNodes} node(s) were never closed.");
		}
	}

	void WriteEscaped(ReadOnlySpan<byte> props)
	{
		foreach (var value in props)
		{
			if (OtbmSpecialBytes.IsControl(value))
			{
				WriteByte(OtbmSpecialBytes.Escape);
			}

			WriteByte(value);
		}
	}

	void WriteByte(byte value)
	{
		if (_bufferLength == _buffer.Length)
		{
			FlushBuffer();
		}

		_buffer[_bufferLength++] = value;
	}

	void WriteBytes(ReadOnlySpan<byte> values)
	{
		foreach (var value in values)
		{
			WriteByte(value);
		}
	}

	void FlushBuffer()
	{
		if (_bufferLength == 0)
		{
			return;
		}

		_stream.Write(_buffer, 0, _bufferLength);
		_bufferLength = 0;
	}

	public void Flush()
	{
		FlushBuffer();
		_stream.Flush();
	}

	public void Dispose()
	{
		FlushBuffer();
		if (!_leaveOpen)
		{
			_stream.Dispose();
		}
	}
}
