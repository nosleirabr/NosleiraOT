using System.Buffers.Binary;

namespace Ot74.Map.Items;

/// <summary>
/// Bidirectional <c>serverId</c> ↔ <c>clientId</c> map from <c>items.otb</c>.
/// <c>items.xml</c> has no client ids; this binary is the only source.
/// </summary>
/// <remarks>
/// Walks the OTB node tree the same way as the datapack catalog walker
/// (<c>ItemsOtbClientIds</c>): attributes 0x10 / 0x11, plus the 20001–20099
/// server-id fold used by 7.4/7.6 OTBs. Version-agnostic — the file's major/minor
/// header is ignored as long as those attributes are present.
/// </remarks>
public sealed class ItemsOtb
{
	const byte Escape = 0xFD;
	const byte NodeStart = 0xFE;
	const byte NodeEnd = 0xFF;
	const byte ItemAttrServerId = 0x10;
	const byte ItemAttrClientId = 0x11;

	readonly Dictionary<int, int> _serverToClient;
	readonly Dictionary<int, int> _clientToServer;

	ItemsOtb(Dictionary<int, int> serverToClient, Dictionary<int, int> clientToServer)
	{
		_serverToClient = serverToClient;
		_clientToServer = clientToServer;
	}

	public IReadOnlyDictionary<int, int> ServerToClient => _serverToClient;
	public IReadOnlyDictionary<int, int> ClientToServer => _clientToServer;

	public static ItemsOtb Load(string path)
	{
		if (!File.Exists(path))
		{
			throw new FileNotFoundException($"items.otb not found: {path}", path);
		}

		var data = File.ReadAllBytes(path);
		if (data.Length < 6 || data[4] != NodeStart)
		{
			throw new InvalidDataException($"'{path}' is not a valid items.otb (missing root node).");
		}

		var serverToClient = new Dictionary<int, int>();
		var cursor = new Cursor(data, 5);
		ParseNode(cursor, serverToClient, inRoot: true);

		var clientToServer = new Dictionary<int, int>();
		foreach (var (serverId, clientId) in serverToClient)
		{
			clientToServer.TryAdd(clientId, serverId);
		}

		return new ItemsOtb(serverToClient, clientToServer);
	}

	public int ToClientId(int serverId) =>
		_serverToClient.TryGetValue(serverId, out var clientId)
			? clientId
			: throw new KeyNotFoundException($"No clientId for serverId {serverId}.");

	public int ToServerId(int clientId) =>
		_clientToServer.TryGetValue(clientId, out var serverId)
			? serverId
			: throw new KeyNotFoundException($"No serverId for clientId {clientId}.");

	public bool TryGetClientId(int serverId, out int clientId) =>
		_serverToClient.TryGetValue(serverId, out clientId);

	public bool TryGetServerId(int clientId, out int serverId) =>
		_clientToServer.TryGetValue(clientId, out serverId);

	static void ParseNode(Cursor cursor, Dictionary<int, int> map, bool inRoot)
	{
		_ = cursor.ReadRaw();
		var props = cursor.ReadProps();
		if (!inRoot)
		{
			ParseItemProps(props, map);
		}

		while (cursor.Peek() == NodeStart)
		{
			cursor.ReadRaw();
			ParseNode(cursor, map, inRoot: false);
		}

		if (cursor.ReadRaw() != NodeEnd)
		{
			throw new InvalidDataException("items.otb node not closed.");
		}
	}

	static void ParseItemProps(byte[] props, Dictionary<int, int> map)
	{
		if (props.Length < 4)
		{
			return;
		}

		var offset = 4;
		ushort serverId = 0;
		ushort clientId = 0;
		while (offset < props.Length)
		{
			var attr = props[offset++];
			if (offset + 2 > props.Length)
			{
				break;
			}

			var len = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(offset, 2));
			offset += 2;
			if (offset + len > props.Length)
			{
				break;
			}

			switch (attr)
			{
				case ItemAttrServerId when len == 2:
					serverId = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(offset, 2));
					// 7.6-era OTBs fold a handful of ids into 20001–20099; TFS maps them back to 1–99.
					if (serverId > 20000 && serverId < 20100)
					{
						serverId -= 20000;
					}

					break;
				case ItemAttrClientId when len == 2:
					clientId = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(offset, 2));
					break;
			}

			offset += len;
		}

		if (serverId > 0 && clientId > 0)
		{
			map[serverId] = clientId;
		}
	}

	sealed class Cursor
	{
		readonly byte[] _data;
		int _pos;

		public Cursor(byte[] data, int pos)
		{
			_data = data;
			_pos = pos;
		}

		public byte Peek() => _pos < _data.Length ? _data[_pos] : (byte)0;

		public byte ReadRaw()
		{
			if (_pos >= _data.Length)
			{
				throw new InvalidDataException("items.otb truncated while reading a node.");
			}

			return _data[_pos++];
		}

		public byte[] ReadProps()
		{
			var unescaped = new List<byte>(64);
			while (_pos < _data.Length)
			{
				var b = _data[_pos];
				if (b is NodeStart or NodeEnd)
				{
					break;
				}

				_pos++;
				unescaped.Add(b == Escape ? _data[_pos++] : b);
			}

			return unescaped.ToArray();
		}
	}
}
