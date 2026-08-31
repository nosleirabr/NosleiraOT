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
}
