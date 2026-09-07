using Ot74.Map.Source;
using System.Text.Json;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class ViewerEditStoreTests
{
	[Fact]
	public void Save_patches_viewer_tiles_json_in_place()
	{
		var dir = Path.Combine(Path.GetTempPath(), $"ot74-viewer-json-{Guid.NewGuid():N}");
		Directory.CreateDirectory(dir);
		try
		{
			File.WriteAllText(Path.Combine(dir, "tiles.json"), """
				{"origin":[100,200,7],"size":[2,1],"tiles":[{"at":[100,200,7],"items":[{"id":106}]}]}
				""");

			var first = """
				{"tiles":[{"at":[100,200,7],"items":[{"id":106},{"id":1026}]}]}
				""";
			ViewerEditStore.Save(first, dir, sectorsDir: null, spawnXmlPath: null);
			using (var doc = JsonDocument.Parse(File.ReadAllText(Path.Combine(dir, "tiles.json"))))
			{
				var tiles = doc.RootElement.GetProperty("tiles");
				Assert.Equal(1, tiles.GetArrayLength());
				Assert.Equal(2, tiles[0].GetProperty("items").GetArrayLength());
				Assert.Equal(1026, tiles[0].GetProperty("items")[1].GetProperty("id").GetInt32());
			}

			var wipe = """
				{"tiles":[{"at":[100,200,7],"items":[]}]}
				""";
			ViewerEditStore.Save(wipe, dir, sectorsDir: null, spawnXmlPath: null);
			using (var doc = JsonDocument.Parse(File.ReadAllText(Path.Combine(dir, "tiles.json"))))
			{
				Assert.Equal(0, doc.RootElement.GetProperty("tiles").GetArrayLength());
			}
		}
		finally
		{
			Directory.Delete(dir, recursive: true);
		}
	}

	[Fact]
	public void Save_patches_sector_yaml_layers_used_by_build()
	{
		var dir = Path.Combine(Path.GetTempPath(), $"ot74-viewer-yaml-{Guid.NewGuid():N}");
		var sectors = Path.Combine(dir, "sectors");
		var shard = Path.Combine(sectors, "7_0_0");
		Directory.CreateDirectory(shard);
		try
		{
			File.WriteAllText(Path.Combine(shard, "ground.yaml"), """
				kind: sector-layer
				name: 7_0_0/ground
				origin: [0, 0, 7]
				size: [256, 256]
				tiles:
				  - at: [10, 20, 7]
				    items:
				      - id: 106
				""");

			var json = """
				{"tiles":[{"at":[10,20,7],"items":[{"id":106},{"id":1026}]}]}
				""";
			ViewerEditStore.Save(json, viewerDir: null, sectors, spawnXmlPath: null);

			var ground = MapYaml.DeserializeRegion(File.ReadAllText(Path.Combine(shard, "ground.yaml")));
			Assert.Single(ground.Tiles);
			Assert.Equal(106, ground.Tiles[0].Items[0].Id);

			var walls = MapYaml.DeserializeRegion(File.ReadAllText(Path.Combine(shard, "walls.yaml")));
			Assert.Single(walls.Tiles);
			Assert.Equal(1026, walls.Tiles[0].Items[0].Id);
		}
		finally
		{
			Directory.Delete(dir, recursive: true);
		}
	}

	[Fact]
	public void Save_patches_matching_spawn_node_without_dropping_others()
	{
		var dir = Path.Combine(Path.GetTempPath(), $"ot74-viewer-spawn-{Guid.NewGuid():N}");
		Directory.CreateDirectory(dir);
		try
		{
			var xmlPath = Path.Combine(dir, "world-spawn.xml");
			File.WriteAllText(xmlPath, """
				<?xml version="1.0"?>
				<spawns>
					<spawn centerx="1" centery="1" centerz="7" radius="1">
						<monster name="keep-me" x="0" y="0" z="7" spawntime="60" />
					</spawn>
					<spawn centerx="99" centery="99" centerz="7" radius="1"><monster name="compact" x="0" y="0" z="7" spawntime="60" /></spawn>
					<spawn centerx="10" centery="10" centerz="7" radius="3">
						<monster name="rat" x="0" y="0" z="7" spawntime="60" />
					</spawn>
				</spawns>
				""");

			var json = """
				{"spawns":[{"center":[10,10,7],"radius":3,"creatures":[{"kind":"monster","name":"rat","at":[11,10,7],"spawntime":60}]}]}
				""";
			ViewerEditStore.Save(json, viewerDir: null, sectorsDir: null, xmlPath);
			var xml = File.ReadAllText(xmlPath);
			Assert.Contains("keep-me", xml);
			Assert.Contains("centerx=\"10\"", xml);
			Assert.Contains("x=\"1\"", xml);
			Assert.Contains("<spawn centerx=\"99\" centery=\"99\" centerz=\"7\" radius=\"1\"><monster name=\"compact\" x=\"0\" y=\"0\" z=\"7\" spawntime=\"60\" /></spawn>", xml);
			Assert.DoesNotContain("x=\"0\"", xml.Split("centerx=\"10\"")[1].Split("</spawn>")[0]);
		}
		finally
		{
			Directory.Delete(dir, recursive: true);
		}
	}
}
