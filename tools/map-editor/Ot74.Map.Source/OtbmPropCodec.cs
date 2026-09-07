using System.Buffers.Binary;
using System.Text;
using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>Length-prefixed string + coords helpers matching TFS PropStream.</summary>
public static class OtbmPropCodec
{
	public static string ReadString(ReadOnlySpan<byte> data, ref int offset)
	{
		if (offset + 2 > data.Length)
		{
			throw new InvalidDataException("Truncated OTBM string length.");
		}

		var length = BinaryPrimitives.ReadUInt16LittleEndian(data[offset..]);
		offset += 2;
		if (offset + length > data.Length)
		{
			throw new InvalidDataException("Truncated OTBM string payload.");
		}

		var text = Encoding.Latin1.GetString(data.Slice(offset, length));
		offset += length;
		return text;
	}

	public static void WriteString(BinaryWriter writer, string text)
	{
		var bytes = Encoding.Latin1.GetBytes(text);
		if (bytes.Length > ushort.MaxValue)
		{
			throw new InvalidDataException("OTBM string exceeds uint16 length.");
		}

		writer.Write((ushort)bytes.Length);
		writer.Write(bytes);
	}

	public static MapPos ReadDestination(ReadOnlySpan<byte> data, ref int offset)
	{
		if (offset + 5 > data.Length)
		{
			throw new InvalidDataException("Truncated OTBM destination coords.");
		}

		var x = BinaryPrimitives.ReadUInt16LittleEndian(data[offset..]);
		var y = BinaryPrimitives.ReadUInt16LittleEndian(data[(offset + 2)..]);
		var z = data[offset + 4];
		offset += 5;
		return new MapPos(x, y, z);
	}

	public static void WriteDestination(BinaryWriter writer, MapPos pos)
	{
		writer.Write((ushort)pos.X);
		writer.Write((ushort)pos.Y);
		writer.Write((byte)pos.Z);
	}
}
