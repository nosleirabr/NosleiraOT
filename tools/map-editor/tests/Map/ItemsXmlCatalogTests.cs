using Ot74.Map.Items;
using Ot74.Map.Source;
using Ot74.Map.Sprites;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class ItemsXmlCatalogTests
{
	[Fact]
	public void Catalog_groups_ground_walls_doors_and_containers()
	{
		var catalog = ItemsXmlCatalog.Load(RepoPaths.ItemsXml);
		var grass = catalog.Items.Single(item => item.Id == 106);
		var wall = catalog.Items.Single(item => item.Id == 1026);
		var door = catalog.Items.Single(item => item.Id == 1209);
		var chest = catalog.Items.Single(item => item.Id == 1740);
		Assert.Equal("ground", ItemsXmlCatalog.ClassifyGroup(grass));
		Assert.Equal("walls", ItemsXmlCatalog.ClassifyGroup(wall));
		Assert.Equal("doors", ItemsXmlCatalog.ClassifyGroup(door));
		Assert.Equal("containers", ItemsXmlCatalog.ClassifyGroup(chest));
	}

	[Fact]
	public void Catalog_json_includes_enums_and_client_ids()
	{
		var catalog = ItemsXmlCatalog.Load(RepoPaths.ItemsXml);
		var otb = ItemsOtb.Load(Path.Combine(RepoPaths.Data, "items", "items.otb"));
		var dir = Path.Combine(Path.GetTempPath(), $"ot74-catalog-{Guid.NewGuid():N}");
		Directory.CreateDirectory(dir);
		try
		{
			var path = Path.Combine(dir, "items.json");
			catalog.WriteJson(path, otb.ServerToClient);
			var json = File.ReadAllText(path);
			Assert.Contains("\"type\"", json);
			Assert.Contains("container", json);
			Assert.Contains("floorchange", json);
			Assert.Contains("weaponType", json);
			Assert.Contains("\"id\":1740", json);
			Assert.Contains("\"container\":true", json);
			Assert.Contains("\"group\":\"containers\"", json);
			Assert.True(catalog.Items.Count > 1000, "items.xml should expand to more than 1000 ids.");
		}
		finally
		{
			Directory.Delete(dir, recursive: true);
		}
	}

	[Fact]
	public void Palette_atlas_packs_first_sprite_of_known_items()
	{
		var datPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.dat");
		var sprPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.spr");
		var otbPath = Path.Combine(RepoPaths.Data, "items", "items.otb");
		if (!File.Exists(datPath) || !File.Exists(sprPath) || !File.Exists(otbPath))
		{
			return;
		}

		var dat = DatReader.Load(datPath);
		var spr = SprReader.Load(sprPath);
		var otb = ItemsOtb.Load(otbPath);
		Assert.True(otb.TryGetClientId(1740, out var chestClient));
		var dir = Path.Combine(Path.GetTempPath(), $"ot74-palette-{Guid.NewGuid():N}");
		try
		{
			SpriteAtlas.BuildPaletteAtlas(dat, spr, [chestClient, 100], dir);
			Assert.True(File.Exists(Path.Combine(dir, "palette.png")));
			var json = File.ReadAllText(Path.Combine(dir, "palette.json"));
			Assert.Contains($"\"{chestClient}\"", json);
			Assert.Contains("byClientId", json);
		}
		finally
		{
			if (Directory.Exists(dir))
			{
				Directory.Delete(dir, recursive: true);
			}
		}
	}
}
