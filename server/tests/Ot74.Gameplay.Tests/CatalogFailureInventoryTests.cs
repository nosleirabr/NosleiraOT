using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class CatalogFailureInventoryTests
{
	readonly WorldCatalog _catalog;

	public CatalogFailureInventoryTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Writes_docs_map_datapack_failures()
	{
		var markdown = FailureInventory.RenderMarkdown(_catalog);
		var path = Path.Combine(RepoPaths.Root, "docs", "MAP_DATAPACK_FIX_PLAN.md");
		Directory.CreateDirectory(Path.GetDirectoryName(path)!);
		File.WriteAllText(path, markdown);

		var stale = Path.Combine(RepoPaths.Root, "docs", "CATALOG_FAILURE_INVENTORY.md");
		if (File.Exists(stale))
		{
			File.Delete(stale);
		}

		Assert.True(File.Exists(path), path);
		Assert.Contains("Total findings:", markdown, StringComparison.Ordinal);
		Assert.False(File.Exists(stale), "CATALOG_FAILURE_INVENTORY.md should be merged into MAP_DATAPACK_FIX_PLAN.md");
	}
}
