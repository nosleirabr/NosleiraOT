using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class MapGeneratorTests
{
	[Fact]
	public void Same_city_seed_produces_identical_yaml()
	{
		var first = MapYaml.Serialize(MapGenerators.City("town", seed: 42));
		var second = MapYaml.Serialize(MapGenerators.City("town", seed: 42));
		Assert.Equal(first, second);
	}

	[Fact]
	public void Different_city_seeds_diverge()
	{
		var first = MapYaml.Serialize(MapGenerators.City("town", seed: 1));
		var second = MapYaml.Serialize(MapGenerators.City("town", seed: 2));
		Assert.NotEqual(first, second);
	}

	[Fact]
	public void Generated_city_passes_item_validation()
	{
		var items = ItemsXmlIndex.Load(RepoPaths.ItemsXml);
		var issues = SourceValidator.Validate([MapGenerators.City("town", seed: 7)], items);
		Assert.Empty(issues);
	}

	[Fact]
	public void Generated_hunt_passes_item_validation()
	{
		var items = ItemsXmlIndex.Load(RepoPaths.ItemsXml);
		var issues = SourceValidator.Validate([MapGenerators.Hunt("cave", seed: 7)], items);
		Assert.Empty(issues);
	}

	[Fact]
	public void Prefab_instance_is_shifted_by_the_requested_origin()
	{
		var prefab = MapGenerators.City("block", seed: 3, width: 4, height: 4);
		var instance = MapGenerators.InstantiatePrefab(prefab, new Ot74.Map.Core.Otbm.MapPos(500, 500, 7));
		Assert.Equal(new[] { 500, 500, 7 }, instance.Origin);
		Assert.All(instance.Tiles, tile =>
		{
			Assert.InRange(tile.Position.X, 500, 503);
			Assert.InRange(tile.Position.Y, 500, 503);
		});
	}

	[Fact]
	public void Empty_otbm_has_a_loadable_header()
	{
		var bytes = MapGenerators.EmptyOtbm(128, 128);
		using var stream = new MemoryStream(bytes);
		using var reader = new Ot74.Map.Core.Otbm.OtbmReader(stream);
		Assert.True(reader.Read());
		var header = Ot74.Map.Core.Otbm.OtbmRootHeader.Parse(reader.ReadProps());
		header.EnsureLoadableByServer();
		Assert.Equal((ushort)128, header.Width);
	}
}
