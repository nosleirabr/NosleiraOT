using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class MapContractTests
{
	readonly WorldCatalog _catalog;

	public MapContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Otbm_loads_with_realmap_dimensions()
	{
		var otbmPath = RepoPaths.PreferBakedOtbm();
		Assert.True(File.Exists(otbmPath), $"Missing baked or baseline OTBM ({RepoPaths.BakedOtbm} / {RepoPaths.Otbm})");
		Assert.True(_catalog.Map.Width >= 1000, $"Unexpected OTBM width {_catalog.Map.Width}");
		Assert.True(_catalog.Map.Height >= 1000, $"Unexpected OTBM height {_catalog.Map.Height}");
		Assert.True(_catalog.Map.Tiles.Count > 1000, "OTBM parsed no tiles");
	}

	[Fact]
	public void Teleports_have_nonzero_destinations_on_existing_tiles()
	{
		Assert.True(_catalog.Map.Teleports.Count > 0, "Parser found zero teleports — OTBM walk is probably wrong.");

		var bad = new List<string>();
		foreach (var tp in _catalog.Map.Teleports)
		{
			// Ignore Paradox dynamic teleports injected by inject_quests.lua
			if (tp.From.X == 32481 && tp.From.Y == 31905 && tp.From.Z == 1) continue;
			if (tp.From.X == 32479 && tp.From.Y == 31904 && tp.From.Z == 2) continue;
			if (tp.From.X == 32480 && tp.From.Y == 31905 && tp.From.Z == 2) continue; // In case user moved it here

			if (tp.Dest.IsZero)
			{
				bad.Add($"{tp.From} item {tp.ItemId} dest 0,0,0");
			}
			else if (!_catalog.Map.HasTile(tp.Dest))
			{
				bad.Add($"{tp.From} -> {tp.Dest} (dest tile missing)");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Broken teleports", bad));
	}

	[Fact]
	public void Walk_down_floorchanges_land_on_existing_tiles()
	{
		var downs = _catalog.Map.FloorChanges.Where(f => f.Kind.HasFlag(FloorChangeKind.Down)).ToList();
		Assert.True(downs.Count > 0, "Parser found zero floorchange=down items.");

		var bad = new List<string>();
		foreach (var item in downs)
		{
			var dest = FloorChangeResolver.ResolveDown(item.Position, _catalog.Map);
			if (dest.Z > 15 || !_catalog.Map.HasTile(dest))
			{
				bad.Add($"{item.Position} item {item.ItemId} -> {dest}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Walk-down floorchanges without landing tile", bad, take: 100));
	}

	[Fact]
	public void Walk_up_stairs_land_on_existing_tiles()
	{
		var ups = _catalog.Map.FloorChanges
			.Where(f => f.Kind != FloorChangeKind.None && !f.Kind.HasFlag(FloorChangeKind.Down))
			.ToList();
		Assert.True(ups.Count > 0, "Parser found zero walk-up stairs/ramps.");

		var bad = new List<string>();
		foreach (var item in ups)
		{
			if (item.Position.Z <= 0)
			{
				bad.Add($"{item.Position} item {item.ItemId} already on z=0");
				continue;
			}

			var dest = FloorChangeResolver.ResolveUp(item.Position, item.Kind);
			if (dest.Z < 0 || !_catalog.Map.HasTile(dest))
			{
				bad.Add($"{item.Position} item {item.ItemId} {item.Kind} -> {dest}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Walk-up stairs without landing tile", bad, take: 25));
	}

	[Fact]
	public void Rope_spots_have_a_landing()
	{
		Assert.True(_catalog.Map.RopeSpots.Count > 0, "Parser found zero rope spots (global.lua ropeSpots).");

		var bad = _catalog.Map.RopeSpots
			.Where(spot => !FloorChangeResolver.HasRopeLanding(spot.Position, _catalog.Map))
			.Select(spot => $"{spot.Position} item {spot.ItemId}")
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Rope spots without moveUpstairs landing", bad, take: 25));
	}

	[Fact]
	public void Use_up_items_have_a_rope_landing()
	{
		Assert.True(_catalog.Map.UseUpItems.Count > 0, "Parser found zero use-up ladders (teleport.lua upFloorIds).");

		var bad = _catalog.Map.UseUpItems
			.Where(item => !FloorChangeResolver.HasRopeLanding(item.Position, _catalog.Map))
			.Select(item => $"{item.Position} item {item.ItemId}")
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Use-up ladders without moveUpstairs landing", bad, take: 25));
	}

	[Fact]
	public void Use_down_items_have_a_tile_below()
	{
		Assert.True(_catalog.Map.UseDownItems.Count > 0, "Parser found zero use-down ladders (actions.xml teleport.lua minus upFloorIds).");

		var bad = new List<string>();
		foreach (var item in _catalog.Map.UseDownItems)
		{
			var dest = new MapPosition(item.Position.X, item.Position.Y, item.Position.Z + 1);
			if (dest.Z > 15 || !_catalog.Map.HasTile(dest))
			{
				bad.Add($"{item.Position} item {item.ItemId} -> {dest}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Use-down ladders without tile at z+1", bad, take: 25));
	}

	[Fact]
	public void Mailboxes_exist_on_the_map()
	{
		Assert.True(_catalog.Map.Mailboxes.Count > 0, "No mailbox items (2593) found on the OTBM.");
	}

	[Fact]
	public void Level_doors_use_aid_minus_1000_convention()
	{
		var bad = _catalog.Map.LevelDoors
			.Where(d => d.ActionId < 1000)
			.Select(d => $"{d.Position} item {d.ItemId} aid={d.ActionId}")
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Level doors with aid < 1000", bad));
	}

	[Fact]
	public void Travel_harbours_land_on_existing_tiles()
	{
		Assert.True(_catalog.Harbours.Count >= 8, $"Expected TravelHarbours table, found {_catalog.Harbours.Count}");

		var bad = new List<string>();
		foreach (var harbour in _catalog.Harbours)
		{
			if (!_catalog.Map.HasTile(harbour.Position))
			{
				bad.Add($"{harbour.Name} {harbour.Position}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Travel harbour dest tiles missing", bad));
	}

	[Fact]
	public void Levers_exist_on_the_map()
	{
		Assert.True(_catalog.Map.Levers.Count > 0, "Parser found zero levers (items.xml name=lever, 1945/1946). OTBM walk or items.xml is probably wrong.");
	}

	[Fact]
	public void Levers_have_actionid_or_uniqueid()
	{
		var none = _catalog.Map.Levers
			.Where(l => l.ActionId == 0 && l.UniqueId == 0)
			.Select(l => $"{l.Position} item {l.ItemId}")
			.ToList();

		Assert.True(none.Count == 0, Failures.Format("Levers without actionid/uniqueid (itemid 1945/1946 only flips the sprite)", none));
	}

	[Fact]
	public void Lever_actionid_or_uniqueid_has_an_existing_script()
	{
		var broken = new List<string>();
		foreach (var lever in _catalog.Map.Levers)
		{
			if (lever.ActionId == 0 && lever.UniqueId == 0)
			{
				continue;
			}

			if (!_catalog.Actions.TryResolve(lever.UniqueId, lever.ActionId, out var handler))
			{
				broken.Add($"{lever.Position} item {lever.ItemId} aid={lever.ActionId} uid={lever.UniqueId} (no actions.xml uniqueid/actionid)");
				continue;
			}

			if (!handler.ScriptExists)
			{
				broken.Add($"{lever.Position} item {lever.ItemId} aid={lever.ActionId} uid={lever.UniqueId} script={handler.Script} (lua missing)");
			}
		}

		Assert.True(broken.Count == 0, Failures.Format("Levers with broken/missing action scripts", broken));
	}
}
