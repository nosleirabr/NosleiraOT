using Ot74.Map.Core.Otbm;
using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class MapImportTests
{
	[Fact]
	public void Import_of_an_exported_mini_map_returns_the_same_yaml()
	{
		var origin = new MapPos(200, 200, 7);
		var tile = new OtbmPlacedTile { Position = origin };
		tile.Items.Add(new OtbmPlacedItem { Id = 106 }); // grass
		tile.Items.Add(new OtbmPlacedItem { Id = 1740 }); // chest
		var path = OtbmMini.WriteTemp([tile]);
		try
		{
			var exported = RegionExtractor.Extract(path, "sample", origin, 1, 1);
			exported.Fidelity = "non-74";
			var (imported, report) = MapImporter.Import(path, origin, 1, 1, "sample", destItems: null, requireMapped: false);
			Assert.Equal(0, report.Unmapped);
			Assert.Equal(MapYaml.Serialize(exported), MapYaml.Serialize(imported));
		}
		finally
		{
			File.Delete(path);
		}
	}

	[Fact]
	public void Import_fails_when_an_item_id_is_missing_from_items_xml()
	{
		var origin = new MapPos(201, 201, 7);
		var tile = new OtbmPlacedTile { Position = origin };
		tile.Items.Add(new OtbmPlacedItem { Id = 999999 });
		var path = OtbmMini.WriteTemp([tile]);
		var items = ItemsXmlIndex.Load(RepoPaths.ItemsXml);
		try
		{
			Assert.Throws<InvalidDataException>(() =>
				MapImporter.Import(path, origin, 1, 1, "bad", items, requireMapped: true));
		}
		finally
		{
			File.Delete(path);
		}
	}
}
