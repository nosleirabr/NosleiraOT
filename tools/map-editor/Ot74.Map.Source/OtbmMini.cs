using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>Builds a tiny OTBM from tiles so tests and <c>otmap new</c> do not need the realmap.</summary>
public static class OtbmMini
{
	public static byte[] FromTiles(IReadOnlyList<OtbmPlacedTile> tiles, ushort width = 512, ushort height = 512)
	{
		var header = new OtbmRootHeader(1, width, height, 3, OtbmRootHeader.ClientVersion740);
		using var buffer = new MemoryStream();
		using (var writer = new OtbmWriter(buffer, OtbmSpecialBytes.WildcardIdentifier, leaveOpen: true))
		{
			writer.WriteNodeStart((byte)0, header.ToBytes());
			writer.WriteNodeStart(OtbmNodeType.MapData, ReadOnlySpan<byte>.Empty);
			foreach (var group in tiles.GroupBy(tile => TileAreaBase.For(tile.Position)))
			{
				writer.WriteNodeStart(OtbmNodeType.TileArea, group.Key.ToBytes());
				foreach (var tile in group)
				{
					OtbmTileCodec.WriteTile(writer, tile, group.Key);
				}

				writer.WriteNodeEnd();
			}

			writer.WriteNodeEnd();
			writer.WriteNodeEnd();
			writer.EnsureAllNodesClosed();
		}

		return buffer.ToArray();
	}

	public static string WriteTemp(IReadOnlyList<OtbmPlacedTile> tiles)
	{
		var path = Path.Combine(Path.GetTempPath(), $"ot74-mini-{Guid.NewGuid():N}.otbm");
		File.WriteAllBytes(path, FromTiles(tiles));
		return path;
	}
}
