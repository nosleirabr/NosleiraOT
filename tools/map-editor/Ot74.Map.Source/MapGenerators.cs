using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>Deterministic YAML generators for empty maps, toy cities and hunt caves.</summary>
public static class MapGenerators
{
	const int GrassId = 106; // grass
	const int StoneWallId = 1025; // brick wall

	public static RegionDocument Empty(string name, int width, int height, int z = 7) =>
		new()
		{
			Name = name,
			Origin = [100, 100, z],
			Size = [width, height]
		};

	public static RegionDocument City(string name, int seed, int width = 12, int height = 12)
	{
		var random = new Random(seed);
		var region = new RegionDocument
		{
			Name = name,
			Origin = [200, 200, 7],
			Size = [width, height],
			Fidelity = "generated"
		};

		for (var y = 0; y < height; y++)
		{
			for (var x = 0; x < width; x++)
			{
				var tile = new TileDocument { At = [200 + x, 200 + y, 7] };
				tile.Items.Add(new ItemDocument { Id = GrassId });
				var edge = x == 0 || y == 0 || x == width - 1 || y == height - 1;
				if (edge && random.Next(3) != 0)
				{
					tile.Items.Add(new ItemDocument { Id = StoneWallId });
				}

				region.Tiles.Add(tile);
			}
		}

		return region;
	}

	public static RegionDocument Hunt(string name, int seed, int width = 10, int height = 10)
	{
		var random = new Random(seed);
		var region = new RegionDocument
		{
			Name = name,
			Origin = [300, 300, 8],
			Size = [width, height],
			Fidelity = "generated"
		};

		for (var y = 0; y < height; y++)
		{
			for (var x = 0; x < width; x++)
			{
				var tile = new TileDocument { At = [300 + x, 300 + y, 8] };
				tile.Items.Add(new ItemDocument { Id = 351 }); // cave floor-ish — dirt
				if (random.Next(8) == 0)
				{
					tile.Items.Add(new ItemDocument { Id = 1285 }); // stone
				}

				region.Tiles.Add(tile);
			}
		}

		return region;
	}

	public static byte[] EmptyOtbm(ushort width, ushort height)
	{
		var header = new OtbmRootHeader(1, width, height, 3, OtbmRootHeader.ClientVersion740);
		using var buffer = new MemoryStream();
		using (var writer = new OtbmWriter(buffer, OtbmSpecialBytes.WildcardIdentifier, leaveOpen: true))
		{
			writer.WriteNodeStart((byte)0, header.ToBytes());
			writer.WriteNodeStart(OtbmNodeType.MapData, ReadOnlySpan<byte>.Empty);
			writer.WriteNodeEnd();
			writer.WriteNodeEnd();
			writer.EnsureAllNodesClosed();
		}

		return buffer.ToArray();
	}

	/// <summary>Copies a prefab so its origin sits at <paramref name="at"/>.</summary>
	public static RegionDocument InstantiatePrefab(RegionDocument prefab, MapPos at)
	{
		var dx = at.X - prefab.OriginPos.X;
		var dy = at.Y - prefab.OriginPos.Y;
		var dz = at.Z - prefab.OriginPos.Z;
		var instance = new RegionDocument
		{
			Name = prefab.Name,
			Origin = [at.X, at.Y, at.Z],
			Size = [prefab.Width, prefab.Height],
			Fidelity = prefab.Fidelity
		};

		foreach (var tile in prefab.Tiles)
		{
			instance.Tiles.Add(new TileDocument
			{
				At = [tile.Position.X + dx, tile.Position.Y + dy, tile.Position.Z + dz],
				Flags = tile.Flags,
				House = tile.House,
				Items = tile.Items.Select(CloneItem).ToList()
			});
		}

		return instance;
	}

	static ItemDocument CloneItem(ItemDocument item) =>
		new()
		{
			Id = item.Id,
			Aid = item.Aid,
			Uid = item.Uid,
			Count = item.Count,
			Charges = item.Charges,
			Depot = item.Depot,
			Door = item.Door,
			Text = item.Text,
			Dest = item.Dest is { } dest ? [..dest] : null,
			Contents = item.Contents.Select(CloneItem).ToList(),
			Unknown = item.Unknown.Select(unknown => new UnknownAttributeDocument { Type = unknown.Type, Hex = unknown.Hex }).ToList()
		};
}
