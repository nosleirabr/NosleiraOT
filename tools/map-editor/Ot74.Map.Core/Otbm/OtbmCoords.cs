using System.Buffers.Binary;

namespace Ot74.Map.Core.Otbm;

/// <summary>Absolute tile position on the map.</summary>
public readonly record struct MapPos(int X, int Y, int Z)
{
	public bool IsInside(MapPos origin, int width, int height) =>
		X >= origin.X && X < origin.X + width && Y >= origin.Y && Y < origin.Y + height && Z == origin.Z;

	public override string ToString() => $"{X},{Y},{Z}";
}

/// <summary>A 256-wide tile-area block, matching <c>OTBM_Destination_coords</c>.</summary>
public readonly record struct TileAreaBase(ushort X, ushort Y, byte Z)
{
	public const int SizeInBytes = 5;
	public const int BlockSize = 256;

	public static TileAreaBase Parse(ReadOnlySpan<byte> properties)
	{
		if (properties.Length < SizeInBytes)
		{
			throw new InvalidDataException("TILE_AREA node is missing its base coordinate.");
		}

		return new TileAreaBase(
			BinaryPrimitives.ReadUInt16LittleEndian(properties),
			BinaryPrimitives.ReadUInt16LittleEndian(properties[2..]),
			properties[4]);
	}

	public byte[] ToBytes()
	{
		var bytes = new byte[SizeInBytes];
		BinaryPrimitives.WriteUInt16LittleEndian(bytes, X);
		BinaryPrimitives.WriteUInt16LittleEndian(bytes.AsSpan(2), Y);
		bytes[4] = Z;
		return bytes;
	}

	public bool Contains(MapPos pos) =>
		pos.Z == Z && pos.X >= X && pos.X < X + BlockSize && pos.Y >= Y && pos.Y < Y + BlockSize;

	public static TileAreaBase For(MapPos pos) =>
		new((ushort)(pos.X & ~(BlockSize - 1)), (ushort)(pos.Y & ~(BlockSize - 1)), (byte)pos.Z);

	public bool Intersects(MapPos origin, int width, int height, int z)
	{
		if (z != Z)
		{
			return false;
		}

		var maxX = X + BlockSize;
		var maxY = Y + BlockSize;
		return origin.X < maxX && origin.X + width > X && origin.Y < maxY && origin.Y + height > Y;
	}
}
