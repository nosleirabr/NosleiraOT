using System.Buffers.Binary;
using System.Globalization;
using System.Text;

namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Reads and writes TILE / HOUSETILE / ITEM node payloads.
/// Unknown attributes are retained as hex so a later compiler does not drop them.
/// </summary>
public static class OtbmTileCodec
{
	public static OtbmPlacedTile ReadTile(byte type, ReadOnlySpan<byte> rawProps, TileAreaBase area)
	{
		var props = OtbmEscaping.Unescape(rawProps);
		if (props.Length < 2)
		{
			throw new InvalidDataException("Tile node is missing its offset.");
		}

		var offset = 0;
		var x = area.X + props[offset++];
		var y = area.Y + props[offset++];
		uint? houseId = null;

		if (type == (byte)OtbmNodeType.HouseTile)
		{
			if (offset + 4 > props.Length)
			{
				throw new InvalidDataException("HOUSETILE node is missing its house id.");
			}

			houseId = BinaryPrimitives.ReadUInt32LittleEndian(props.AsSpan(offset));
			offset += 4;
		}

		var tile = new OtbmPlacedTile
		{
			Position = new MapPos(x, y, area.Z),
			HouseId = houseId
		};

		ReadTileAttributes(props.AsSpan(offset), tile);
		return tile;
	}

	public static OtbmPlacedItem ReadItem(ReadOnlySpan<byte> rawProps)
	{
		var props = OtbmEscaping.Unescape(rawProps);
		if (props.Length < 2)
		{
			throw new InvalidDataException("ITEM node is missing its id.");
		}

		var offset = 0;
		var item = new OtbmPlacedItem { Id = ReadU16(props, ref offset) };
		ReadItemAttributes(props, ref offset, item);
		return item;
	}

	public static byte[] WriteTileProps(OtbmPlacedTile tile, TileAreaBase area)
	{
		var dx = tile.Position.X - area.X;
		var dy = tile.Position.Y - area.Y;
		if (dx is < 0 or > 255 || dy is < 0 or > 255)
		{
			throw new InvalidDataException($"Tile {tile.Position} does not belong to area {area.X},{area.Y},{area.Z}.");
		}

		using var buffer = new MemoryStream();
		buffer.WriteByte((byte)dx);
		buffer.WriteByte((byte)dy);
		if (tile.HouseId is { } houseId)
		{
			Span<byte> house = stackalloc byte[4];
			BinaryPrimitives.WriteUInt32LittleEndian(house, houseId);
			buffer.Write(house);
		}

		if (tile.Flags != OtbmTileFlag.None)
		{
			buffer.WriteByte((byte)OtbmAttribute.TileFlags);
			Span<byte> flags = stackalloc byte[4];
			BinaryPrimitives.WriteUInt32LittleEndian(flags, (uint)tile.Flags);
			buffer.Write(flags);
		}

		return buffer.ToArray();
	}

	public static byte[] WriteItemProps(OtbmPlacedItem item)
	{
		using var buffer = new MemoryStream();
		WriteU16(buffer, (ushort)item.Id);
		WriteOptionalU16(buffer, OtbmAttribute.ActionId, item.ActionId);
		WriteOptionalU16(buffer, OtbmAttribute.UniqueId, item.UniqueId);
		WriteOptionalU8(buffer, OtbmAttribute.Count, item.Count);
		WriteOptionalU16(buffer, OtbmAttribute.Charges, item.Charges);
		WriteOptionalU16(buffer, OtbmAttribute.DepotId, item.DepotId);
		WriteOptionalU8(buffer, OtbmAttribute.HouseDoorId, item.HouseDoorId);

		if (item.Text is { } text)
		{
			WriteString(buffer, OtbmAttribute.Text, text);
		}

		if (item.Teleport is { } dest)
		{
			buffer.WriteByte((byte)OtbmAttribute.TeleDest);
			WriteU16(buffer, (ushort)dest.X);
			WriteU16(buffer, (ushort)dest.Y);
			buffer.WriteByte((byte)dest.Z);
		}

		foreach (var unknown in item.Unknown)
		{
			buffer.WriteByte(unknown.Type);
			if (unknown.Hex.Length == 0)
			{
				continue;
			}

			buffer.Write(Convert.FromHexString(unknown.Hex));
		}

		return buffer.ToArray();
	}

	public static void WriteTile(OtbmWriter writer, OtbmPlacedTile tile, TileAreaBase area)
	{
		var type = tile.HouseId.HasValue ? OtbmNodeType.HouseTile : OtbmNodeType.Tile;
		writer.WriteNodeStart(type, WriteTileProps(tile, area));
		foreach (var item in tile.Items)
		{
			WriteItem(writer, item);
		}

		writer.WriteNodeEnd();
	}

	public static void WriteItem(OtbmWriter writer, OtbmPlacedItem item)
	{
		writer.WriteNodeStart(OtbmNodeType.Item, WriteItemProps(item));
		foreach (var child in item.Contents)
		{
			WriteItem(writer, child);
		}

		writer.WriteNodeEnd();
	}

	static void ReadTileAttributes(ReadOnlySpan<byte> props, OtbmPlacedTile tile)
	{
		var offset = 0;
		while (offset < props.Length)
		{
			var attr = props[offset++];
			if (attr == (byte)OtbmAttribute.TileFlags)
			{
				if (offset + 4 > props.Length)
				{
					return;
				}

				tile.Flags = (OtbmTileFlag)BinaryPrimitives.ReadUInt32LittleEndian(props[offset..]);
				offset += 4;
			}
			else if (attr == (byte)OtbmAttribute.Item)
			{
				if (offset + 2 > props.Length)
				{
					return;
				}

				tile.Items.Add(new OtbmPlacedItem { Id = BinaryPrimitives.ReadUInt16LittleEndian(props[offset..]) });
				offset += 2;
			}
			else
			{
				return;
			}
		}
	}

	static void ReadItemAttributes(ReadOnlySpan<byte> props, ref int offset, OtbmPlacedItem item)
	{
		while (offset < props.Length)
		{
			var attr = props[offset++];
			if (attr == 0)
			{
				return;
			}

			switch ((OtbmAttribute)attr)
			{
				case OtbmAttribute.Count:
				case OtbmAttribute.RuneCharges:
				case OtbmAttribute.HouseDoorId:
				case OtbmAttribute.DecayingState:
					if (!TryReadU8(props, ref offset, out var small))
					{
						return;
					}

					AssignSmall(item, (OtbmAttribute)attr, small);
					break;

				case OtbmAttribute.ActionId:
					if (!TryReadU16(props, ref offset, out var actionId))
					{
						return;
					}

					item.ActionId = actionId;
					break;

				case OtbmAttribute.UniqueId:
					if (!TryReadU16(props, ref offset, out var uniqueId))
					{
						return;
					}

					item.UniqueId = uniqueId;
					break;

				case OtbmAttribute.DepotId:
				case OtbmAttribute.Charges:
					if (!TryReadU16(props, ref offset, out var mid))
					{
						return;
					}

					if ((OtbmAttribute)attr == OtbmAttribute.DepotId)
					{
						item.DepotId = mid;
					}
					else
					{
						item.Charges = mid;
					}

					break;

				case OtbmAttribute.TeleDest:
					if (offset + 5 > props.Length)
					{
						return;
					}

					var dx = ReadU16(props, ref offset);
					var dy = ReadU16(props, ref offset);
					var dz = props[offset++];
					item.Teleport = new MapPos(dx, dy, dz);
					break;

				case OtbmAttribute.Text:
				case OtbmAttribute.Desc:
				case OtbmAttribute.WrittenBy:
					if (!TryReadString(props, ref offset, out var text))
					{
						return;
					}

					if ((OtbmAttribute)attr == OtbmAttribute.Text)
					{
						item.Text = text;
					}

					break;

				case OtbmAttribute.Duration:
				case OtbmAttribute.WrittenDate:
				case OtbmAttribute.SleeperGuid:
				case OtbmAttribute.SleepStart:
				case OtbmAttribute.TileFlags:
					if (offset + 4 > props.Length)
					{
						return;
					}

					KeepUnknown(item, attr, props.Slice(offset, 4));
					offset += 4;
					break;

				default:
					KeepUnknown(item, attr, props[offset..]);
					return;
			}
		}
	}

	static void AssignSmall(OtbmPlacedItem item, OtbmAttribute attr, byte value)
	{
		switch (attr)
		{
			case OtbmAttribute.Count:
			case OtbmAttribute.RuneCharges:
				item.Count = value;
				break;
			case OtbmAttribute.HouseDoorId:
				item.HouseDoorId = value;
				break;
		}
	}

	static void KeepUnknown(OtbmPlacedItem item, byte type, ReadOnlySpan<byte> payload) =>
		item.Unknown.Add(new OtbmRawAttribute
		{
			Type = type,
			Hex = Convert.ToHexString(payload)
		});

	static ushort ReadU16(ReadOnlySpan<byte> data, ref int offset)
	{
		var value = BinaryPrimitives.ReadUInt16LittleEndian(data[offset..]);
		offset += 2;
		return value;
	}

	static bool TryReadU8(ReadOnlySpan<byte> data, ref int offset, out byte value)
	{
		if (offset >= data.Length)
		{
			value = 0;
			return false;
		}

		value = data[offset++];
		return true;
	}

	static bool TryReadU16(ReadOnlySpan<byte> data, ref int offset, out ushort value)
	{
		if (offset + 2 > data.Length)
		{
			value = 0;
			return false;
		}

		value = ReadU16(data, ref offset);
		return true;
	}

	static bool TryReadString(ReadOnlySpan<byte> data, ref int offset, out string value)
	{
		value = "";
		if (!TryReadU16(data, ref offset, out var length) || offset + length > data.Length)
		{
			return false;
		}

		value = Encoding.Latin1.GetString(data.Slice(offset, length));
		offset += length;
		return true;
	}

	static void WriteU16(Stream stream, ushort value)
	{
		Span<byte> bytes = stackalloc byte[2];
		BinaryPrimitives.WriteUInt16LittleEndian(bytes, value);
		stream.Write(bytes);
	}

	static void WriteOptionalU8(Stream stream, OtbmAttribute attr, int? value)
	{
		if (value is not { } number)
		{
			return;
		}

		stream.WriteByte((byte)attr);
		stream.WriteByte((byte)number);
	}

	static void WriteOptionalU16(Stream stream, OtbmAttribute attr, int? value)
	{
		if (value is not { } number)
		{
			return;
		}

		stream.WriteByte((byte)attr);
		WriteU16(stream, (ushort)number);
	}

	static void WriteString(Stream stream, OtbmAttribute attr, string value)
	{
		var bytes = Encoding.Latin1.GetBytes(value);
		stream.WriteByte((byte)attr);
		WriteU16(stream, (ushort)bytes.Length);
		stream.Write(bytes);
	}
}
