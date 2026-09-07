using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Turns region scans into exact patches using the Lua injector walk: x then y, skip if actionId
/// is already set. Must run before the overlay rewrite so uid assignment does not follow OTBM
/// tile-area order.
/// </summary>
public static class QuestScanExpander
{
	public static List<QuestDocument> Expand(string otbmPath, IReadOnlyList<QuestDocument> quests)
	{
		if (!quests.Any(quest => quest.Scans.Count > 0))
		{
			return [..quests];
		}

		return Expand(Collect(otbmPath, quests), quests);
	}

	/// <summary>Expands scans against an already-loaded tile dictionary (baseline-free builds).</summary>
	/// <remarks>
	/// Does not mutate <paramref name="tiles"/>. Exact patches and scan hits are returned as
	/// patches so <see cref="SourceCompiler"/> / <see cref="OverlayCompiler"/> apply each once.
	/// Pre-applying here used to stamp uid twice on stacked boxes (TFS Duplicate unique id).
	/// </remarks>
	public static List<QuestDocument> Expand(
		Dictionary<MapPos, OtbmPlacedTile> tiles,
		IReadOnlyList<QuestDocument> quests)
	{
		if (!quests.Any(quest => quest.Scans.Count > 0))
		{
			return [..quests];
		}

		// Exact patches claim items first so scans skip them (Lua: skip if actionId set).
		var reserved = ReserveExactPatchTargets(tiles, quests);

		var expanded = new List<QuestDocument>(quests.Count);
		foreach (var quest in quests)
		{
			var extra = new List<QuestPatch>();
			foreach (var scan in quest.Scans)
			{
				extra.AddRange(AssignScan(scan, tiles, reserved));
			}

			expanded.Add(new QuestDocument
			{
				Kind = quest.Kind,
				Name = quest.Name,
				Patches = [..quest.Patches, ..extra],
				Boxes = quest.Boxes,
				Scans = []
			});
		}

		return expanded;
	}

	static HashSet<OtbmPlacedItem> ReserveExactPatchTargets(
		Dictionary<MapPos, OtbmPlacedTile> tiles,
		IReadOnlyList<QuestDocument> quests)
	{
		var reserved = new HashSet<OtbmPlacedItem>(ReferenceEqualityComparer.Instance);
		foreach (var quest in quests)
		{
			foreach (var patch in quest.Patches)
			{
				if (!tiles.TryGetValue(patch.Position, out var tile))
				{
					continue;
				}

				var item = QuestPatcher.FindPatchTarget(tile, patch);
				if (item is not null)
				{
					reserved.Add(item);
				}
			}
		}

		return reserved;
	}

	static List<QuestPatch> AssignScan(
		QuestScan scan,
		Dictionary<MapPos, OtbmPlacedTile> tiles,
		HashSet<OtbmPlacedItem> reserved)
	{
		var patches = new List<QuestPatch>();
		IReadOnlyList<int> preferred = scan.Match.Count > 0 ? scan.Match : QuestPatcher.DefaultMatchIds;
		var assigned = 0;
		var center = scan.CenterPos;
		for (var x = center.X - scan.Radius; x <= center.X + scan.Radius && assigned < scan.Uids.Count; x++)
		{
			for (var y = center.Y - scan.Radius; y <= center.Y + scan.Radius && assigned < scan.Uids.Count; y++)
			{
				var pos = new MapPos(x, y, center.Z);
				if (!tiles.TryGetValue(pos, out var tile))
				{
					continue;
				}

				var item = QuestPatcher.FindByPreferredIds(tile, preferred, reserved);
				if (item is null || item.ActionId is > 0)
				{
					continue;
				}

				var uid = scan.Uids[assigned++];
				reserved.Add(item);
				patches.Add(new QuestPatch
				{
					At = [pos.X, pos.Y, pos.Z],
					Aid = scan.Aid,
					Uid = uid,
					Match = [..preferred]
				});
			}
		}

		return patches;
	}

	static Dictionary<MapPos, OtbmPlacedTile> Collect(string otbmPath, IReadOnlyList<QuestDocument> quests)
	{
		var tiles = new Dictionary<MapPos, OtbmPlacedTile>();
		using var reader = OtbmReader.Open(otbmPath);
		TileAreaBase? area = null;
		while (reader.Read())
		{
			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.TileArea)
			{
				area = TileAreaBase.Parse(reader.ReadProps());
				continue;
			}

			if (area is not { } current || reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = RegionExtractor.ReadTileTree(reader, current);
			if (!AnyScanContains(quests, tile.Position))
			{
				continue;
			}

			tiles[tile.Position] = tile;
		}

		return tiles;
	}

	static bool AnyScanContains(IReadOnlyList<QuestDocument> quests, MapPos pos)
	{
		foreach (var quest in quests)
		{
			foreach (var scan in quest.Scans)
			{
				if (scan.Contains(pos))
				{
					return true;
				}
			}
		}

		return false;
	}
}
