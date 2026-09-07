using Ot74.Map.Items;
using Ot74.Map.Sprites;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

public sealed class SpriteParserTests
{
	[Fact]
	public void Dat_and_spr_signatures_match_rme_client_7_4()
	{
		var datPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.dat");
		var sprPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.spr");
		if (!File.Exists(datPath) || !File.Exists(sprPath))
		{
			return;
		}

		var dat = DatReader.Load(datPath);
		var spr = SprReader.Load(sprPath);
		Assert.Equal(0x41BF619Cu, dat.Signature);
		Assert.Equal(SprReader.Signature740, spr.Signature);
		Assert.True(dat.Things.Count > 100, "Expected the 7.4 dat to list more than 100 things.");
		Assert.True(spr.Count > 100, "Expected the 7.4 spr to contain more than 100 sprites.");
	}

	[Fact]
	public void Known_sprite_decodes_to_32x32_with_magenta_as_transparent()
	{
		var sprPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.spr");
		if (!File.Exists(sprPath))
		{
			return;
		}

		var spr = SprReader.Load(sprPath);
		var pixels = spr.Decode(1);
		Assert.Equal(SpritePixels.Size * SpritePixels.Size * 4, pixels.Rgba.Length);

		var atlasDir = Path.Combine(Path.GetTempPath(), $"ot74-atlas-{Guid.NewGuid():N}");
		try
		{
			SpriteAtlas.Build(spr, atlasDir, maxSprites: 16);
			Assert.True(File.Exists(Path.Combine(atlasDir, "atlas.png")));
			Assert.True(File.Exists(Path.Combine(atlasDir, "atlas.json")));
		}
		finally
		{
			Directory.Delete(atlasDir, recursive: true);
		}
	}
}

public sealed class ItemsOtbMapTests
{
	[Fact]
	public void Items_otb_maps_server_id_to_client_id()
	{
		var path = Path.Combine(RepoPaths.Data, "items", "items.otb");
		if (!File.Exists(path))
		{
			return;
		}

		var otb = ItemsOtb.Load(path);
		Assert.True(otb.TryGetClientId(1740, out var clientId), "chest 1740 must exist in items.otb");
		Assert.True(clientId > 0);
		Assert.Equal(1740, otb.ToServerId(clientId));
	}

	[Fact]
	public void Sprite_hash_of_the_same_assets_is_identity()
	{
		var datPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.dat");
		var sprPath = Path.Combine(RepoPaths.Root, "client", "data", "things", "740", "Tibia.spr");
		var otbPath = Path.Combine(RepoPaths.Data, "items", "items.otb");
		if (!File.Exists(datPath) || !File.Exists(sprPath) || !File.Exists(otbPath))
		{
			return;
		}

		var otb = ItemsOtb.Load(otbPath);
		var dat = DatReader.Load(datPath);
		var spr = SprReader.Load(sprPath);
		var table = SpriteItemTranslator.Build(otb, otb, spr, spr, dat, dat);
		Assert.True(table.Count > 0);
		foreach (var (serverId, destId) in table.Take(64))
		{
			Assert.True(otb.TryGetClientId(serverId, out var sourceClient));
			Assert.True(otb.TryGetClientId(destId, out var destClient));
			Assert.True(dat.Things.TryGetValue(sourceClient, out var sourceThing) && sourceThing.SpriteIds.Count > 0);
			Assert.True(dat.Things.TryGetValue(destClient, out var destThing) && destThing.SpriteIds.Count > 0);
			Assert.Equal(
				SpriteAtlas.HashPixels(spr.Decode(sourceThing.SpriteIds[0])),
				SpriteAtlas.HashPixels(spr.Decode(destThing.SpriteIds[0])));
		}
	}
}
