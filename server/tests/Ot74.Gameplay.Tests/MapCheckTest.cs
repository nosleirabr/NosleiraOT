using System.IO;
using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public class MapCheckTest
{
	private readonly WorldCatalog _catalog;

	public MapCheckTest(WorldCatalogFixture fixture)
	{
		_catalog = fixture.Catalog;
	}

	[Fact]
	public void CheckTiles()
	{
		for (int x = 32098; x <= 32103; x++)
		{
			var tile = _catalog.Map.GetTile(x, 32205, 8);
			if (tile != null && tile.Ground != null)
			{
				System.Console.WriteLine($"Tile {x}: Ground={tile.Ground.Id}");
			}
		}
	}
}
