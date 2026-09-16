using System.IO;
using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public class FindAnnihiTest
{
	private readonly WorldCatalog _catalog;

	public FindAnnihiTest(WorldCatalogFixture fixture)
	{
		_catalog = fixture.Catalog;
	}

	[Fact]
	public void FindChests()
	{
		foreach (var tile in _catalog.Map.Tiles)
		{
			foreach (var item in tile.Items)
			{
				if (item.Id == 1740 || item.Id == 1747 || item.Id == 1748 || item.Id == 1749) // Chests
				{
					if (item.UniqueId == 2494 || item.UniqueId == 2400 || item.UniqueId == 2431)
					{
						System.Console.WriteLine($"Found Annihi UID {item.UniqueId} at {tile.Position.X}, {tile.Position.Y}, {tile.Position.Z}");
					}
					// Also check if they have items inside
					if (item.Attributes != null)
					{
						// in C# parser it might be tricky, let's just check UID 10000 or 5000 etc
					}
				}
			}
		}
	}
}
