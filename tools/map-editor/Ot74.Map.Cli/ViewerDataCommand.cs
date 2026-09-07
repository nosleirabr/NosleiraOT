using System.Text.Json;
using Ot74.Map.Core.Otbm;
using Ot74.Map.Items;
using Ot74.Map.Source;
using Ot74.Map.Sprites;

namespace Ot74.Map.Cli;

/// <summary>
/// Builds atlas + tile JSON for the web viewer. <c>--all</c> streams every TILE_AREA in the
/// baseline into <c>sectors/</c> so the browser can pan the whole map without one giant JSON.
/// </summary>
public static class ViewerDataCommand
{
	static readonly JsonSerializerOptions JsonOpts = new()
	{
		WriteIndented = false,
		DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
	};

	public static int Run(IReadOnlyDictionary<string, string> options, string repo)
	{
		var dat = Resolve(repo, Option(options, "dat", "client/data/things/740/Tibia.dat"));
		var spr = Resolve(repo, Option(options, "spr", "client/data/things/740/Tibia.spr"));
		var otb = Resolve(repo, Option(options, "otb", "server/server/data/items/items.otb"));
		var output = Resolve(repo, Option(options, "out", "maps/build/viewer"));
		var otbm = Resolve(repo, Option(options, "otbm", "maps/world.otbm"));
		var all = options.ContainsKey("all");

		Directory.CreateDirectory(output);
		Console.WriteLine("Loading dat/spr/otb...");
		var datFile = DatReader.Load(dat);
		var items = ItemsOtb.Load(otb);
		var sprites = SprReader.Load(spr);

		var clientIds = new HashSet<int>();
		int tileCount;
		object metaExtra;

		if (all)
		{
			Console.WriteLine("Streaming entire OTBM into sectors (all floors). This can take several minutes...");
			metaExtra = ExportAllSectors(otbm, output, items, clientIds, out tileCount);
		}
		else
		{
			// Region export must not leave a prior --all sectors/ index behind: the viewer
			// prefers sectors.json when present, then draws with a tiny region atlas → dark void.
			ClearSectorArtifacts(output);

			var regionText = Option(options, "region", "32369,32215,7");
			var sizeText = Option(options, "size", "64,64");
			var parts = regionText.Split(',', StringSplitOptions.TrimEntries);
			var size = sizeText.Split(',', StringSplitOptions.TrimEntries);
			var origin = new MapPos(int.Parse(parts[0]), int.Parse(parts[1]), int.Parse(parts[2]));
			var document = RegionExtractor.Extract(otbm, "view", origin, int.Parse(size[0]), int.Parse(size[1]));
			var tiles = document.Tiles.Select(tile => new
			{
				at = tile.At,
				flags = tile.Flags,
				house = tile.House,
				items = tile.Items.Select(item => Describe(item, items, clientIds)).ToList()
			}).ToList();
			tileCount = tiles.Count;
			File.WriteAllText(
				Path.Combine(output, "tiles.json"),
				JsonSerializer.Serialize(new { origin = document.Origin, size = document.Size, tiles }, JsonOpts));
			metaExtra = new
			{
				mode = "region",
				origin = document.Origin,
				size = document.Size
			};
		}

		Console.WriteLine("Exporting spawn/house overlays...");
		var spawnXml = Resolve(repo, Option(options, "spawn", "maps/world-spawn.xml"));
		var houseXml = Resolve(repo, Option(options, "house", "maps/world-house.xml"));
		var npcDir = Resolve(repo, Option(options, "npc", "server/server/data/npc"));
		var monsterDir = Resolve(repo, Option(options, "monster", "server/server/data/monster"));
		var overlaysPath = Path.Combine(output, "overlays.json");
		var outfitIds = SpawnHouseOverlayExporter.WriteOverlaysJson(
			spawnXml,
			houseXml,
			overlaysPath,
			datFile.ResolveOutfitClientId,
			npcDir,
			monsterDir);
		foreach (var outfitId in outfitIds)
		{
			clientIds.Add(outfitId);
		}

		Console.WriteLine($"  Wrote {overlaysPath} ({outfitIds.Count} outfit sprites)");

		var itemsXml = Resolve(repo, Option(options, "items-xml", "server/server/data/items/items.xml"));
		Console.WriteLine("Exporting items catalog + editor palette...");
		var catalog = ItemsXmlCatalog.Load(itemsXml);
		catalog.WriteJson(Path.Combine(output, "items.json"), items.ServerToClient);
		SpriteAtlas.BuildPaletteAtlas(datFile, sprites, items.ServerToClient.Values, output);

		Console.WriteLine($"Building sprite atlas for {clientIds.Count} things...");
		SpriteAtlas.BuildClientAtlas(datFile, sprites, clientIds, output);
		CopyViewerShell(repo, output);

		var start = new[] { 32369, 32215, 7 };
		File.WriteAllText(Path.Combine(output, "meta.json"), JsonSerializer.Serialize(new Dictionary<string, object?>
		{
			["datSignature"] = datFile.Signature.ToString("X8"),
			["sprSignature"] = sprites.Signature.ToString("X8"),
			["itemCount"] = items.ServerToClient.Count,
			["tileCount"] = tileCount,
			["clientThings"] = clientIds.Count,
			["start"] = start,
			["overlays"] = "overlays.json",
			["extra"] = metaExtra
		}, JsonOpts));

		Console.WriteLine($"Wrote viewer data to {output} ({tileCount} tiles, {clientIds.Count} things)");
		return 0;
	}

	static void ClearSectorArtifacts(string output)
	{
		var sectorsDir = Path.Combine(output, "sectors");
		if (Directory.Exists(sectorsDir))
		{
			Directory.Delete(sectorsDir, recursive: true);
		}

		var sectorsIndex = Path.Combine(output, "sectors.json");
		if (File.Exists(sectorsIndex))
		{
			File.Delete(sectorsIndex);
		}
	}

	static object ExportAllSectors(
		string otbmPath,
		string output,
		ItemsOtb items,
		HashSet<int> clientIds,
		out int tileCount)
	{
		ClearSectorArtifacts(output);
		var sectorsDir = Path.Combine(output, "sectors");
		Directory.CreateDirectory(sectorsDir);

		// OTBM may emit many TILE_AREA nodes that share the same 256×256 base — merge them.
		var sectors = new Dictionary<string, SectorBucket>();
		var floors = new HashSet<int>();
		var minX = int.MaxValue;
		var minY = int.MaxValue;
		var maxX = int.MinValue;
		var maxY = int.MinValue;
		var minZ = int.MaxValue;
		var maxZ = int.MinValue;
		tileCount = 0;
		var areas = 0;

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
				areas++;
				if (areas % 5000 == 0)
				{
					Console.WriteLine($"  … {areas} tile-areas, {tileCount} tiles, {sectors.Count} sectors");
				}

				continue;
			}

			if (area is not { } current)
			{
				continue;
			}

			if (reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = RegionExtractor.ReadTileTree(reader, current);
			var pos = tile.Position;
			minX = Math.Min(minX, pos.X);
			minY = Math.Min(minY, pos.Y);
			maxX = Math.Max(maxX, pos.X);
			maxY = Math.Max(maxY, pos.Y);
			minZ = Math.Min(minZ, pos.Z);
			maxZ = Math.Max(maxZ, pos.Z);

			var key = $"{current.Z}_{current.X}_{current.Y}";
			if (!sectors.TryGetValue(key, out var bucket))
			{
				bucket = new SectorBucket(current.X, current.Y, current.Z);
				sectors[key] = bucket;
				floors.Add(current.Z);
			}

			bucket.Tiles.Add(DescribeTile(tile, items, clientIds));
			tileCount++;
		}

		Console.WriteLine($"  Writing {sectors.Count} sector files...");
		var sectorKeys = new List<string>(sectors.Count);
		foreach (var (key, bucket) in sectors.OrderBy(pair => pair.Key, StringComparer.Ordinal))
		{
			sectorKeys.Add(key);
			File.WriteAllText(
				Path.Combine(sectorsDir, key + ".json"),
				JsonSerializer.Serialize(new
				{
					baseX = bucket.BaseX,
					baseY = bucket.BaseY,
					z = bucket.Z,
					tiles = bucket.Tiles
				}, JsonOpts));
		}

		var legacy = Path.Combine(output, "tiles.json");
		if (File.Exists(legacy))
		{
			File.Delete(legacy);
		}

		File.WriteAllText(
			Path.Combine(output, "sectors.json"),
			JsonSerializer.Serialize(new
			{
				sectorSize = TileAreaBase.BlockSize,
				floors = floors.OrderBy(z => z).ToArray(),
				bounds = new { minX, minY, maxX, maxY, minZ, maxZ },
				sectors = sectorKeys
			}, JsonOpts));

		Console.WriteLine($"  Done: {areas} areas merged into {sectors.Count} sectors, {tileCount} tiles, floors {minZ}-{maxZ}");
		return new
		{
			mode = "sectors",
			sectorSize = TileAreaBase.BlockSize,
			bounds = new { minX, minY, maxX, maxY, minZ, maxZ },
			floors = floors.OrderBy(z => z).ToArray(),
			sectorCount = sectors.Count
		};
	}

	sealed class SectorBucket(int baseX, int baseY, int z)
	{
		public int BaseX { get; } = baseX;
		public int BaseY { get; } = baseY;
		public int Z { get; } = z;
		public List<object> Tiles { get; } = [];
	}

	static object DescribeTile(OtbmPlacedTile tile, ItemsOtb items, HashSet<int> clientIds) => new
	{
		at = new[] { tile.Position.X, tile.Position.Y, tile.Position.Z },
		flags = FormatTileFlags(tile.Flags),
		house = tile.HouseId,
		items = DescribeStack(tile.Items, items, clientIds)
	};

	static string? FormatTileFlags(OtbmTileFlag flags)
	{
		if (flags == OtbmTileFlag.None)
		{
			return null;
		}

		var parts = new List<string>();
		if (flags.HasFlag(OtbmTileFlag.ProtectionZone))
		{
			parts.Add("protection-zone");
		}

		if (flags.HasFlag(OtbmTileFlag.NoPvpZone))
		{
			parts.Add("no-pvp");
		}

		if (flags.HasFlag(OtbmTileFlag.NoLogout))
		{
			parts.Add("no-logout");
		}

		if (flags.HasFlag(OtbmTileFlag.PvpZone))
		{
			parts.Add("pvp");
		}

		return parts.Count == 0 ? null : string.Join(",", parts);
	}

	static List<object> DescribeStack(IEnumerable<OtbmPlacedItem> stack, ItemsOtb items, HashSet<int> clientIds) =>
		stack.Select(item => DescribePlaced(item, items, clientIds)).ToList<object>();

	static object DescribePlaced(OtbmPlacedItem item, ItemsOtb items, HashSet<int> clientIds)
	{
		var clientId = items.TryGetClientId(item.Id, out var client) ? client : 0;
		if (clientId > 0)
		{
			clientIds.Add(clientId);
		}

		return new
		{
			id = item.Id,
			clientId = clientId > 0 ? clientId : (int?)null,
			count = item.Count,
			charges = item.Charges,
			aid = item.ActionId,
			uid = item.UniqueId,
			depot = item.DepotId,
			door = item.HouseDoorId,
			text = item.Text,
			dest = item.Teleport is { } dest ? new[] { dest.X, dest.Y, dest.Z } : null,
			contents = item.Contents.Count == 0 ? null : DescribeStack(item.Contents, items, clientIds)
		};
	}

	static object Describe(ItemDocument item, ItemsOtb items, HashSet<int> clientIds)
	{
		var clientId = items.TryGetClientId(item.Id, out var client) ? client : 0;
		if (clientId > 0)
		{
			clientIds.Add(clientId);
		}

		return new
		{
			id = item.Id,
			clientId = clientId > 0 ? clientId : (int?)null,
			count = item.Count,
			charges = item.Charges,
			aid = item.Aid,
			uid = item.Uid,
			depot = item.Depot,
			door = item.Door,
			text = item.Text,
			dest = item.Dest,
			contents = item.Contents.Count == 0
				? null
				: item.Contents.Select(child => Describe(child, items, clientIds)).ToList()
		};
	}

	static void CopyViewerShell(string repo, string output)
	{
		foreach (var name in new[] { "index.html", "viewer.css", "viewer.js", "editor.js" })
		{
			var source = Path.Combine(repo, "tools", "map-editor", "viewer", name);
			if (File.Exists(source))
			{
				File.Copy(source, Path.Combine(output, name), overwrite: true);
			}
		}
	}

	static string Option(IReadOnlyDictionary<string, string> options, string name, string fallback) =>
		options.TryGetValue(name, out var value) ? value : fallback;

	static string Resolve(string repo, string path) =>
		Path.IsPathRooted(path) ? path : Path.GetFullPath(Path.Combine(repo, path.Replace('/', Path.DirectorySeparatorChar)));
}
