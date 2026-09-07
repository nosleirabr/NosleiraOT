using Ot74.Map.Core.Otbm;
using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class OtbmSourceTests
{
	[Fact]
	public void Validator_rejects_unknown_item_ids()
	{
		var items = ItemsXmlIndex.Load(RepoPaths.ItemsXml);
		var region = new RegionDocument
		{
			Name = "bad",
			Origin = [100, 100, 7],
			Size = [2, 2],
			Tiles =
			{
				new TileDocument
				{
					At = [100, 100, 7],
					Items = { new ItemDocument { Id = 999999 } }
				}
			}
		};

		var issues = SourceValidator.Validate([region], items);
		Assert.Contains(issues, issue => issue.Message.Contains("999999"));
	}

	[Fact]
	public void Validator_rejects_duplicate_unique_ids()
	{
		var region = new RegionDocument
		{
			Name = "dup",
			Origin = [100, 100, 7],
			Size = [4, 4],
			Tiles =
			{
				new TileDocument
				{
					At = [100, 100, 7],
					Items = { new ItemDocument { Id = 1740, Uid = 2050 } }
				},
				new TileDocument
				{
					At = [101, 100, 7],
					Items = { new ItemDocument { Id = 1740, Uid = 2050 } }
				}
			}
		};

		var issues = SourceValidator.Validate([region]);
		Assert.Contains(issues, issue => issue.Message.Contains("uniqueId 2050"));
	}

	[Fact]
	public void Export_then_build_then_export_is_idempotent()
	{
		var otbm = RepoPaths.RequireOtbm();
		var origin = FindPopulatedOrigin(otbm, size: 4);
		var first = RegionExtractor.Extract(otbm, "sample", origin, 4, 4);
		Assert.NotEmpty(first.Tiles);

		var yaml = MapYaml.Serialize(first);
		var reloaded = MapYaml.DeserializeRegion(yaml);
		var built = Path.Combine(Path.GetTempPath(), $"ot74-build-{Guid.NewGuid():N}.otbm");
		var builtAgain = Path.Combine(Path.GetTempPath(), $"ot74-build2-{Guid.NewGuid():N}.otbm");

		try
		{
			OverlayCompiler.Build(otbm, [reloaded], built);
			OverlayCompiler.Build(otbm, [reloaded], builtAgain);

			Assert.True(FilesAreIdentical(built, builtAgain), "Two builds from the same YAML produced different OTBM bytes.");

			var second = RegionExtractor.Extract(built, "sample", origin, 4, 4);
			Assert.Equal(MapYaml.Serialize(Normalize(first)), MapYaml.Serialize(Normalize(second)));
		}
		finally
		{
			File.Delete(built);
			File.Delete(builtAgain);
		}
	}

	static RegionDocument Normalize(RegionDocument region)
	{
		region.Tiles = region.Tiles
			.OrderBy(tile => tile.Position.Z)
			.ThenBy(tile => tile.Position.Y)
			.ThenBy(tile => tile.Position.X)
			.ToList();
		return region;
	}

	static MapPos FindPopulatedOrigin(string otbmPath, int size)
	{
		using var reader = OtbmReader.Open(otbmPath);
		TileAreaBase? area = null;
		while (reader.Read())
		{
			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.TileArea)
			{
				area = TileAreaBase.Parse(reader.ReadProps());
				continue;
			}

			if (area is not { } current || reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = OtbmTileCodec.ReadTile(reader.NodeType, reader.RawProps, current);
			return new MapPos(tile.Position.X, tile.Position.Y, tile.Position.Z);
		}

		throw new InvalidDataException("Could not find a populated tile to sample.");
	}

	static bool FilesAreIdentical(string left, string right)
	{
		if (new FileInfo(left).Length != new FileInfo(right).Length)
		{
			return false;
		}

		using var a = File.OpenRead(left);
		using var b = File.OpenRead(right);
		var bufferA = new byte[8192];
		var bufferB = new byte[8192];
		while (true)
		{
			var readA = a.Read(bufferA);
			var readB = b.Read(bufferB);
			if (readA != readB)
			{
				return false;
			}

			if (readA == 0)
			{
				return true;
			}

			if (!bufferA.AsSpan(0, readA).SequenceEqual(bufferB.AsSpan(0, readB)))
			{
				return false;
			}
		}
	}
}
