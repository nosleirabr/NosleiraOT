using Ot74.Map.Core.Otbm;
using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class QuestBakeTests
{
	const int ChestId = 1740; // chest

	[Fact]
	public void Patch_writes_action_and_unique_id_onto_existing_item()
	{
		var pos = new MapPos(120, 120, 7);
		var baseline = OtbmMini.WriteTemp(
		[
			new OtbmPlacedTile { Position = pos, Items = { new OtbmPlacedItem { Id = ChestId } } }
		]);
		var built = Path.Combine(Path.GetTempPath(), $"ot74-bake-{Guid.NewGuid():N}.otbm");

		try
		{
			var quest = new QuestDocument
			{
				Name = "patch",
				Patches =
				{
					new QuestPatch { At = [pos.X, pos.Y, pos.Z], Aid = 2000, Uid = 10010 }
				}
			};
			OverlayCompiler.Build(baseline, [], [quest], built);
			var item = ExtractItem(built, pos);
			Assert.Equal(2000, item.ActionId);
			Assert.Equal(10010, item.UniqueId);
		}
		finally
		{
			File.Delete(baseline);
			File.Delete(built);
		}
	}

	[Fact]
	public void Scan_assigns_uids_west_to_east_then_north_to_south()
	{
		// Lua: for x then for y, so west, then south (same x), then east.
		var west = new MapPos(110, 110, 7);
		var east = new MapPos(112, 110, 7);
		var south = new MapPos(110, 112, 7);
		var baseline = OtbmMini.WriteTemp(
		[
			new OtbmPlacedTile { Position = south, Items = { new OtbmPlacedItem { Id = ChestId } } },
			new OtbmPlacedTile { Position = east, Items = { new OtbmPlacedItem { Id = ChestId } } },
			new OtbmPlacedTile { Position = west, Items = { new OtbmPlacedItem { Id = ChestId } } }
		]);
		var built = Path.Combine(Path.GetTempPath(), $"ot74-scan-{Guid.NewGuid():N}.otbm");

		try
		{
			var quest = new QuestDocument
			{
				Name = "scan",
				Scans =
				{
					new QuestScan
					{
						Center = [111, 111, 7],
						Radius = 2,
						Aid = 2000,
						Uids = [10015, 10026, 10099]
					}
				}
			};
			OverlayCompiler.Build(baseline, [], [quest], built);
			Assert.Equal(10015, ExtractItem(built, west).UniqueId);
			Assert.Equal(10026, ExtractItem(built, south).UniqueId);
			Assert.Equal(10099, ExtractItem(built, east).UniqueId);
		}
		finally
		{
			File.Delete(baseline);
			File.Delete(built);
		}
	}

	[Fact]
	public void Scan_skips_chests_that_already_have_an_action_id()
	{
		var first = new MapPos(130, 130, 7);
		var second = new MapPos(131, 130, 7);
		var baseline = OtbmMini.WriteTemp(
		[
			new OtbmPlacedTile { Position = first, Items = { new OtbmPlacedItem { Id = ChestId } } },
			new OtbmPlacedTile { Position = second, Items = { new OtbmPlacedItem { Id = ChestId } } }
		]);
		var built = Path.Combine(Path.GetTempPath(), $"ot74-skip-{Guid.NewGuid():N}.otbm");

		try
		{
			var quest = new QuestDocument
			{
				Name = "skip",
				Patches = { new QuestPatch { At = [first.X, first.Y, first.Z], Aid = 2000, Uid = 1 } },
				Scans =
				{
					new QuestScan { Center = [130, 130, 7], Radius = 2, Aid = 2000, Uids = [10018] }
				}
			};
			OverlayCompiler.Build(baseline, [], [quest], built);
			Assert.Equal(1, ExtractItem(built, first).UniqueId);
			Assert.Equal(10018, ExtractItem(built, second).UniqueId);
		}
		finally
		{
			File.Delete(baseline);
			File.Delete(built);
		}
	}

	[Fact]
	public void Patch_prefers_chest_id_list_order_over_stack_order()
	{
		var pos = new MapPos(140, 140, 7);
		var tile = new OtbmPlacedTile { Position = pos };
		tile.Items.Add(new OtbmPlacedItem { Id = 1988 }); // parcel sitting on top
		tile.Items.Add(new OtbmPlacedItem { Id = ChestId });
		Assert.Equal(ChestId, QuestPatcher.FindByPreferredIds(tile, QuestPatcher.DefaultMatchIds)!.Id);
	}

	[Fact]
	public void Two_patches_on_same_tile_claim_distinct_unaided_levers()
	{
		const int leverId = 1945;
		var pos = new MapPos(32560, 31896, 12);
		var tile = new OtbmPlacedTile { Position = pos };
		tile.Items.Add(new OtbmPlacedItem { Id = leverId });
		tile.Items.Add(new OtbmPlacedItem { Id = leverId });

		var patches = new List<QuestPatch>
		{
			new() { At = [pos.X, pos.Y, pos.Z], Aid = 50999, Match = [1945, 1946] },
			new() { At = [pos.X, pos.Y, pos.Z], Aid = 50999, Match = [1945, 1946] }
		};

		Assert.True(QuestPatcher.Apply(tile, patches));
		Assert.All(tile.Items.Where(i => i.Id == leverId), i => Assert.Equal(50999, i.ActionId));
	}

	[Fact]
	public void Expand_then_apply_does_not_duplicate_uid_on_stacked_boxes()
	{
		// Mintwallin-style: two boxes on one tile; any quest with scans forces Expand path.
		const int boxId = 1741;
		const int mintwallinUid = 10029;
		var pos = new MapPos(32331, 32262, 8);
		var tiles = new Dictionary<MapPos, OtbmPlacedTile>
		{
			[pos] = new OtbmPlacedTile
			{
				Position = pos,
				Items =
				{
					new OtbmPlacedItem { Id = boxId },
					new OtbmPlacedItem { Id = boxId }
				}
			}
		};
		var quests = new List<QuestDocument>
		{
			new()
			{
				Name = "triggers_expand",
				Scans =
				{
					new QuestScan { Center = [0, 0, 7], Radius = 0, Aid = 2000, Uids = [] }
				}
			},
			new()
			{
				Name = "mintwallin",
				Patches =
				{
					new QuestPatch { At = [pos.X, pos.Y, pos.Z], Aid = 2000, Uid = mintwallinUid }
				}
			}
		};

		var expanded = QuestScanExpander.Expand(tiles, quests);
		var index = QuestPatcher.Index(expanded);
		foreach (var (at, list) in index)
		{
			QuestPatcher.Apply(tiles[at], list);
		}

		var withUid = tiles[pos].Items.Count(i => i.UniqueId == mintwallinUid);
		Assert.Equal(1, withUid);
		Assert.Equal(1, tiles[pos].Items.Count(i => i.UniqueId is null or 0));
	}

	[Fact]
	public void Patch_with_explicit_id_creates_item_when_tile_has_no_match()
	{
		var pos = new MapPos(140, 140, 7);
		var baseline = OtbmMini.WriteTemp(
		[
			new OtbmPlacedTile { Position = pos } // só ground implícito — sem baú
		]);
		var built = Path.Combine(Path.GetTempPath(), $"ot74-create-{Guid.NewGuid():N}.otbm");

		try
		{
			var quest = new QuestDocument
			{
				Name = "create",
				Patches =
				{
					new QuestPatch
					{
						At = [pos.X, pos.Y, pos.Z],
						Id = ChestId,
						Aid = 2000,
						Uid = 10061
					}
				}
			};
			OverlayCompiler.Build(baseline, [], [quest], built);
			var item = ExtractItem(built, pos);
			Assert.Equal(ChestId, item.Id);
			Assert.Equal(2000, item.ActionId);
			Assert.Equal(10061, item.UniqueId);
		}
		finally
		{
			File.Delete(baseline);
			File.Delete(built);
		}
	}

	static OtbmPlacedItem ExtractItem(string otbm, MapPos pos)
	{
		var region = RegionExtractor.Extract(otbm, "q", pos, 1, 1);
		Assert.Single(region.Tiles);
		Assert.NotEmpty(region.Tiles[0].Items);
		return RegionMapper.ToItem(region.Tiles[0].Items[0]);
	}
}
