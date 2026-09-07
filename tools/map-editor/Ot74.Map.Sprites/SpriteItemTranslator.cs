using Ot74.Map.Items;

namespace Ot74.Map.Sprites;

/// <summary>serverId origin → dest via first-sprite SHA256. 7.4 vs 7.4 must be identity.</summary>
public static class SpriteItemTranslator
{
	public static Dictionary<int, int> Build(
		ItemsOtb sourceOtb,
		ItemsOtb destOtb,
		SprReader sourceSpr,
		SprReader destSpr,
		DatReader sourceDat,
		DatReader destDat)
	{
		var destByHash = new Dictionary<string, int>();
		foreach (var (serverId, clientId) in destOtb.ServerToClient)
		{
			if (!destDat.Things.TryGetValue(clientId, out var thing) || thing.SpriteIds.Count == 0)
			{
				continue;
			}

			destByHash.TryAdd(SpriteAtlas.HashPixels(destSpr.Decode(thing.SpriteIds[0])), serverId);
		}

		var table = new Dictionary<int, int>();
		foreach (var (serverId, clientId) in sourceOtb.ServerToClient)
		{
			if (!sourceDat.Things.TryGetValue(clientId, out var thing) || thing.SpriteIds.Count == 0)
			{
				continue;
			}

			var hash = SpriteAtlas.HashPixels(sourceSpr.Decode(thing.SpriteIds[0]));
			if (destByHash.TryGetValue(hash, out var destServer))
			{
				table[serverId] = destServer;
			}
		}

		return table;
	}
}
