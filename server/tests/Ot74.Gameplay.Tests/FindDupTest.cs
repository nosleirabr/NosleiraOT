using System.IO;
using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public class FindDupTest
{
	private readonly WorldCatalog _catalog;

	public FindDupTest(WorldCatalogFixture fixture)
	{
		_catalog = fixture.Catalog;
	}

	[Fact]
	public void CheckDupes()
	{
		var tile = _catalog.Map.GetTile(33313, 31591, 15);
		if (tile != null)
		{
			foreach (var item in tile.Items)
			{
				System.Console.WriteLine($"Item at 33313, 31591: ID={item.Id} UID={item.UniqueId} AID={item.ActionId}");
			}
		}
	}
}
