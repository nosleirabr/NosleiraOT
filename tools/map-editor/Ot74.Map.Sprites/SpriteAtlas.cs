using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.Json;

namespace Ot74.Map.Sprites;

public static class SpriteAtlas
{
	public static void Build(SprReader sprites, string outputDir, int maxSprites = 256)
	{
		Directory.CreateDirectory(outputDir);
		var count = Math.Min(maxSprites, sprites.Count);
		var columns = 16;
		var rows = (count + columns - 1) / columns;
		var width = columns * SpritePixels.Size;
		var height = Math.Max(SpritePixels.Size, rows * SpritePixels.Size);
		var canvas = new byte[width * height * 4];
		var index = new Dictionary<string, object>
		{
			["tile"] = SpritePixels.Size,
			["columns"] = columns,
			["count"] = count,
			["png"] = "atlas.png"
		};

		for (var id = 1; id <= count; id++)
		{
			var sprite = sprites.Decode(id);
			var col = (id - 1) % columns;
			var row = (id - 1) / columns;
			Blit(canvas, width, sprite.Rgba, col * SpritePixels.Size, row * SpritePixels.Size);
		}

		var pngPath = Path.Combine(outputDir, "atlas.png");
		PngWriter.WriteRgba(pngPath, width, height, canvas);
		File.WriteAllText(Path.Combine(outputDir, "atlas.json"), JsonSerializer.Serialize(index));
	}

	/// <summary>
	/// Packs every sprite id referenced by the given client things, plus a things index the
	/// viewer uses to blit multi-tile objects (trees, walls) with Cipsoft offsets.
	/// </summary>
	public static void BuildClientAtlas(
		DatReader dat,
		SprReader spr,
		IEnumerable<int> clientIds,
		string outputDir)
	{
		Directory.CreateDirectory(outputDir);
		var ids = clientIds
			.Where(id => dat.Things.TryGetValue(id, out var thing) && thing.SpriteIds.Count > 0)
			.Distinct()
			.OrderBy(id => id)
			.ToList();

		var spriteIds = ids
			.SelectMany(id => dat.Things[id].SpriteIds)
			.Where(id => id > 0)
			.Distinct()
			.OrderBy(id => id)
			.ToList();

		var columns = Math.Max(1, (int)Math.Ceiling(Math.Sqrt(Math.Max(1, spriteIds.Count))));
		var rows = Math.Max(1, (spriteIds.Count + columns - 1) / columns);
		var width = columns * SpritePixels.Size;
		var height = rows * SpritePixels.Size;
		var canvas = new byte[width * height * 4];
		var bySpriteId = new Dictionary<string, object>();

		for (var i = 0; i < spriteIds.Count; i++)
		{
			var spriteId = spriteIds[i];
			var col = i % columns;
			var row = i / columns;
			Blit(canvas, width, spr.Decode(spriteId).Rgba, col * SpritePixels.Size, row * SpritePixels.Size);
			bySpriteId[spriteId.ToString()] = new { x = col * SpritePixels.Size, y = row * SpritePixels.Size };
		}

		var things = new Dictionary<string, object>();
		foreach (var clientId in ids)
		{
			var thing = dat.Things[clientId];
			things[clientId.ToString()] = new
			{
				w = thing.Width,
				h = thing.Height,
				layers = thing.Layers,
				px = thing.PatternX,
				py = thing.PatternY,
				frames = thing.Frames,
				dx = thing.DrawOffsetX,
				dy = thing.DrawOffsetY,
				elev = thing.Elevation,
				sprites = thing.SpriteIds
			};
		}

		PngWriter.WriteRgba(Path.Combine(outputDir, "atlas.png"), width, height, canvas);
		File.WriteAllText(
			Path.Combine(outputDir, "atlas.json"),
			JsonSerializer.Serialize(new
			{
				tile = SpritePixels.Size,
				columns,
				count = spriteIds.Count,
				png = "atlas.png",
				bySpriteId,
				things
			}));
	}

	/// <summary>
	/// Atlas compacto com o primeiro sprite de cada item — paleta do editor no viewer.
	/// </summary>
	public static void BuildPaletteAtlas(
		DatReader dat,
		SprReader spr,
		IEnumerable<int> clientIds,
		string outputDir)
	{
		Directory.CreateDirectory(outputDir);
		var ids = clientIds
			.Where(id => dat.Things.TryGetValue(id, out var thing) && thing.SpriteIds.Count > 0)
			.Distinct()
			.OrderBy(id => id)
			.ToList();

		var columns = Math.Max(1, (int)Math.Ceiling(Math.Sqrt(Math.Max(1, ids.Count))));
		var rows = Math.Max(1, (ids.Count + columns - 1) / columns);
		var width = columns * SpritePixels.Size;
		var height = Math.Max(SpritePixels.Size, rows * SpritePixels.Size);
		var canvas = new byte[width * height * 4];
		var byClientId = new Dictionary<string, object>();

		for (var i = 0; i < ids.Count; i++)
		{
			var clientId = ids[i];
			var thing = dat.Things[clientId];
			var spriteId = thing.SpriteIds[0];
			if (spriteId <= 0)
			{
				continue;
			}

			var col = i % columns;
			var row = i / columns;
			var x = col * SpritePixels.Size;
			var y = row * SpritePixels.Size;
			Blit(canvas, width, spr.Decode(spriteId).Rgba, x, y);
			byClientId[clientId.ToString()] = new { x, y };
		}

		PngWriter.WriteRgba(Path.Combine(outputDir, "palette.png"), width, height, canvas);
		File.WriteAllText(
			Path.Combine(outputDir, "palette.json"),
			JsonSerializer.Serialize(new
			{
				tile = SpritePixels.Size,
				columns,
				count = ids.Count,
				png = "palette.png",
				byClientId
			}));
	}

	public static string HashPixels(SpritePixels sprite) => Convert.ToHexString(SHA256.HashData(sprite.Rgba));

	static void Blit(byte[] dest, int destWidth, byte[] src, int x, int y)
	{
		for (var row = 0; row < SpritePixels.Size; row++)
		{
			var destOff = ((y + row) * destWidth + x) * 4;
			var srcOff = row * SpritePixels.Size * 4;
			Buffer.BlockCopy(src, srcOff, dest, destOff, SpritePixels.Size * 4);
		}
	}
}

static class PngWriter
{
	static readonly byte[] Magic = [137, 80, 78, 71, 13, 10, 26, 10];

	public static void WriteRgba(string path, int width, int height, byte[] rgba)
	{
		using var output = File.Create(path);
		output.Write(Magic);
		WriteChunk(output, "IHDR"u8, Hdr(width, height));
		WriteChunk(output, "IDAT"u8, DeflateScanlines(width, height, rgba));
		WriteChunk(output, "IEND"u8, []);
	}

	static byte[] Hdr(int width, int height)
	{
		var hdr = new byte[13];
		System.Buffers.Binary.BinaryPrimitives.WriteInt32BigEndian(hdr, width);
		System.Buffers.Binary.BinaryPrimitives.WriteInt32BigEndian(hdr.AsSpan(4), height);
		hdr[8] = 8;
		hdr[9] = 6;
		return hdr;
	}

	static byte[] DeflateScanlines(int width, int height, byte[] rgba)
	{
		using var buffer = new MemoryStream();
		using (var zlib = new ZLibStream(buffer, CompressionLevel.Fastest, leaveOpen: true))
		{
			var stride = width * 4;
			for (var y = 0; y < height; y++)
			{
				zlib.WriteByte(0);
				zlib.Write(rgba, y * stride, stride);
			}
		}

		return buffer.ToArray();
	}

	static void WriteChunk(Stream output, ReadOnlySpan<byte> type, byte[] payload)
	{
		Span<byte> len = stackalloc byte[4];
		System.Buffers.Binary.BinaryPrimitives.WriteInt32BigEndian(len, payload.Length);
		output.Write(len);
		output.Write(type);
		output.Write(payload);
		var crc = Crc32(type, payload);
		System.Buffers.Binary.BinaryPrimitives.WriteUInt32BigEndian(len, crc);
		output.Write(len);
	}

	static uint Crc32(ReadOnlySpan<byte> type, byte[] payload)
	{
		var crc = 0xFFFFFFFFu;
		foreach (var b in type)
		{
			crc = CrcTable[(crc ^ b) & 0xFF] ^ (crc >> 8);
		}

		foreach (var b in payload)
		{
			crc = CrcTable[(crc ^ b) & 0xFF] ^ (crc >> 8);
		}

		return crc ^ 0xFFFFFFFFu;
	}

	static readonly uint[] CrcTable = CreateCrcTable();

	static uint[] CreateCrcTable()
	{
		var table = new uint[256];
		for (uint n = 0; n < 256; n++)
		{
			var c = n;
			for (var k = 0; k < 8; k++)
			{
				c = (c & 1) != 0 ? 0xEDB88320u ^ (c >> 1) : c >> 1;
			}

			table[n] = c;
		}

		return table;
	}
}
