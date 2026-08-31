using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class TravelContractTests
{
	readonly WorldCatalog _catalog;

	public TravelContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Travel_helper_requires_premium()
	{
		var lua = File.ReadAllText(RepoPaths.TravelLua);
		Assert.Contains("premium = true", lua, StringComparison.Ordinal);
	}

	[Fact]
	public void Captains_declare_travel_routes()
	{
		Assert.True(_catalog.TravelRoutes.Count >= 20, $"Expected travel routes from NPC scripts, found {_catalog.TravelRoutes.Count}");
	}

	[Fact]
	public void Travel_harbour_keys_exist()
	{
		var known = _catalog.Harbours.Select(h => h.Name).ToHashSet(StringComparer.Ordinal);
		var missing = _catalog.TravelRoutes
			.Where(r => !known.Contains(r.HarbourName))
			.Select(r => $"{r.NpcFile} '{r.Keyword}' -> TravelHarbours.{r.HarbourName}")
			.Distinct()
			.ToList();

		Assert.True(missing.Count == 0, Failures.Format("Travel routes pointing at unknown TravelHarbours keys", missing));
	}

	[Fact]
	public void Travel_destinations_have_tiles()
	{
		var bad = _catalog.TravelRoutes
			.Where(r => r.Destination.IsZero || !_catalog.Map.HasTile(r.Destination))
			.Select(r => $"{r.NpcFile} '{r.Keyword}' {r.HarbourName} {r.Destination}")
			.Distinct()
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Travel destinations without a map tile", bad));
	}

	[Fact]
	public void Extra_StdModule_travel_requires_premium()
	{
		var free = _catalog.TravelRoutes
			.Where(r => r.Keyword == "(StdModule.travel)" && !r.Premium)
			.Select(r => $"{r.NpcFile} {r.HarbourName}")
			.Distinct()
			.ToList();

		Assert.True(free.Count == 0, Failures.Format("StdModule.travel without premium = true (free accounts would sail)", free));
	}
}
