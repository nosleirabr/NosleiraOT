using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Grava edições do viewer nos ficheiros já usados para render e bake:
/// JSON dos chunks e YAML dos setores. Spawn = patch em world-spawn.xml.
/// Não escreve OTBM — o bake continua a ser <c>otmap build --from-source</c>.
/// </summary>
public static class ViewerEditStore
{
	public const string DefaultViewerRel = "maps/build/viewer";
	public const string DefaultSectorsRel = "maps/src/sectors";
	public const string DefaultSpawnRel = "maps/world-spawn.xml";

	static readonly JsonSerializerOptions JsonOptions = new()
	{
		PropertyNameCaseInsensitive = true,
		PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
		DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
	};

	public static ViewerSavePayload ParsePayload(string json) =>
		JsonSerializer.Deserialize<ViewerSavePayload>(json, JsonOptions) ?? new ViewerSavePayload();

	public static ViewerSaveResult Save(string json, string? viewerDir, string? sectorsDir, string? spawnXmlPath)
	{
		var payload = ParsePayload(json);
		return Save(payload, viewerDir, sectorsDir, spawnXmlPath);
	}

	public static ViewerSaveResult Save(
		ViewerSavePayload payload,
		string? viewerDir,
		string? sectorsDir,
		string? spawnXmlPath)
	{
		var tiles = payload.Tiles ?? [];
		var jsonWritten = string.IsNullOrWhiteSpace(viewerDir) ? 0 : MergeViewerJson(tiles, viewerDir);
		if (!string.IsNullOrWhiteSpace(viewerDir) && payload.Spawns is { Count: > 0 })
		{
			MergeViewerOverlays(payload.Spawns, Path.Combine(viewerDir, "overlays.json"));
		}

		var yamlWritten = string.IsNullOrWhiteSpace(sectorsDir) ? 0 : MergeSectorYaml(tiles, sectorsDir);
		var spawnsWritten = 0;
		if (payload.Spawns is { Count: > 0 } && !string.IsNullOrWhiteSpace(spawnXmlPath))
		{
			spawnsWritten = MergeSpawnXml(payload.Spawns, spawnXmlPath);
		}

		return new ViewerSaveResult(Math.Max(jsonWritten, yamlWritten), spawnsWritten, viewerDir, sectorsDir, spawnXmlPath);
	}

	/// <summary>Aplica <c>tiles.json</c> (modo janela) por cima do dicionário de bake.</summary>
	public static void MergePreviewJsonIntoTiles(Dictionary<MapPos, OtbmPlacedTile> dest, string viewerDir)
	{
		foreach (var (pos, tile) in LoadPreviewTiles(viewerDir))
		{
			dest[pos] = tile;
		}
	}

	public static void MergePreviewJsonIntoOverlays(Dictionary<string, OtbmPlacedTile> overlays, string viewerDir)
	{
		foreach (var (pos, tile) in LoadPreviewTiles(viewerDir))
		{
			overlays[pos.ToString()] = tile;
		}
	}

	public static int MergeViewerJson(IReadOnlyList<ViewerSaveTile> tiles, string viewerDir)
	{
		if (tiles.Count == 0)
		{
			return 0;
		}

		Directory.CreateDirectory(viewerDir);
		var sectorsDir = Path.Combine(viewerDir, "sectors");
		var sectorsIndex = Path.Combine(viewerDir, "sectors.json");
		if (Directory.Exists(sectorsDir) && File.Exists(sectorsIndex))
		{
			return PatchViewerSectors(tiles, sectorsDir, sectorsIndex);
		}

		return PatchTilesJson(tiles, Path.Combine(viewerDir, "tiles.json"));
	}

	public static int MergeSectorYaml(IReadOnlyList<ViewerSaveTile> tiles, string sectorsDir)
	{
		if (tiles.Count == 0 || !Directory.Exists(sectorsDir) || !Directory.EnumerateDirectories(sectorsDir).Any())
		{
			return 0;
		}

		var written = 0;
		foreach (var incoming in tiles)
		{
			if (incoming.At is not { Length: >= 2 })
			{
				continue;
			}

			UpsertSectorYamlTile(sectorsDir, incoming);
			written++;
		}

		return written;
	}

	public static int MergeSpawnXml(IReadOnlyList<ViewerSaveSpawn> spawns, string spawnXmlPath)
	{
		// Patch só os nós mexidos — world-spawn.xml tem dezenas de milhares de linhas.
		var xml = File.Exists(spawnXmlPath)
			? File.ReadAllText(spawnXmlPath)
			: "<?xml version=\"1.0\"?>\n<spawns>\n</spawns>\n";

		var written = 0;
		foreach (var spawn in spawns)
		{
			if (spawn.Center is not { Length: >= 3 })
			{
				continue;
			}

			var range = FindSpawnRange(xml, spawn.Center[0], spawn.Center[1], spawn.Center[2]);
			if (spawn.Remove)
			{
				if (range is { } del)
				{
					xml = xml.Remove(del.Start, del.Length);
				}

				written++;
				continue;
			}

			var nl = xml.Contains("\r\n", StringComparison.Ordinal) ? "\r\n" : "\n";
			var nodeXml = FormatSpawnXml(spawn, nl);
			if (range is { } hit)
			{
				xml = xml.Remove(hit.Start, hit.Length).Insert(hit.Start, "\t" + nodeXml + nl);
			}
			else
			{
				var insertAt = xml.LastIndexOf("</spawns>", StringComparison.OrdinalIgnoreCase);
				if (insertAt < 0)
				{
					throw new InvalidDataException($"Spawn XML missing </spawns>: {spawnXmlPath}");
				}

				var prefix = insertAt > 0 && xml[insertAt - 1] is not '\n' ? nl : "";
				xml = xml.Insert(insertAt, $"{prefix}\t{nodeXml}{nl}");
			}

			written++;
		}

		Directory.CreateDirectory(Path.GetDirectoryName(spawnXmlPath) ?? ".");
		File.WriteAllText(spawnXmlPath, xml);
		return written;
	}

	static Dictionary<MapPos, OtbmPlacedTile> LoadPreviewTiles(string viewerDir)
	{
		var result = new Dictionary<MapPos, OtbmPlacedTile>();
		var path = Path.Combine(viewerDir, "tiles.json");
		if (!File.Exists(path))
		{
			return result;
		}

		var root = JsonNode.Parse(File.ReadAllText(path)) as JsonObject;
		var arr = root?["tiles"] as JsonArray;
		if (arr is null)
		{
			return result;
		}

		foreach (var node in arr)
		{
			var saveTile = node.Deserialize<ViewerSaveTile>(JsonOptions);
			if (saveTile?.At is not { Length: >= 2 } || saveTile.Remove)
			{
				continue;
			}

			var doc = ToTileDocument(saveTile);
			result[doc.Position] = RegionMapper.ToTile(doc);
		}

		return result;
	}

	static int PatchTilesJson(IReadOnlyList<ViewerSaveTile> tiles, string tilesJsonPath)
	{
		JsonObject root;
		if (File.Exists(tilesJsonPath))
		{
			root = JsonNode.Parse(File.ReadAllText(tilesJsonPath)) as JsonObject ?? new JsonObject();
		}
		else
		{
			root = new JsonObject();
		}

		root["tiles"] ??= new JsonArray();
		var arr = root["tiles"]!.AsArray();
		var written = 0;
		foreach (var incoming in tiles)
		{
			if (incoming.At is not { Length: >= 2 })
			{
				continue;
			}

			UpsertJsonTile(arr, incoming);
			written++;
		}

		File.WriteAllText(tilesJsonPath, root.ToJsonString(JsonOptions));
		return written;
	}

	static int PatchViewerSectors(IReadOnlyList<ViewerSaveTile> tiles, string sectorsDir, string sectorsIndexPath)
	{
		var index = JsonNode.Parse(File.ReadAllText(sectorsIndexPath)) as JsonObject ?? new JsonObject();
		var keys = index["sectors"] as JsonArray ?? new JsonArray();
		index["sectors"] = keys;
		var written = 0;
		foreach (var group in tiles.Where(t => t.At is { Length: >= 2 }).GroupBy(SectorKeyOf))
		{
			var key = group.Key;
			var path = Path.Combine(sectorsDir, key + ".json");
			JsonObject root;
			if (File.Exists(path))
			{
				root = JsonNode.Parse(File.ReadAllText(path)) as JsonObject ?? NewSectorRoot(key);
			}
			else
			{
				root = NewSectorRoot(key);
				if (!keys.Any(n => string.Equals(n?.GetValue<string>(), key, StringComparison.Ordinal)))
				{
					keys.Add(key);
				}
			}

			root["tiles"] ??= new JsonArray();
			var arr = root["tiles"]!.AsArray();
			foreach (var incoming in group)
			{
				UpsertJsonTile(arr, incoming);
				written++;
			}

			File.WriteAllText(path, root.ToJsonString(JsonOptions));
		}

		File.WriteAllText(sectorsIndexPath, index.ToJsonString(JsonOptions));
		return written;
	}

	static JsonObject NewSectorRoot(string key)
	{
		var parts = key.Split('_');
		return new JsonObject
		{
			["z"] = int.Parse(parts[0]),
			["baseX"] = int.Parse(parts[1]),
			["baseY"] = int.Parse(parts[2]),
			["tiles"] = new JsonArray()
		};
	}

	static void UpsertJsonTile(JsonArray arr, ViewerSaveTile incoming)
	{
		var pos = PosKey(incoming.At);
		for (var i = arr.Count - 1; i >= 0; i--)
		{
			if (TileNodeKey(arr[i]) == pos)
			{
				arr.RemoveAt(i);
			}
		}

		if (incoming.Remove || (incoming.Items is { Count: 0 } && incoming.Flags is null && incoming.House is null))
		{
			return;
		}

		arr.Add(JsonSerializer.SerializeToNode(ToViewerJsonTile(incoming), JsonOptions));
	}

	static object ToViewerJsonTile(ViewerSaveTile tile) => new
	{
		at = tile.At.Length >= 3 ? tile.At : new[] { tile.At[0], tile.At[1], 7 },
		flags = string.IsNullOrWhiteSpace(tile.Flags) ? null : tile.Flags,
		house = tile.House,
		items = tile.Items
	};

	static string TileNodeKey(JsonNode? node)
	{
		var at = node?["at"] as JsonArray;
		if (at is null || at.Count < 2)
		{
			return "";
		}

		var z = at.Count > 2 ? at[2]!.GetValue<int>() : 7;
		return $"{at[0]!.GetValue<int>()},{at[1]!.GetValue<int>()},{z}";
	}

	static string SectorKeyOf(ViewerSaveTile tile)
	{
		var area = TileAreaBase.For(new MapPos(tile.At[0], tile.At[1], tile.At.Length > 2 ? tile.At[2] : 7));
		return $"{area.Z}_{area.X}_{area.Y}";
	}

	static void MergeViewerOverlays(IReadOnlyList<ViewerSaveSpawn> spawns, string overlaysPath)
	{
		if (!File.Exists(overlaysPath))
		{
			return;
		}

		var root = JsonNode.Parse(File.ReadAllText(overlaysPath)) as JsonObject;
		if (root is null)
		{
			return;
		}

		root["spawns"] ??= new JsonArray();
		var arr = root["spawns"]!.AsArray();
		foreach (var spawn in spawns)
		{
			if (spawn.Center is not { Length: >= 3 })
			{
				continue;
			}

			for (var i = arr.Count - 1; i >= 0; i--)
			{
				var center = arr[i]?["center"] as JsonArray;
				if (center is { Count: >= 3 }
					&& center[0]!.GetValue<int>() == spawn.Center[0]
					&& center[1]!.GetValue<int>() == spawn.Center[1]
					&& center[2]!.GetValue<int>() == spawn.Center[2])
				{
					arr.RemoveAt(i);
				}
			}

			if (spawn.Remove)
			{
				continue;
			}

			arr.Add(JsonSerializer.SerializeToNode(new
			{
				center = spawn.Center,
				radius = spawn.Radius > 0 ? spawn.Radius : 1,
				creatures = spawn.Creatures
			}, JsonOptions));
		}

		File.WriteAllText(overlaysPath, root.ToJsonString(JsonOptions));
	}

	static void UpsertSectorYamlTile(string sectorsDir, ViewerSaveTile incoming)
	{
		var area = TileAreaBase.For(new MapPos(incoming.At[0], incoming.At[1], incoming.At.Length > 2 ? incoming.At[2] : 7));
		var key = $"{area.Z}_{area.X}_{area.Y}";
		var dir = Path.Combine(sectorsDir, key);
		Directory.CreateDirectory(dir);
		var pos = PosKey(incoming.At);
		var layers = new Dictionary<MapLayer, Dictionary<string, TileDocument>>();
		foreach (var layer in ItemLayerClassifier.LoadOrder)
		{
			layers[layer] = LoadLayerTiles(dir, layer);
			layers[layer].Remove(pos);
		}

		if (!incoming.Remove)
		{
			SplitIntoLayers(ToTileDocument(incoming), layers);
		}

		foreach (var layer in ItemLayerClassifier.LoadOrder)
		{
			WriteLayerFile(dir, key, layer, area, layers[layer]);
		}

		TouchSectorIndex(sectorsDir, key);
	}

	static Dictionary<string, TileDocument> LoadLayerTiles(string dir, MapLayer layer)
	{
		var path = Path.Combine(dir, ItemLayerClassifier.FileName(layer));
		if (!File.Exists(path))
		{
			return new Dictionary<string, TileDocument>(StringComparer.Ordinal);
		}

		var doc = MapYaml.DeserializeRegion(File.ReadAllText(path));
		var map = new Dictionary<string, TileDocument>(StringComparer.Ordinal);
		foreach (var tile in doc.Tiles)
		{
			map[PosKey(tile.At)] = tile;
		}

		return map;
	}

	static void SplitIntoLayers(TileDocument tile, Dictionary<MapLayer, Dictionary<string, TileDocument>> layers)
	{
		var pos = PosKey(tile.At);
		for (var i = 0; i < tile.Items.Count; i++)
		{
			var item = tile.Items[i];
			var layer = ItemLayerClassifier.Classify(item, isFirstOnTile: i == 0);
			if (!layers[layer].TryGetValue(pos, out var layerTile))
			{
				layerTile = new TileDocument
				{
					At = tile.At,
					Flags = layer == MapLayer.Ground ? tile.Flags : null,
					House = layer == MapLayer.Ground ? tile.House : null
				};
				layers[layer][pos] = layerTile;
			}

			layerTile.Items.Add(item);
		}

		if (tile.Items.Count == 0)
		{
			layers[MapLayer.Ground][pos] = new TileDocument
			{
				At = tile.At,
				Flags = tile.Flags,
				House = tile.House
			};
		}
	}

	static void WriteLayerFile(
		string dir,
		string key,
		MapLayer layer,
		TileAreaBase area,
		Dictionary<string, TileDocument> tiles)
	{
		var path = Path.Combine(dir, ItemLayerClassifier.FileName(layer));
		if (tiles.Count == 0)
		{
			if (File.Exists(path))
			{
				File.Delete(path);
			}

			return;
		}

		var doc = new RegionDocument
		{
			Kind = "sector-layer",
			Name = $"{key}/{layer.ToString().ToLowerInvariant()}",
			Origin = [area.X, area.Y, area.Z],
			Size = [TileAreaBase.BlockSize, TileAreaBase.BlockSize],
			Tiles = tiles.Values.OrderBy(t => t.At[1]).ThenBy(t => t.At[0]).ToList()
		};
		File.WriteAllText(path, MapYaml.Serialize(doc));
	}

	static void TouchSectorIndex(string sectorsDir, string key)
	{
		var indexPath = Path.Combine(sectorsDir, "index.yaml");
		if (!File.Exists(indexPath))
		{
			return;
		}

		var index = MapYaml.DeserializeSectorIndex(File.ReadAllText(indexPath));
		if (index.Sectors.Contains(key, StringComparer.Ordinal))
		{
			return;
		}

		index.Sectors.Add(key);
		File.WriteAllText(indexPath, MapYaml.SerializeSectorIndex(index));
	}

	static TileDocument ToTileDocument(ViewerSaveTile tile)
	{
		return new TileDocument
		{
			At = tile.At.Length >= 3 ? tile.At : [tile.At[0], tile.At[1], 7],
			Flags = string.IsNullOrWhiteSpace(tile.Flags) ? null : tile.Flags,
			House = tile.House,
			Items = (tile.Items ?? []).Select(ToItemDocument).ToList()
		};
	}

	static ItemDocument ToItemDocument(ViewerSaveItem item)
	{
		return new ItemDocument
		{
			Id = item.Id,
			Aid = item.Aid,
			Uid = item.Uid,
			Count = item.Count,
			Charges = item.Charges,
			Depot = item.Depot,
			Door = item.Door,
			Text = item.Text,
			Dest = item.Dest,
			Contents = (item.Contents ?? []).Select(ToItemDocument).ToList()
		};
	}

	static string FormatSpawnXml(ViewerSaveSpawn spawn, string nl)
	{
		var cx = spawn.Center[0];
		var cy = spawn.Center[1];
		var cz = spawn.Center[2];
		var radius = spawn.Radius > 0 ? spawn.Radius : 1;
		var lines = new List<string>
		{
			$"<spawn centerx=\"{cx}\" centery=\"{cy}\" centerz=\"{cz}\" radius=\"{radius}\">"
		};
		foreach (var creature in spawn.Creatures ?? [])
		{
			if (creature.At is not { Length: >= 2 })
			{
				continue;
			}

			var z = creature.At.Length > 2 ? creature.At[2] : cz;
			var tag = string.Equals(creature.Kind, "npc", StringComparison.OrdinalIgnoreCase) ? "npc" : "monster";
			lines.Add(
				$"\t\t<{tag} name=\"{XmlAttr(creature.Name)}\" x=\"{creature.At[0] - cx}\" y=\"{creature.At[1] - cy}\" z=\"{z}\" spawntime=\"{creature.Spawntime ?? 60}\" />");
		}

		lines.Add("\t</spawn>");
		return string.Join(nl, lines);
	}

	static (int Start, int Length)? FindSpawnRange(string xml, int cx, int cy, int cz)
	{
		var search = 0;
		while (true)
		{
			var start = IndexOfSpawnOpen(xml, search);
			if (start < 0)
			{
				return null;
			}

			var gt = xml.IndexOf('>', start);
			if (gt < 0)
			{
				return null;
			}

			var open = xml[start..(gt + 1)];
			var selfClose = open.TrimEnd().EndsWith("/>", StringComparison.Ordinal);
			int end;
			if (selfClose)
			{
				end = gt + 1;
			}
			else
			{
				var close = xml.IndexOf("</spawn>", gt, StringComparison.OrdinalIgnoreCase);
				if (close < 0)
				{
					return null;
				}

				end = close + "</spawn>".Length;
			}

			if (OpenMatchesCenter(open, cx, cy, cz))
			{
				return ExpandToFullLines(xml, start, end);
			}

			search = end;
		}
	}

	static int IndexOfSpawnOpen(string xml, int start)
	{
		while (true)
		{
			var i = xml.IndexOf("<spawn", start, StringComparison.OrdinalIgnoreCase);
			if (i < 0)
			{
				return -1;
			}

			var after = i + 6;
			if (after >= xml.Length)
			{
				return -1;
			}

			// Não confundir <spawn com <spawns.
			if (xml[after] is ' ' or '\t' or '\n' or '\r' or '/' or '>')
			{
				return i;
			}

			start = after;
		}
	}

	static bool OpenMatchesCenter(string open, int cx, int cy, int cz) =>
		AttrInt(open, "centerx") == cx
		&& AttrInt(open, "centery") == cy
		&& AttrInt(open, "centerz") == cz;

	static int AttrInt(string open, string name)
	{
		var needle = name + "=";
		var i = open.IndexOf(needle, StringComparison.OrdinalIgnoreCase);
		if (i < 0)
		{
			return 0;
		}

		var q = open.IndexOf('"', i);
		if (q < 0)
		{
			return 0;
		}

		var q2 = open.IndexOf('"', q + 1);
		if (q2 < 0)
		{
			return 0;
		}

		return int.TryParse(open[(q + 1)..q2], out var n) ? n : 0;
	}

	static (int Start, int Length) ExpandToFullLines(string xml, int start, int end)
	{
		while (start > 0 && xml[start - 1] is ' ' or '\t')
		{
			start--;
		}

		if (end < xml.Length && xml[end] == '\r')
		{
			end++;
		}

		if (end < xml.Length && xml[end] == '\n')
		{
			end++;
		}

		return (start, end - start);
	}

	static string XmlAttr(string? value) =>
		(value ?? string.Empty)
			.Replace("&", "&amp;", StringComparison.Ordinal)
			.Replace("\"", "&quot;", StringComparison.Ordinal)
			.Replace("<", "&lt;", StringComparison.Ordinal)
			.Replace(">", "&gt;", StringComparison.Ordinal);

	static string PosKey(int[] at)
	{
		var z = at.Length > 2 ? at[2] : 7;
		return $"{at[0]},{at[1]},{z}";
	}
}

public sealed class ViewerSavePayload
{
	public List<ViewerSaveTile> Tiles { get; set; } = [];
	public List<ViewerSaveSpawn>? Spawns { get; set; }
}

public sealed class ViewerSaveTile
{
	public int[] At { get; set; } = [];
	public string? Flags { get; set; }
	public uint? House { get; set; }
	public List<ViewerSaveItem>? Items { get; set; }
	public bool Remove { get; set; }
}

public sealed class ViewerSaveItem
{
	public int Id { get; set; }
	public int? ClientId { get; set; }
	public int? Aid { get; set; }
	public int? Uid { get; set; }
	public int? Count { get; set; }
	public int? Charges { get; set; }
	public int? Depot { get; set; }
	public int? Door { get; set; }
	public string? Text { get; set; }
	public int[]? Dest { get; set; }
	public List<ViewerSaveItem>? Contents { get; set; }
}

public sealed class ViewerSaveSpawn
{
	public int[] Center { get; set; } = [];
	public int Radius { get; set; } = 1;
	public List<ViewerSaveCreature>? Creatures { get; set; }
	public bool Remove { get; set; }
}

public sealed class ViewerSaveCreature
{
	public string? Kind { get; set; }
	public string? Name { get; set; }
	public int[]? At { get; set; }
	public int? Spawntime { get; set; }
}

public sealed record ViewerSaveResult(int TileCount, int SpawnCount, string? ViewerPath, string? SectorsPath, string? SpawnPath);
