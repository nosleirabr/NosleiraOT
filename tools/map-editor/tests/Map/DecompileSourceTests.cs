using Ot74.Map.Core.Otbm;
using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class DecompileSourceTests
{
	[Fact]
	public void Classifier_routes_attributed_items_to_special()
	{
		var lever = new ItemDocument { Id = 1945, Aid = 30017 };
		Assert.Equal(MapLayer.Special, ItemLayerClassifier.Classify(lever, isFirstOnTile: false));

		var ground = new ItemDocument { Id = 106 };
		Assert.Equal(MapLayer.Ground, ItemLayerClassifier.Classify(ground, isFirstOnTile: true));

		var wall = new ItemDocument { Id = 1025 };
		Assert.Equal(MapLayer.Walls, ItemLayerClassifier.Classify(wall, isFirstOnTile: false));
	}

	[Fact]
	public void Decompile_then_source_build_round_trips_tiles_logically()
	{
		var tiles = new List<OtbmPlacedTile>
		{
			new()
			{
				Position = new MapPos(32000, 32000, 7),
				Items =
				{
					new OtbmPlacedItem { Id = 106 },
					new OtbmPlacedItem { Id = 1025 },
					new OtbmPlacedItem { Id = 1945, ActionId = 30017 }
				}
			},
			new()
			{
				Position = new MapPos(32001, 32000, 7),
				HouseId = 42,
				Items = { new OtbmPlacedItem { Id = 106 } }
			}
		};

		var otbm = OtbmMini.WriteTemp(tiles);
		var srcRoot = Path.Combine(Path.GetTempPath(), $"ot74-src-{Guid.NewGuid():N}");
		var sectors = Path.Combine(srcRoot, "sectors");
		var meta = Path.Combine(srcRoot, "meta");
		var built = Path.Combine(Path.GetTempPath(), $"ot74-built-{Guid.NewGuid():N}.otbm");

		try
		{
			Directory.CreateDirectory(srcRoot);
			File.WriteAllText(Path.Combine(srcRoot, "world.map.yaml"), """
				kind: world
				name: test
				sectors: sectors
				regions: []
				quests: []
				townsFile: meta/towns.yaml
				waypointsFile: meta/waypoints.yaml
				mapDataFile: meta/mapdata.yaml
				headerFile: meta/header.yaml
				""");

			var result = MapDecompiler.DecompileAll(otbm, sectors, meta);
			Assert.Equal(2, result.TileCount);
			Assert.True(Directory.Exists(Path.Combine(sectors, "7_31744_31744"))
				|| Directory.GetDirectories(sectors).Length >= 1);

			var workspace = SourceWorkspace.Load(srcRoot);
			Assert.True(workspace.HasSectorShards);
			SourceCompiler.Build(workspace, built);

			var reloaded = RegionExtractor.Extract(built, "round", new MapPos(32000, 32000, 7), 2, 1);
			Assert.Equal(2, reloaded.Tiles.Count);

			var a = reloaded.Tiles.Single(t => t.At[0] == 32000);
			Assert.Contains(a.Items, i => i.Id == 106);
			Assert.Contains(a.Items, i => i.Id == 1025);
			Assert.Contains(a.Items, i => i.Id == 1945 && i.Aid == 30017);

			var b = reloaded.Tiles.Single(t => t.At[0] == 32001);
			Assert.Equal(42u, b.House);
		}
		finally
		{
			TryDelete(otbm);
			TryDelete(built);
			TryDeleteDir(srcRoot);
		}
	}

	[Fact]
	public void Source_build_is_deterministic()
	{
		var tiles = new List<OtbmPlacedTile>
		{
			new()
			{
				Position = new MapPos(100, 100, 7),
				Items = { new OtbmPlacedItem { Id = 106 } }
			}
		};

		var otbm = OtbmMini.WriteTemp(tiles);
		var srcRoot = Path.Combine(Path.GetTempPath(), $"ot74-det-{Guid.NewGuid():N}");
		var built1 = Path.Combine(Path.GetTempPath(), $"ot74-d1-{Guid.NewGuid():N}.otbm");
		var built2 = Path.Combine(Path.GetTempPath(), $"ot74-d2-{Guid.NewGuid():N}.otbm");

		try
		{
			Directory.CreateDirectory(srcRoot);
			File.WriteAllText(Path.Combine(srcRoot, "world.map.yaml"), """
				kind: world
				name: det
				sectors: sectors
				regions: []
				quests: []
				headerFile: meta/header.yaml
				mapDataFile: meta/mapdata.yaml
				townsFile: meta/towns.yaml
				waypointsFile: meta/waypoints.yaml
				""");
			MapDecompiler.DecompileAll(otbm, Path.Combine(srcRoot, "sectors"), Path.Combine(srcRoot, "meta"));
			var workspace = SourceWorkspace.Load(srcRoot);
			SourceCompiler.Build(workspace, built1);
			SourceCompiler.Build(workspace, built2);
			Assert.True(FilesIdentical(built1, built2));
		}
		finally
		{
			TryDelete(otbm);
			TryDelete(built1);
			TryDelete(built2);
			TryDeleteDir(srcRoot);
		}
	}

	static bool FilesIdentical(string a, string b)
	{
		var ba = File.ReadAllBytes(a);
		var bb = File.ReadAllBytes(b);
		return ba.AsSpan().SequenceEqual(bb);
	}

	static void TryDelete(string path)
	{
		try
		{
			if (File.Exists(path))
			{
				File.Delete(path);
			}
		}
		catch
		{
			/* best-effort */
		}
	}

	static void TryDeleteDir(string path)
	{
		try
		{
			if (Directory.Exists(path))
			{
				Directory.Delete(path, recursive: true);
			}
		}
		catch
		{
			/* best-effort */
		}
	}
}
