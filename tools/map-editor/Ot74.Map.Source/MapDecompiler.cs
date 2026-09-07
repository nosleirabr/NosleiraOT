using System.Buffers.Binary;
using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Streams an OTBM into sector shards (z_sx_sy / ground|walls|furniture|special.yaml)
/// plus towns, waypoints and mapData attributes — the geometry source for baseline-free builds.
/// </summary>
public static class MapDecompiler
{
	public sealed class Result
	{
		public int TileCount { get; init; }
		public int SectorCount { get; init; }
		public OtbmRootHeader Header { get; init; }
		public required MapBounds Bounds { get; init; }
		public required List<TownDocument> Towns { get; init; }
		public required List<WaypointDocument> Waypoints { get; init; }
		public required MapDataAttributes MapData { get; init; }
		public required List<string> SectorKeys { get; init; }
	}

	public readonly record struct MapBounds(int MinX, int MinY, int MaxX, int MaxY, int MinZ, int MaxZ);

	public static Result DecompileAll(string otbmPath, string sectorsOutDir, string? metaOutDir = null)
	{
		if (Directory.Exists(sectorsOutDir))
		{
			Directory.Delete(sectorsOutDir, recursive: true);
		}

		Directory.CreateDirectory(sectorsOutDir);
		metaOutDir ??= Path.Combine(Path.GetDirectoryName(sectorsOutDir) ?? ".", "meta");
		Directory.CreateDirectory(metaOutDir);

		var sectors = new Dictionary<string, SectorAccum>();
		var towns = new List<TownDocument>();
		var waypoints = new List<WaypointDocument>();
		var mapData = new MapDataAttributes();
		var header = default(OtbmRootHeader);
		var minX = int.MaxValue;
		var minY = int.MaxValue;
		var maxX = int.MinValue;
		var maxY = int.MinValue;
		var minZ = int.MaxValue;
		var maxZ = int.MinValue;
		var tileCount = 0;
		var areas = 0;

		using var reader = OtbmReader.Open(otbmPath);
		TileAreaBase? area = null;
		var inTowns = false;
		var inWaypoints = false;

		while (reader.Read())
		{
			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.Depth <= 1 && header.Width == 0 && reader.NodeType is 0 or (byte)OtbmNodeType.RootV1)
			{
				header = OtbmRootHeader.Parse(reader.ReadProps());
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.MapData)
			{
				mapData = ParseMapDataAttrs(reader.ReadProps());
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.Towns)
			{
				inTowns = true;
				inWaypoints = false;
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.Waypoints)
			{
				inWaypoints = true;
				inTowns = false;
				continue;
			}

			if (inTowns && reader.NodeType == (byte)OtbmNodeType.Town)
			{
				towns.Add(ParseTown(reader.ReadProps()));
				continue;
			}

			if (inWaypoints && reader.NodeType == (byte)OtbmNodeType.Waypoint)
			{
				waypoints.Add(ParseWaypoint(reader.ReadProps()));
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.TileArea)
			{
				inTowns = false;
				inWaypoints = false;
				area = TileAreaBase.Parse(reader.ReadProps());
				areas++;
				if (areas % 5000 == 0)
				{
					Console.WriteLine($"  … {areas} tile-areas, {tileCount} tiles, {sectors.Count} sectors");
				}

				continue;
			}

			if (area is not { } current)
			{
				continue;
			}

			if (reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = RegionExtractor.ReadTileTree(reader, current);
			var pos = tile.Position;
			minX = Math.Min(minX, pos.X);
			minY = Math.Min(minY, pos.Y);
			maxX = Math.Max(maxX, pos.X);
			maxY = Math.Max(maxY, pos.Y);
			minZ = Math.Min(minZ, pos.Z);
			maxZ = Math.Max(maxZ, pos.Z);

			var key = $"{current.Z}_{current.X}_{current.Y}";
			if (!sectors.TryGetValue(key, out var accum))
			{
				accum = new SectorAccum(current.X, current.Y, current.Z);
				sectors[key] = accum;
			}

			accum.Add(RegionMapper.ToDocument(tile));
			tileCount++;
		}

		Console.WriteLine($"  Writing {sectors.Count} sector directories...");
		var keys = new List<string>(sectors.Count);
		foreach (var (key, accum) in sectors.OrderBy(pair => pair.Key, StringComparer.Ordinal))
		{
			keys.Add(key);
			WriteSector(sectorsOutDir, key, accum);
		}

		File.WriteAllText(Path.Combine(metaOutDir, "towns.yaml"), MapYaml.SerializeTowns(towns));
		File.WriteAllText(Path.Combine(metaOutDir, "waypoints.yaml"), MapYaml.SerializeWaypoints(waypoints));
		File.WriteAllText(Path.Combine(metaOutDir, "mapdata.yaml"), MapYaml.SerializeMapData(mapData));
		File.WriteAllText(
			Path.Combine(metaOutDir, "header.yaml"),
			MapYaml.SerializeHeader(new WorldHeaderDocument
			{
				Version = header.Version,
				Width = header.Width,
				Height = header.Height,
				MajorVersionItems = header.MajorVersionItems,
				MinorVersionItems = header.MinorVersionItems
			}));

		var bounds = new MapBounds(minX, minY, maxX, maxY, minZ, maxZ);
		File.WriteAllText(
			Path.Combine(sectorsOutDir, "index.yaml"),
			MapYaml.SerializeSectorIndex(new SectorIndexDocument
			{
				SectorSize = TileAreaBase.BlockSize,
				Bounds = [bounds.MinX, bounds.MinY, bounds.MaxX, bounds.MaxY, bounds.MinZ, bounds.MaxZ],
				Sectors = keys
			}));

		Console.WriteLine($"  Done: {areas} areas → {sectors.Count} sectors, {tileCount} tiles, floors {minZ}-{maxZ}");
		return new Result
		{
			TileCount = tileCount,
			SectorCount = sectors.Count,
			Header = header,
			Bounds = bounds,
			Towns = towns,
			Waypoints = waypoints,
			MapData = mapData,
			SectorKeys = keys
		};
	}

	static void WriteSector(string root, string key, SectorAccum accum)
	{
		var dir = Path.Combine(root, key);
		Directory.CreateDirectory(dir);
		foreach (var layer in ItemLayerClassifier.LoadOrder)
		{
			var tiles = accum.Layers[layer];
			if (tiles.Count == 0)
			{
				continue;
			}

			var doc = new RegionDocument
			{
				Kind = "sector-layer",
				Name = $"{key}/{layer.ToString().ToLowerInvariant()}",
				Origin = [accum.BaseX, accum.BaseY, accum.Z],
				Size = [TileAreaBase.BlockSize, TileAreaBase.BlockSize],
				Tiles = tiles.Values.OrderBy(t => t.At[1]).ThenBy(t => t.At[0]).ToList()
			};
			File.WriteAllText(Path.Combine(dir, ItemLayerClassifier.FileName(layer)), MapYaml.Serialize(doc));
		}
	}

	static MapDataAttributes ParseMapDataAttrs(ReadOnlySpan<byte> props)
	{
		var attrs = new MapDataAttributes();
		var offset = 0;
		while (offset < props.Length)
		{
			var attr = (OtbmAttribute)props[offset++];
			switch (attr)
			{
				case OtbmAttribute.Description:
					attrs.Description = OtbmPropCodec.ReadString(props, ref offset);
					break;
				case OtbmAttribute.ExtSpawnFile:
					attrs.SpawnFile = OtbmPropCodec.ReadString(props, ref offset);
					break;
				case OtbmAttribute.ExtHouseFile:
					attrs.HouseFile = OtbmPropCodec.ReadString(props, ref offset);
					break;
				case OtbmAttribute.ExtFile:
					_ = OtbmPropCodec.ReadString(props, ref offset);
					break;
				default:
					// Unknown map-data attr — stop rather than desync.
					return attrs;
			}
		}

		return attrs;
	}

	static TownDocument ParseTown(ReadOnlySpan<byte> props)
	{
		var offset = 0;
		var id = BinaryPrimitives.ReadUInt32LittleEndian(props);
		offset += 4;
		var name = OtbmPropCodec.ReadString(props, ref offset);
		var temple = OtbmPropCodec.ReadDestination(props, ref offset);
		return new TownDocument
		{
			Id = id,
			Name = name,
			Temple = [temple.X, temple.Y, temple.Z]
		};
	}

	static WaypointDocument ParseWaypoint(ReadOnlySpan<byte> props)
	{
		var offset = 0;
		var name = OtbmPropCodec.ReadString(props, ref offset);
		var at = OtbmPropCodec.ReadDestination(props, ref offset);
		return new WaypointDocument { Name = name, At = [at.X, at.Y, at.Z] };
	}

	sealed class SectorAccum(int baseX, int baseY, int z)
	{
		public int BaseX { get; } = baseX;
		public int BaseY { get; } = baseY;
		public int Z { get; } = z;
		public Dictionary<MapLayer, Dictionary<string, TileDocument>> Layers { get; } = new()
		{
			[MapLayer.Ground] = new(),
			[MapLayer.Walls] = new(),
			[MapLayer.Furniture] = new(),
			[MapLayer.Special] = new()
		};

		public void Add(TileDocument tile)
		{
			var key = $"{tile.At[0]},{tile.At[1]},{tile.At[2]}";
			for (var i = 0; i < tile.Items.Count; i++)
			{
				var item = tile.Items[i];
				var layer = ItemLayerClassifier.Classify(item, isFirstOnTile: i == 0);
				if (!Layers[layer].TryGetValue(key, out var layerTile))
				{
					layerTile = new TileDocument
					{
						At = tile.At,
						Flags = layer == MapLayer.Ground ? tile.Flags : null,
						House = layer == MapLayer.Ground ? tile.House : null
					};
					Layers[layer][key] = layerTile;
				}

				layerTile.Items.Add(item);
			}

			// Flags/house on empty-stack tiles still need a ground entry.
			if (tile.Items.Count == 0)
			{
				Layers[MapLayer.Ground][key] = new TileDocument
				{
					At = tile.At,
					Flags = tile.Flags,
					House = tile.House
				};
			}
		}
	}
}
