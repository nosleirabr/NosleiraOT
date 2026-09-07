using System.Buffers.Binary;

namespace Ot74.Gameplay.Tests.Catalog;

/// <summary>Minimal items.otb walker: server id → client sprite id (TFS 1.2 / 7.4).</summary>
public static class ItemsOtbClientIds
{
	const byte Escape = 0xFD;
	const byte NodeStart = 0xFE;
	const byte NodeEnd = 0xFF;
	const byte ItemAttrServerId = 0x10;
	const byte ItemAttrClientId = 0x11;

	public static Dictionary<int, int> Load(string otbPath)
	{
		var map = new Dictionary<int, int>();
		if (!File.Exists(otbPath))
		{
			return map;
		}

		var data = File.ReadAllBytes(otbPath);
		if (data.Length < 6 || data[4] != NodeStart)
		{
			return map;
		}

		var cursor = new Cursor(data, 5);
		ParseNode(cursor, map, inRoot: true);
		return map;
	}

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

		public byte ReadRaw() => _data[_pos++];

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
