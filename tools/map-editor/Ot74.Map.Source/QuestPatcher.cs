using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Merges quest attributes onto items that already sit on a tile. Never replaces the tile stack.
/// Contents are added only when the matched item has no children yet (empty container).
/// Com <c>id:</c> explícito e sem item correspondente, cria o item (espelha <c>Game.createItem</c> dos injectors).
/// </summary>
public static class QuestPatcher
{
	/// <summary>
	/// Item ids the Lua injectors looked for when a patch does not name a <c>match</c> list:
	/// chests/boxes/coffins, sarcophagi, levers, teleports, and the doors those scripts touched.
	/// </summary>
	public static readonly int[] DefaultMatchIds =
	[
		1738, 1739, 1740, 1741, 1745, 1746, 1747, 1748, 1749, 1750, 1751, 1752, 1753,
		1770, 1774, 1775, 2720, 3058,
		1408, 1409,
		1945, 1946,
		1386, 1387,
		1209, 1210, 1211, 1213, 1227
	];

	static readonly HashSet<int> DefaultMatch = [..DefaultMatchIds];

	public static Dictionary<MapPos, List<QuestPatch>> Index(IEnumerable<QuestDocument> quests)
	{
		var index = new Dictionary<MapPos, List<QuestPatch>>();
		foreach (var quest in quests)
		{
			foreach (var patch in quest.Patches)
			{
				if (!index.TryGetValue(patch.Position, out var list))
				{
					list = [];
					index[patch.Position] = list;
				}

				list.Add(patch);
			}
		}

		return index;
	}

	public static bool Apply(OtbmPlacedTile tile, IReadOnlyList<QuestPatch> patches)
	{
		var any = false;
		foreach (var patch in patches)
		{
			any |= Apply(tile, patch);
		}

		return any;
	}

	public static bool Apply(OtbmPlacedTile tile, QuestPatch patch)
	{
		var item = FindItem(tile, patch);
		if (item is null)
		{
			// Sem id explícito não inventamos geometria — só attrs em itens do realmap.
			if (patch.Id is not { } createId)
			{
				return false;
			}

			item = new OtbmPlacedItem { Id = createId };
			tile.Items.Add(item);
		}

		if (patch.Aid is { } aid)
		{
			item.ActionId = aid;
		}

		if (patch.Uid is { } uid)
		{
			item.UniqueId = uid;
		}

		if (patch.Transform is { } transform)
		{
			item.Id = transform;
		}

		// Lua só enchia o baú se ainda estivesse vazio.
		if (patch.Contents.Count > 0 && item.Contents.Count == 0)
		{
			foreach (var child in patch.Contents)
			{
				item.Contents.Add(RegionMapper.ToItem(child));
			}
		}

		return true;
	}

	public static OtbmPlacedItem? FindPatchTarget(OtbmPlacedTile tile, QuestPatch patch) =>
		FindItem(tile, patch);

	static OtbmPlacedItem? FindItem(OtbmPlacedTile tile, QuestPatch patch)
	{
		if (patch.Id is { } id)
		{
			return FindByPreferredIds(tile, [id]);
		}

		if (patch.Match.Count > 0)
		{
			return FindByPreferredIds(tile, patch.Match);
		}

		return FindByPreferredIds(tile, DefaultMatchIds);
	}

	/// <summary>
	/// Lua used <c>getItemById</c> in chest-id list order, not stack order. Prefer that so a
	/// crate on top of a chest still loses to the chest id listed first.
	/// When several items share a preferred id (e.g. two levers on one tile), prefer ones
	/// that still have no actionid so successive patches can each claim a distinct item.
	/// </summary>
	public static OtbmPlacedItem? FindByPreferredIds(
		OtbmPlacedTile tile,
		IReadOnlyList<int> preferredIds,
		ISet<OtbmPlacedItem>? reserved = null)
	{
		OtbmPlacedItem? fallback = null;
		foreach (var id in preferredIds)
		{
			foreach (var item in tile.Items)
			{
				if (item.Id != id)
				{
					continue;
				}

				if (reserved is not null && reserved.Contains(item))
				{
					continue;
				}

				if (item.ActionId is null or 0)
				{
					return item;
				}

				fallback ??= item;
			}
		}

		return fallback;
	}

	/// <summary>True when this item looks like a 7.4 door (closed or open).</summary>
	public static bool IsDoor(int itemId) =>
		(itemId is >= 1209 and <= 1262) || (itemId is >= 5107 and <= 5115);

	public static void ApplyScansAndBoxes(OtbmPlacedTile tile, QuestBakeState state)
	{
		foreach (var scan in state.Scans)
		{
			if (scan.Next >= scan.Scan.Uids.Count || !scan.Scan.Contains(tile.Position))
			{
				continue;
			}

			IReadOnlyList<int> preferred = scan.Scan.Match.Count > 0 ? scan.Scan.Match : DefaultMatchIds;
			var item = FindByPreferredIds(tile, preferred);
			if (item is null || item.ActionId is > 0)
			{
				continue;
			}

			item.ActionId = scan.Scan.Aid;
			item.UniqueId = scan.Scan.Uids[scan.Next++];
		}

		foreach (var box in state.Boxes)
		{
			if (!box.Contains(tile.Position))
			{
				continue;
			}

			foreach (var item in tile.Items)
			{
				if (box.Kind == "door" && !IsDoor(item.Id))
				{
					continue;
				}

				if (box.Kind == "chest" && !DefaultMatch.Contains(item.Id))
				{
					continue;
				}

				item.ActionId = box.Aid;
			}
		}
	}
}

/// <summary>Mutable uid assignment for region scans (one pass over the map).</summary>
public sealed class QuestBakeState
{
	public List<ScanCursor> Scans { get; } = new();
	public List<QuestAidBox> Boxes { get; } = new();

	public static QuestBakeState From(IEnumerable<QuestDocument> quests)
	{
		var state = new QuestBakeState();
		foreach (var quest in quests)
		{
			foreach (var scan in quest.Scans)
			{
				state.Scans.Add(new ScanCursor { Scan = scan });
			}

			state.Boxes.AddRange(quest.Boxes);
		}

		return state;
	}

	public bool Touches(TileAreaBase area) =>
		Scans.Any(cursor => Overlaps(cursor.Scan, area)) || Boxes.Any(box => Overlaps(box, area));

	static bool Overlaps(QuestScan scan, TileAreaBase area)
	{
		var c = scan.CenterPos;
		if (c.Z != area.Z)
		{
			return false;
		}

		return c.X + scan.Radius >= area.X
			&& c.X - scan.Radius < area.X + TileAreaBase.BlockSize
			&& c.Y + scan.Radius >= area.Y
			&& c.Y - scan.Radius < area.Y + TileAreaBase.BlockSize;
	}

	static bool Overlaps(QuestAidBox box, TileAreaBase area)
	{
		if (box.FromPos.Z > area.Z || box.ToPos.Z < area.Z)
		{
			return false;
		}

		return box.FromPos.X < area.X + TileAreaBase.BlockSize
			&& box.ToPos.X >= area.X
			&& box.FromPos.Y < area.Y + TileAreaBase.BlockSize
			&& box.ToPos.Y >= area.Y;
	}
}

public sealed class ScanCursor
{
	public required QuestScan Scan { get; init; }
	public int Next { get; set; }
}
