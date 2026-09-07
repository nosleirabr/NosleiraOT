using System.Buffers.Binary;

namespace Ot74.Map.Sprites;

/// <summary>One thing in Tibia.dat (item or outfit), with the sprites and layout used to draw it.</summary>
public sealed class DatThing
{
	public int ClientId { get; init; }
	public byte Width { get; init; }
	public byte Height { get; init; }
	public byte Layers { get; init; }
	public byte PatternX { get; init; }
	public byte PatternY { get; init; }
	public byte Frames { get; init; }

	/// <summary>Pixels to subtract from the tile origin (7.4 displacement flag → 8,8).</summary>
	public int DrawOffsetX { get; init; }
	public int DrawOffsetY { get; init; }

	/// <summary>Extra elevation in pixels (both axes), from the elevation flag.</summary>
	public int Elevation { get; init; }

	public List<int> SpriteIds { get; } = new();

	/// <summary>
	/// Sprite index order matches RME <c>getHardwareID</c> for 7.4 (no pattern_z byte in the file):
	/// <c>((((frame * patternY + py) * patternX + px) * layers + layer) * height + cy) * width + cx</c>.
	/// </summary>
	public int SpriteIndex(int cx, int cy, int layer, int patternX, int patternY, int frame = 0)
	{
		var px = PatternX <= 1 ? 0 : patternX % PatternX;
		var py = PatternY <= 1 ? 0 : patternY % PatternY;
		var fr = Frames <= 1 ? 0 : frame % Frames;
		return ((((fr * PatternY + py) * PatternX + px) * Layers + layer) * Height + cy) * Width + cx;
	}
}

/// <summary>Tibia 7.4 .dat reader (signature 0x41BF619C). Flag layout matches RME DAT_FORMAT_74.</summary>
public sealed class DatReader
{
	const byte DatFlagLast = 255;
	const byte DatFlagGround = 0;
	const byte DatFlagWritable = 8;
	const byte DatFlagWritableOnce = 9;
	const byte DatFlagForceUse = 6;
	const byte DatFlagMultiUse = 7;
	const byte DatFlagLight = 21;
	const byte DatFlagDisplacement = 24;
	const byte DatFlagElevation = 25;
	const byte DatFlagMinimapColor = 28;
	const byte DatFlagLensHelp = 29;
	const byte DatFlagFullGround = 30;
	const byte DatFlagCloth = 32;
	const byte DatFlagMarket = 33;
	const byte DatFlagUsable = 34;
	const byte DatFlagFloorChange = 252;
	const byte DatFlagRotateable = 20;
	const byte DatFlagLyingCorpse = 26;
	const byte DatFlagHangable = 17;
	const byte DatFlagHookSouth = 18;
	const byte DatFlagHookEast = 19;
	const byte DatFlagAnimateAlways = 27;

	readonly Dictionary<int, DatThing> _things;

	DatReader(uint signature, int itemCount, int outfitCount, Dictionary<int, DatThing> things)
	{
		Signature = signature;
		ItemCount = itemCount;
		OutfitCount = outfitCount;
		_things = things;
	}

	public uint Signature { get; }
	/// <summary>Last item client id in Tibia.dat header (7.4 RME: outfits at <c>ItemCount + lookType</c>).</summary>
	public int ItemCount { get; }
	public int OutfitCount { get; }
	public IReadOnlyDictionary<int, DatThing> Things => _things;

	/// <summary>Maps server look type to Tibia.dat client thing id (prefers <c>ItemCount + lookType</c>).</summary>
	public int? ResolveOutfitClientId(int lookType)
	{
		if (lookType <= 0)
		{
			return null;
		}

		var offsetId = ItemCount + lookType;
		if (_things.ContainsKey(offsetId))
		{
			return offsetId;
		}

		return _things.ContainsKey(lookType) ? lookType : null;
	}

	public static DatReader Load(string path)
	{
		var data = File.ReadAllBytes(path);
		var cursor = 0;
		var signature = ReadU32(data, ref cursor);
		var itemCount = ReadU16(data, ref cursor);
		var outfitCount = ReadU16(data, ref cursor);
		_ = ReadU16(data, ref cursor); // effects
		_ = ReadU16(data, ref cursor); // missiles
		var maxId = itemCount + outfitCount;
		var things = new Dictionary<int, DatThing>();

		for (var id = 100; id <= maxId; id++)
		{
			var flags = SkipFlags74(data, ref cursor);
			var width = ReadU8(data, ref cursor);
			var height = ReadU8(data, ref cursor);
			if (width > 1 || height > 1)
			{
				cursor++; // exact size
			}

			var layers = Math.Max((byte)1, ReadU8(data, ref cursor));
			var patternX = Math.Max((byte)1, ReadU8(data, ref cursor));
			var patternY = Math.Max((byte)1, ReadU8(data, ref cursor));
			// 7.4 has no pattern_z byte — RME forces pattern_z = 1.
			var frames = Math.Max((byte)1, ReadU8(data, ref cursor));
			var count = width * height * layers * patternX * patternY * frames;
			var thing = new DatThing
			{
				ClientId = id,
				Width = width,
				Height = height,
				Layers = layers,
				PatternX = patternX,
				PatternY = patternY,
				Frames = frames,
				DrawOffsetX = flags.DrawOffsetX,
				DrawOffsetY = flags.DrawOffsetY,
				Elevation = flags.Elevation
			};
			for (var i = 0; i < count; i++)
			{
				thing.SpriteIds.Add(ReadU16(data, ref cursor));
			}

			things[id] = thing;
		}

		return new DatReader(signature, itemCount, outfitCount, things);
	}

	readonly struct FlagExtras
	{
		public int DrawOffsetX { get; init; }
		public int DrawOffsetY { get; init; }
		public int Elevation { get; init; }
	}

	static FlagExtras SkipFlags74(byte[] data, ref int cursor)
	{
		var offsetX = 0;
		var offsetY = 0;
		var elevation = 0;
		for (var i = 0; i < DatFlagLast; i++)
		{
			var raw = ReadU8(data, ref cursor);
			if (raw == DatFlagLast)
			{
				return new FlagExtras { DrawOffsetX = offsetX, DrawOffsetY = offsetY, Elevation = elevation };
			}

			var flag = RemapFlag74(raw);
			switch (flag)
			{
				case DatFlagGround:
				case DatFlagWritable:
				case DatFlagWritableOnce:
				case DatFlagCloth:
				case DatFlagLensHelp:
				case DatFlagUsable:
				case DatFlagMinimapColor:
					cursor += 2;
					break;
				case DatFlagElevation:
					elevation = ReadU16(data, ref cursor);
					break;
				case DatFlagLight:
					cursor += 4;
					break;
				case DatFlagDisplacement:
					// Pre-7.55: no bytes; RME hardcodes 8,8.
					offsetX = 8;
					offsetY = 8;
					break;
				case DatFlagMarket:
					cursor += 6;
					var nameLen = ReadU16(data, ref cursor);
					cursor += nameLen + 4;
					break;
			}
		}

		throw new InvalidDataException("Tibia.dat flags did not end with 0xFF.");
	}

	static byte RemapFlag74(byte flag)
	{
		if (flag is > 0 and <= 15)
		{
			flag += 1;
		}
		else if (flag == 16)
		{
			flag = DatFlagLight;
		}
		else if (flag == 17)
		{
			flag = DatFlagFloorChange;
		}
		else if (flag == 18)
		{
			flag = DatFlagFullGround;
		}
		else if (flag == 19)
		{
			flag = DatFlagElevation;
		}
		else if (flag == 20)
		{
			flag = DatFlagDisplacement;
		}
		else if (flag == 22)
		{
			flag = DatFlagMinimapColor;
		}
		else if (flag == 23)
		{
			flag = DatFlagRotateable;
		}
		else if (flag == 24)
		{
			flag = DatFlagLyingCorpse;
		}
		else if (flag == 25)
		{
			flag = DatFlagHangable;
		}
		else if (flag == 26)
		{
			flag = DatFlagHookSouth;
		}
		else if (flag == 27)
		{
			flag = DatFlagHookEast;
		}
		else if (flag == 28)
		{
			flag = DatFlagAnimateAlways;
		}

		if (flag == DatFlagMultiUse)
		{
			return DatFlagForceUse;
		}

		if (flag == DatFlagForceUse)
		{
			return DatFlagMultiUse;
		}

		return flag;
	}

	static byte ReadU8(byte[] data, ref int cursor)
	{
		if (cursor >= data.Length)
		{
			throw new InvalidDataException("Tibia.dat truncated while reading metadata.");
		}

		return data[cursor++];
	}

	static ushort ReadU16(byte[] data, ref int cursor)
	{
		if (cursor + 2 > data.Length)
		{
			throw new InvalidDataException("Tibia.dat truncated while reading a u16.");
		}

		var value = BinaryPrimitives.ReadUInt16LittleEndian(data.AsSpan(cursor));
		cursor += 2;
		return value;
	}

	static uint ReadU32(byte[] data, ref int cursor)
	{
		if (cursor + 4 > data.Length)
		{
			throw new InvalidDataException("Tibia.dat truncated while reading a u32.");
		}

		var value = BinaryPrimitives.ReadUInt32LittleEndian(data.AsSpan(cursor));
		cursor += 4;
		return value;
	}
}
