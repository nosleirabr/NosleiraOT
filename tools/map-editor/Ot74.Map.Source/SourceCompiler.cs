using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Compiles sector shards (+ regions overlays + quests) into a full OTBM without opening a baseline.
/// </summary>
public static class SourceCompiler
{
	public static void Build(SourceWorkspace workspace, string outputPath)
	{
		var tiles = SectorLoader.LoadMergedTiles(workspace);
		foreach (var region in workspace.Regions)
		{
			foreach (var tile in region.Tiles)
			{
				tiles[tile.Position] = RegionMapper.ToTile(tile);
			}
		}

		var viewerDir = Path.GetFullPath(Path.Combine(workspace.Root, "..", "build", "viewer"));
		if (Directory.Exists(viewerDir))
		{
			ViewerEditStore.MergePreviewJsonIntoTiles(tiles, viewerDir);
		}

		var quests = QuestScanExpander.Expand(tiles, workspace.Quests);
		var patches = QuestPatcher.Index(quests);
		var bake = QuestBakeState.From(quests);

		foreach (var (pos, list) in patches)
		{
			if (!tiles.TryGetValue(pos, out var tile))
			{
				tile = new OtbmPlacedTile { Position = pos };
				tiles[pos] = tile;
			}

			QuestPatcher.Apply(tile, list);
		}

		foreach (var tile in tiles.Values)
		{
			QuestPatcher.ApplyScansAndBoxes(tile, bake);
		}

		var headerDoc = workspace.Header ?? new WorldHeaderDocument();
		if (headerDoc.Version is < OtbmRootHeader.MinSupportedVersion or > OtbmRootHeader.MaxSupportedVersion)
		{
			headerDoc.Version = 1;
		}

		if (headerDoc.Width == 0)
		{
			headerDoc.Width = 65000;
		}

		if (headerDoc.Height == 0)
		{
			headerDoc.Height = 65000;
		}

		if (headerDoc.MinorVersionItems < OtbmRootHeader.ClientVersion740)
		{
			headerDoc.MinorVersionItems = OtbmRootHeader.ClientVersion740;
		}

		var header = new OtbmRootHeader(
			headerDoc.Version,
			headerDoc.Width,
			headerDoc.Height,
			headerDoc.MajorVersionItems == 0 ? 3 : headerDoc.MajorVersionItems,
			headerDoc.MinorVersionItems);
		header.EnsureLoadableByServer();

		Directory.CreateDirectory(Path.GetDirectoryName(outputPath) ?? ".");
		using var writer = OtbmWriter.Create(outputPath, OtbmSpecialBytes.WildcardIdentifier);
		writer.WriteNodeStart((byte)0, header.ToBytes());
		writer.WriteNodeStart(OtbmNodeType.MapData, EncodeMapData(workspace.MapData));

		foreach (var group in tiles.Values.GroupBy(tile => TileAreaBase.For(tile.Position))
			         .OrderBy(g => g.Key.Z).ThenBy(g => g.Key.Y).ThenBy(g => g.Key.X))
		{
			writer.WriteNodeStart(OtbmNodeType.TileArea, group.Key.ToBytes());
			foreach (var tile in group.OrderBy(t => t.Position.Y).ThenBy(t => t.Position.X))
			{
				OtbmTileCodec.WriteTile(writer, tile, group.Key);
			}

			writer.WriteNodeEnd();
		}

		WriteTowns(writer, workspace.Towns);
		if (header.Version > 1)
		{
			WriteWaypoints(writer, workspace.Waypoints);
		}

		writer.WriteNodeEnd(); // MapData
		writer.WriteNodeEnd(); // root
		writer.EnsureAllNodesClosed();
	}

	static byte[] EncodeMapData(MapDataAttributes? attrs)
	{
		attrs ??= new MapDataAttributes();
		using var buffer = new MemoryStream();
		using (var bin = new BinaryWriter(buffer))
		{
			if (!string.IsNullOrEmpty(attrs.Description))
			{
				bin.Write((byte)OtbmAttribute.Description);
				OtbmPropCodec.WriteString(bin, attrs.Description);
			}

			var spawn = string.IsNullOrEmpty(attrs.SpawnFile) ? "world-spawn.xml" : attrs.SpawnFile;
			bin.Write((byte)OtbmAttribute.ExtSpawnFile);
			OtbmPropCodec.WriteString(bin, spawn);

			var house = string.IsNullOrEmpty(attrs.HouseFile) ? "world-house.xml" : attrs.HouseFile;
			bin.Write((byte)OtbmAttribute.ExtHouseFile);
			OtbmPropCodec.WriteString(bin, house);
		}

		return buffer.ToArray();
	}

	static void WriteTowns(OtbmWriter writer, IReadOnlyList<TownDocument> towns)
	{
		writer.WriteNodeStart(OtbmNodeType.Towns, ReadOnlySpan<byte>.Empty);
		foreach (var town in towns.OrderBy(t => t.Id))
		{
			using var buffer = new MemoryStream();
			using (var bin = new BinaryWriter(buffer))
			{
				bin.Write(town.Id);
				OtbmPropCodec.WriteString(bin, town.Name);
				var temple = town.Temple is { Length: >= 3 }
					? new MapPos(town.Temple[0], town.Temple[1], town.Temple[2])
					: new MapPos(0, 0, 7);
				OtbmPropCodec.WriteDestination(bin, temple);
			}

			writer.WriteNodeStart(OtbmNodeType.Town, buffer.ToArray());
			writer.WriteNodeEnd();
		}

		writer.WriteNodeEnd();
	}

	static void WriteWaypoints(OtbmWriter writer, IReadOnlyList<WaypointDocument> waypoints)
	{
		writer.WriteNodeStart(OtbmNodeType.Waypoints, ReadOnlySpan<byte>.Empty);
		foreach (var wp in waypoints.OrderBy(w => w.Name, StringComparer.Ordinal))
		{
			using var buffer = new MemoryStream();
			using (var bin = new BinaryWriter(buffer))
			{
				OtbmPropCodec.WriteString(bin, wp.Name);
				var at = wp.At is { Length: >= 3 }
					? new MapPos(wp.At[0], wp.At[1], wp.At[2])
					: new MapPos(0, 0, 7);
				OtbmPropCodec.WriteDestination(bin, at);
			}

			writer.WriteNodeStart(OtbmNodeType.Waypoint, buffer.ToArray());
			writer.WriteNodeEnd();
		}

		writer.WriteNodeEnd();
	}
}

/// <summary>Loads and merges sector layer YAMLs into absolute tiles.</summary>
public static class SectorLoader
{
	public static Dictionary<MapPos, OtbmPlacedTile> LoadMergedTiles(SourceWorkspace workspace)
	{
		var tiles = new Dictionary<MapPos, OtbmPlacedTile>();
		var sectorsRoot = workspace.SectorsPath;
		if (sectorsRoot is null || !Directory.Exists(sectorsRoot))
		{
			return tiles;
		}

		foreach (var sectorDir in Directory.GetDirectories(sectorsRoot).OrderBy(p => p, StringComparer.Ordinal))
		{
			var merged = new Dictionary<string, TileDocument>();
			foreach (var layer in ItemLayerClassifier.LoadOrder)
			{
				var path = Path.Combine(sectorDir, ItemLayerClassifier.FileName(layer));
				if (!File.Exists(path))
				{
					continue;
				}

				var doc = MapYaml.DeserializeRegion(File.ReadAllText(path));
				foreach (var tile in doc.Tiles)
				{
					var key = $"{tile.At[0]},{tile.At[1]},{tile.At[2]}";
					if (!merged.TryGetValue(key, out var dest))
					{
						dest = new TileDocument
						{
							At = tile.At,
							Flags = tile.Flags,
							House = tile.House
						};
						merged[key] = dest;
					}
					else
					{
						dest.Flags ??= tile.Flags;
						dest.House ??= tile.House;
					}

					dest.Items.AddRange(tile.Items);
				}
			}

			foreach (var tile in merged.Values)
			{
				tiles[tile.Position] = RegionMapper.ToTile(tile);
			}
		}

		return tiles;
	}
}
