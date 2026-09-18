using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class SpawnMonsterTests
{
	readonly WorldCatalog _catalog;

	public SpawnMonsterTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Spawned_monsters_have_xml()
	{
		var missing = _catalog.SpawnedMonsterNames
			.Distinct(StringComparer.OrdinalIgnoreCase)
			.Where(name => !_catalog.MonsterNames.Contains(name))
			.OrderBy(n => n, StringComparer.OrdinalIgnoreCase)
			.ToList();

		Assert.True(missing.Count == 0, Failures.Format("Spawn monsters without data/monster XML", missing));
	}

	/// <summary>
	/// Monstros endgame essenciais do 7.4 devem ter spawn no mapa real.
	/// </summary>
	[Fact]
	public void Critical_74_monsters_are_spawned()
	{
		// Monstros que obrigatoriamente precisam spawnar no realmap 7.4
		var requiredMonsters = new[]
		{
			"Demon", "Dragon Lord", "Behemoth", "Warlock",
			"Giant Spider", "Hero", "Black Knight", "Banshee",
			"Dragon"
		};

		var spawned = _catalog.SpawnedMonsterNames
			.ToHashSet(StringComparer.OrdinalIgnoreCase);

		var missing = requiredMonsters
			.Where(name => !spawned.Contains(name))
			.ToList();

		Assert.True(missing.Count == 0, Failures.Format("Critical 7.4 monsters missing from map spawns", missing));
	}
}
