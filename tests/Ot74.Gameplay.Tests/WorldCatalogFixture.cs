using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

public sealed class WorldCatalogFixture
{
	public WorldCatalog Catalog { get; } = WorldCatalog.Load();
}

[CollectionDefinition("WorldCatalog")]
public sealed class WorldCatalogCollection : ICollectionFixture<WorldCatalogFixture>
{
}
