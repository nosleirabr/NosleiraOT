using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Applies region overlays on top of a baseline OTBM, rewriting only the TILE_AREA nodes that
/// intersect those overlays and copying everything else byte for byte.
/// </summary>
public static class OverlayCompiler
{
	public static void Build(string baselinePath, IReadOnlyList<RegionDocument> regions, string outputPath) =>
		Build(baselinePath, regions, [], outputPath);

	public static void Build(SourceWorkspace workspace, string outputPath)
	{
		if (string.IsNullOrWhiteSpace(workspace.BaselinePath) || !File.Exists(workspace.BaselinePath))
		{
			throw new FileNotFoundException(
				"Overlay build needs a baseline OTBM. Use sector shards + SourceCompiler, or set baseline in world.map.yaml.");
		}

		Build(workspace.BaselinePath, workspace.Regions, workspace.Quests, outputPath, ViewerPreviewDir(workspace));
	}

	public static void Build(
		string baselinePath,
		IReadOnlyList<RegionDocument> regions,
		IReadOnlyList<QuestDocument> quests,
		string outputPath) =>
		Build(baselinePath, regions, quests, outputPath, viewerDir: null);

	public static void Build(
		string baselinePath,
		IReadOnlyList<RegionDocument> regions,
		IReadOnlyList<QuestDocument> quests,
		string outputPath,
		string? viewerDir)
	{
		quests = QuestScanExpander.Expand(baselinePath, quests);
		var overlays = IndexOverlays(regions);
		if (!string.IsNullOrWhiteSpace(viewerDir))
		{
			ViewerEditStore.MergePreviewJsonIntoOverlays(overlays, viewerDir);
		}
		var patches = QuestPatcher.Index(quests);
		var bake = QuestBakeState.From(quests);
		Directory.CreateDirectory(Path.GetDirectoryName(outputPath) ?? ".");

		using var reader = OtbmReader.Open(baselinePath);
		if (!reader.Read())
		{
			throw new InvalidDataException("Baseline OTBM has no root node.");
		}

		using var writer = OtbmWriter.Create(outputPath, reader.Identifier);
		writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);

		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeEnd)
			{
				writer.WriteNodeEnd();
				continue;
			}

			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.TileArea)
			{
				var area = TileAreaBase.Parse(reader.ReadProps());
				if (AreaNeedsRewrite(area, overlays, patches, bake))
				{
					RewriteArea(reader, writer, area, overlays, patches, bake);
				}
				else
				{
					OtbmSubtree.Copy(reader, writer);
				}

				continue;
			}

			writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);
		}

		WriteNewAreas(writer, overlays);
		writer.EnsureAllNodesClosed();
	}

	static Dictionary<string, OtbmPlacedTile> IndexOverlays(IEnumerable<RegionDocument> regions)
	{
		var overlays = new Dictionary<string, OtbmPlacedTile>();
		foreach (var region in regions)
		{
			foreach (var tile in region.Tiles)
			{
				overlays[tile.Position.ToString()] = RegionMapper.ToTile(tile);
			}
		}

		return overlays;
	}

	static bool AreaNeedsRewrite(
		TileAreaBase area,
		Dictionary<string, OtbmPlacedTile> overlays,
		Dictionary<MapPos, List<QuestPatch>> patches,
		QuestBakeState bake) =>
		overlays.Values.Any(tile => area.Contains(tile.Position))
		|| patches.Keys.Any(area.Contains)
		|| bake.Touches(area);

	static void RewriteArea(
		OtbmReader reader,
		OtbmWriter writer,
		TileAreaBase area,
		Dictionary<string, OtbmPlacedTile> overlays,
		Dictionary<MapPos, List<QuestPatch>> patches,
		QuestBakeState bake)
	{
		writer.WriteNodeStart(OtbmNodeType.TileArea, area.ToBytes());

		var startedAt = reader.Depth;
		var written = new HashSet<string>();

		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeEnd && reader.Depth < startedAt)
			{
				break;
			}

			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				OtbmSubtree.Skip(reader);
				continue;
			}

			var original = RegionExtractor.ReadTileTree(reader, area);
			var key = original.Position.ToString();
			// Region overlays replace the whole tile; quest patches then merge attrs onto whatever remains.
			var tile = overlays.TryGetValue(key, out var replacement) ? replacement : original;
			ApplyQuestPatches(tile, patches);
			QuestPatcher.ApplyScansAndBoxes(tile, bake);
			OtbmTileCodec.WriteTile(writer, tile, area);
			written.Add(key);
			overlays.Remove(key);
		}

		foreach (var leftover in overlays.Values.Where(tile => area.Contains(tile.Position)).ToList())
		{
			var key = leftover.Position.ToString();
			if (!written.Add(key))
			{
				continue;
			}

			ApplyQuestPatches(leftover, patches);
			QuestPatcher.ApplyScansAndBoxes(leftover, bake);
			OtbmTileCodec.WriteTile(writer, leftover, area);
			overlays.Remove(key);
		}

		// Patches em tiles que o baseline não tinha (create via id: no QuestPatcher).
		foreach (var (pos, list) in patches.Where(kv => area.Contains(kv.Key)).ToList())
		{
			var key = pos.ToString();
			if (!written.Add(key))
			{
				continue;
			}

			var tile = new OtbmPlacedTile { Position = pos };
			QuestPatcher.Apply(tile, list);
			patches.Remove(pos);
			QuestPatcher.ApplyScansAndBoxes(tile, bake);
			OtbmTileCodec.WriteTile(writer, tile, area);
		}

		writer.WriteNodeEnd();
	}

	static void ApplyQuestPatches(OtbmPlacedTile tile, Dictionary<MapPos, List<QuestPatch>> patches)
	{
		if (!patches.Remove(tile.Position, out var list))
		{
			return;
		}

		QuestPatcher.Apply(tile, list);
	}

	static void WriteNewAreas(OtbmWriter writer, Dictionary<string, OtbmPlacedTile> remaining)
	{
		foreach (var group in remaining.Values.GroupBy(tile => TileAreaBase.For(tile.Position)))
		{
			writer.WriteNodeStart(OtbmNodeType.TileArea, group.Key.ToBytes());
			foreach (var tile in group)
			{
				OtbmTileCodec.WriteTile(writer, tile, group.Key);
			}

			writer.WriteNodeEnd();
		}

		remaining.Clear();
	}

	static string? ViewerPreviewDir(SourceWorkspace workspace)
	{
		var dir = Path.GetFullPath(Path.Combine(workspace.Root, "..", "build", "viewer"));
		return Directory.Exists(dir) ? dir : null;
	}
}
