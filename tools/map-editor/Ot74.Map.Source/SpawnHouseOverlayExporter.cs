using System.Globalization;
using System.Text.Json;
using System.Xml.Linq;

namespace Ot74.Map.Source;

/// <summary>
/// Exports spawn + house sidecar XML into viewer <c>overlays.json</c> (NPC/monster markers, house entries).
/// Absolute creature positions = spawn center + relative x/y (same as TFS / RME).
/// </summary>
public static class SpawnHouseOverlayExporter
{
	public sealed record CreatureLook(int LookType, int? Head, int? Body, int? Legs, int? Feet);

	public static HashSet<int> WriteOverlaysJson(
		string spawnXmlPath,
		string houseXmlPath,
		string outputJsonPath,
		Func<int, int?> resolveOutfitClientId,
		string npcDirectory,
		string monsterDirectory)
	{
		var npcLooks = LoadLooksFromDirectory(npcDirectory, "npc");
		var monsterLooks = LoadLooksFromDirectory(monsterDirectory, "monster");
		var outfitIds = new HashSet<int>();
		var spawns = File.Exists(spawnXmlPath)
			? ParseSpawns(spawnXmlPath, resolveOutfitClientId, npcLooks, monsterLooks, outfitIds)
			: [];
		var houses = File.Exists(houseXmlPath) ? ParseHouses(houseXmlPath) : [];

		var payload = new
		{
			version = 1,
			spawns,
			houses
		};

		Directory.CreateDirectory(Path.GetDirectoryName(outputJsonPath)!);
		File.WriteAllText(
			outputJsonPath,
			JsonSerializer.Serialize(payload, new JsonSerializerOptions
			{
				WriteIndented = false,
				DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
			}));

		return outfitIds;
	}

	public static List<object> ParseSpawns(string path) => ParseSpawns(path, null, null, null, null);

	static List<object> ParseSpawns(
		string path,
		Func<int, int?>? resolveOutfitClientId,
		IReadOnlyDictionary<string, CreatureLook>? npcLooks,
		IReadOnlyDictionary<string, CreatureLook>? monsterLooks,
		HashSet<int>? outfitIds)
	{
		var doc = XDocument.Load(path);
		var list = new List<object>();
		foreach (var spawn in doc.Root?.Elements("spawn") ?? [])
		{
			var cx = AttrInt(spawn, "centerx");
			var cy = AttrInt(spawn, "centery");
			var cz = AttrInt(spawn, "centerz");
			var radius = AttrInt(spawn, "radius");
			var creatures = new List<object>();

			foreach (var npc in spawn.Elements("npc"))
			{
				creatures.Add(Creature("npc", npc, cx, cy, cz, resolveOutfitClientId, npcLooks, monsterLooks, outfitIds));
			}

			foreach (var monster in spawn.Elements("monster"))
			{
				creatures.Add(Creature("monster", monster, cx, cy, cz, resolveOutfitClientId, npcLooks, monsterLooks, outfitIds));
			}

			list.Add(new
			{
				center = new[] { cx, cy, cz },
				radius,
				creatures
			});
		}

		return list;
	}

	public static List<object> ParseHouses(string path)
	{
		var doc = XDocument.Load(path);
		var list = new List<object>();
		foreach (var house in doc.Root?.Elements("house") ?? [])
		{
			list.Add(new
			{
				houseid = AttrInt(house, "houseid"),
				name = (string?)house.Attribute("name") ?? "",
				entry = new[]
				{
					AttrInt(house, "entryx"),
					AttrInt(house, "entryy"),
					AttrInt(house, "entryz")
				},
				rent = AttrInt(house, "rent"),
				guildhall = string.Equals((string?)house.Attribute("guildhall"), "true", StringComparison.OrdinalIgnoreCase),
				townid = AttrInt(house, "townid"),
				size = AttrInt(house, "size")
			});
		}

		return list;
	}

	static Dictionary<string, CreatureLook> LoadLooksFromDirectory(string directory, string rootElement)
	{
		var map = new Dictionary<string, CreatureLook>(StringComparer.OrdinalIgnoreCase);
		if (!Directory.Exists(directory))
		{
			return map;
		}

		foreach (var path in Directory.EnumerateFiles(directory, "*.xml", SearchOption.AllDirectories))
		{
			try
			{
				var doc = XDocument.Load(path);
				if (doc.Root is null || !string.Equals(doc.Root.Name.LocalName, rootElement, StringComparison.OrdinalIgnoreCase))
				{
					continue;
				}

				var name = (string?)doc.Root.Attribute("name");
				if (string.IsNullOrWhiteSpace(name))
				{
					continue;
				}

				var look = doc.Root.Element("look");
				if (look is null)
				{
					continue;
				}

				var lookType = AttrInt(look, "type");
				if (lookType <= 0)
				{
					continue;
				}

				map[name] = new CreatureLook(
					lookType,
					OptionalAttrInt(look, "head"),
					OptionalAttrInt(look, "body"),
					OptionalAttrInt(look, "legs"),
					OptionalAttrInt(look, "feet"));
			}
			catch (Exception ex) when (ex is InvalidOperationException or System.Xml.XmlException)
			{
				// Skip malformed sidecar definitions; spawn markers still export without sprites.
			}
		}

		return map;
	}

	static object Creature(
		string kind,
		XElement el,
		int cx,
		int cy,
		int cz,
		Func<int, int?>? resolveOutfitClientId,
		IReadOnlyDictionary<string, CreatureLook>? npcLooks,
		IReadOnlyDictionary<string, CreatureLook>? monsterLooks,
		HashSet<int>? outfitIds)
	{
		var dx = AttrInt(el, "x");
		var dy = AttrInt(el, "y");
		var zAttr = el.Attribute("z");
		var z = zAttr is null ? cz : int.Parse(zAttr.Value, CultureInfo.InvariantCulture);
		var name = (string?)el.Attribute("name") ?? "";
		CreatureLook? look = null;
		if (kind == "npc")
		{
			npcLooks?.TryGetValue(name, out look);
		}
		else if (kind == "monster")
		{
			monsterLooks?.TryGetValue(name, out look);
		}

		int? outfitId = null;
		if (look is not null && resolveOutfitClientId is not null)
		{
			outfitId = resolveOutfitClientId(look.LookType);
			if (outfitId is > 0)
			{
				outfitIds?.Add(outfitId.Value);
			}
		}

		return new
		{
			kind,
			name,
			at = new[] { cx + dx, cy + dy, z },
			spawntime = AttrInt(el, "spawntime"),
			looktype = look?.LookType,
			head = look?.Head,
			body = look?.Body,
			legs = look?.Legs,
			feet = look?.Feet,
			outfitId
		};
	}

	static int? OptionalAttrInt(XElement el, string name)
	{
		var raw = (string?)el.Attribute(name);
		return int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : null;
	}

	static int AttrInt(XElement el, string name)
	{
		var raw = (string?)el.Attribute(name);
		return int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : 0;
	}
}
