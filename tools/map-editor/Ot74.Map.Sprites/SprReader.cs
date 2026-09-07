using System.Buffers.Binary;

namespace Ot74.Map.Sprites;

/// <summary>Decoded 32x32 sprite. Magenta (255,0,255) is stored with alpha 0.</summary>
public sealed class SpritePixels
{
	public const int Size = 32;
	public required byte[] Rgba { get; init; }
}

/// <summary>Tibia 7.4 .spr reader (signature 0x41B9EA86). Sprite ids are 16-bit; not extended.</summary>
public sealed class SprReader
{
	public static readonly uint Signature740 = 0x41B9EA86;

	readonly byte[] _data;
	readonly uint[] _offsets;

	SprReader(uint signature, byte[] data, uint[] offsets)
	{
		Signature = signature;
		_data = data;
		_offsets = offsets;
	}

	public uint Signature { get; }
	public int Count => _offsets.Length;

	public static SprReader Load(string path)
	{
		var data = File.ReadAllBytes(path);
		var signature = BinaryPrimitives.ReadUInt32LittleEndian(data);
		var count = BinaryPrimitives.ReadUInt16LittleEndian(data.AsSpan(4));
		var offsets = new uint[count];
		for (var i = 0; i < count; i++)
		{
			offsets[i] = BinaryPrimitives.ReadUInt32LittleEndian(data.AsSpan(6 + i * 4));
		}

		return new SprReader(signature, data, offsets);
	}

	public SpritePixels Decode(int spriteId)
	{
		var rgba = new byte[SpritePixels.Size * SpritePixels.Size * 4];
		if (spriteId <= 0 || spriteId > _offsets.Length)
		{
			return new SpritePixels { Rgba = rgba };
		}

		var offset = _offsets[spriteId - 1];
		if (offset == 0 || offset + 5 > (uint)_data.Length)
		{
			return new SpritePixels { Rgba = rgba };
		}

		var pos = (int)offset + 3;
		var payloadSize = BinaryPrimitives.ReadUInt16LittleEndian(_data.AsSpan(pos));
		pos += 2;
		var end = pos + payloadSize;
		var pixel = 0;
		const int total = SpritePixels.Size * SpritePixels.Size;

		while (pos + 4 <= end && pixel < total)
		{
			var transparent = BinaryPrimitives.ReadUInt16LittleEndian(_data.AsSpan(pos));
			pos += 2;
			var colored = BinaryPrimitives.ReadUInt16LittleEndian(_data.AsSpan(pos));
			pos += 2;
			pixel += transparent;
			for (var i = 0; i < colored && pixel < total && pos + 3 <= end; i++, pixel++)
			{
				var o = pixel * 4;
				rgba[o] = _data[pos++];
				rgba[o + 1] = _data[pos++];
				rgba[o + 2] = _data[pos++];
				var magenta = rgba[o] == 255 && rgba[o + 1] == 0 && rgba[o + 2] == 255;
				rgba[o + 3] = magenta ? (byte)0 : (byte)255;
			}
		}

		return new SpritePixels { Rgba = rgba };
	}
}
