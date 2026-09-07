using System.Globalization;
using System.Text.RegularExpressions;
using System.Xml;

namespace Ot74.Gameplay.Tests.Catalog;

public static class DatapackCatalog
{
	static readonly Regex HarbourRegex = new(
		@"^\s*(\w+)\s*=\s*Position\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)",
		RegexOptions.Multiline | RegexOptions.Compiled);

	static readonly Regex LuaIntListRegex = new(@"=\s*\{([^}]+)\}", RegexOptions.Compiled);
	static readonly Regex ShopItemRegex = new(@",(\d+),", RegexOptions.Compiled);

	public static HashSet<int> LoadOutfitLookTypes(string outfitsXml, bool enabledOnly)
	{
		var set = new HashSet<int>();
		foreach (var el in EnumerateElements(outfitsXml, "outfit"))
		{
			if (!int.TryParse(el.GetAttribute("looktype"), NumberStyles.Integer, CultureInfo.InvariantCulture, out var look))
			{
				continue;
			}

			var enabled = !string.Equals(el.GetAttribute("enabled"), "no", StringComparison.OrdinalIgnoreCase);
			if (!enabledOnly || enabled)
			{
				set.Add(look);
			}
		}

		return set;
	}

	public static HashSet<int> LoadDisabledOutfitLookTypes(string outfitsXml)
	{
		var set = new HashSet<int>();
		foreach (var el in EnumerateElements(outfitsXml, "outfit"))
		{
			if (!int.TryParse(el.GetAttribute("looktype"), NumberStyles.Integer, CultureInfo.InvariantCulture, out var look))
			{
				continue;
			}

			if (string.Equals(el.GetAttribute("enabled"), "no", StringComparison.OrdinalIgnoreCase))
			{
				set.Add(look);
			}
		}

		return set;
	}

	public static IReadOnlyList<TravelHarbour> LoadHarbours(string travelLua)
	{
		var text = File.ReadAllText(travelLua);
		var list = new List<TravelHarbour>();
		foreach (Match match in HarbourRegex.Matches(text))
		{
			list.Add(new TravelHarbour(
				match.Groups[1].Value,
				new MapPosition(
					int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture),
					int.Parse(match.Groups[3].Value, CultureInfo.InvariantCulture),
					int.Parse(match.Groups[4].Value, CultureInfo.InvariantCulture))));
		}

		return list;
	}

	static readonly Regex AddTravelKeywordRegex = new(
		@"addTravelKeyword\s*\(\s*[^,]+,\s*[^,]+,\s*'((?:\\.|[^'\\])*)'\s*,\s*(\d+)\s*,\s*TravelHarbours\.(\w+)",
		RegexOptions.Compiled);

	static readonly Regex StdModuleTravelRegex = new(@"StdModule\.travel\s*,\s*\{", RegexOptions.Compiled);
	static readonly Regex HarbourRefRegex = new(@"TravelHarbours\.(\w+)", RegexOptions.Compiled);
	static readonly Regex PremiumFlagRegex = new(@"premium\s*=\s*(true|false)", RegexOptions.Compiled);
	static readonly Regex CostFlagRegex = new(@"cost\s*=\s*(\d+)", RegexOptions.Compiled);

	public static IReadOnlyList<TravelRoute> LoadTravelRoutes(string npcScriptsDir, IReadOnlyList<TravelHarbour> harbours)
	{
		var byName = harbours.ToDictionary(h => h.Name, StringComparer.Ordinal);
		var routes = new List<TravelRoute>();
		if (!Directory.Exists(npcScriptsDir))
		{
			return routes;
		}

		foreach (var file in Directory.GetFiles(npcScriptsDir, "*.lua", SearchOption.TopDirectoryOnly))
		{
			var text = File.ReadAllText(file);
			var npcFile = Path.GetFileName(file);

			foreach (Match match in AddTravelKeywordRegex.Matches(text))
			{
				var keyword = match.Groups[1].Value.Replace("\\'", "'", StringComparison.Ordinal);
				var cost = int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);
				var harbour = match.Groups[3].Value;
				var dest = byName.TryGetValue(harbour, out var found) ? found.Position : default;
				routes.Add(new TravelRoute(npcFile, keyword, harbour, dest, Premium: true, cost));
			}

			foreach (Match match in StdModuleTravelRegex.Matches(text))
			{
				var sliceLen = Math.Min(1500, text.Length - match.Index);
				var slice = text.Substring(match.Index, sliceLen);
				var premium = true;
				var premiumMatch = PremiumFlagRegex.Match(slice);
				if (premiumMatch.Success)
				{
					premium = premiumMatch.Groups[1].Value == "true";
				}

				var cost = 0;
				var costMatch = CostFlagRegex.Match(slice);
				if (costMatch.Success)
				{
					cost = int.Parse(costMatch.Groups[1].Value, CultureInfo.InvariantCulture);
				}

				foreach (Match harbourMatch in HarbourRefRegex.Matches(slice))
				{
					var harbour = harbourMatch.Groups[1].Value;
					var dest = byName.TryGetValue(harbour, out var found) ? found.Position : default;
					routes.Add(new TravelRoute(npcFile, "(StdModule.travel)", harbour, dest, premium, cost));
				}
			}
		}

		return routes;
	}

	public static HashSet<int> LoadLuaIntSet(string luaPath, string identifier)
	{
		if (!File.Exists(luaPath))
		{
			return [];
		}

		return ParseIntSet(File.ReadAllText(luaPath), identifier);
	}

	public static (HashSet<int> LevelDoors, HashSet<int> QuestDoors) LoadDoorIds(string globalLua)
	{
		var text = File.ReadAllText(globalLua);
		return (ParseIntSet(text, "levelDoors"), ParseIntSet(text, "questDoors"));
	}

	public static HashSet<int> LoadActionItemIds(string actionsXml, string scriptEndsWith)
	{
		var set = new HashSet<int>();
		if (!File.Exists(actionsXml))
		{
			return set;
		}

		var doc = LoadXml(actionsXml);
		foreach (XmlElement el in doc.GetElementsByTagName("action"))
		{
			var script = el.GetAttribute("script");
			if (string.IsNullOrWhiteSpace(script)
				|| !script.Replace('\\', '/').EndsWith(scriptEndsWith.Replace('\\', '/'), StringComparison.OrdinalIgnoreCase))
			{
				continue;
			}

			AddIdRange(set, el);
		}

		return set;
	}

	public static ActionRegistry LoadActionRegistry(string actionsXml, string scriptsDir)
	{
		var registry = new ActionRegistry();
		if (!File.Exists(actionsXml))
		{
			return registry;
		}

		var doc = LoadXml(actionsXml);
		foreach (XmlElement el in doc.GetElementsByTagName("action"))
		{
			var hasUnique = el.HasAttribute("uniqueid") || el.HasAttribute("fromuid");
			var hasActionId = el.HasAttribute("actionid") || el.HasAttribute("fromaid");
			if (!hasUnique && !hasActionId)
			{
				continue;
			}

			var script = el.GetAttribute("script");
			var function = el.GetAttribute("function");
			var scriptExists = !string.IsNullOrWhiteSpace(function)
				|| (!string.IsNullOrWhiteSpace(script)
					&& File.Exists(Path.Combine(scriptsDir, script.Replace('/', Path.DirectorySeparatorChar))));
			var handler = new ActionHandler(script, function, scriptExists);

			if (hasUnique)
			{
				AddKeyRange(registry.UniqueIds, el, "uniqueid", "fromuid", "touid", handler);
			}

			if (hasActionId)
			{
				AddKeyRange(registry.ActionIds, el, "actionid", "fromaid", "toaid", handler);
			}
		}

		return registry;
	}

	public static IReadOnlyList<NpcDefinition> LoadNpcs(string npcDir, string scriptsDir)
	{
		var list = new List<NpcDefinition>();
		foreach (var file in Directory.GetFiles(npcDir, "*.xml", SearchOption.TopDirectoryOnly))
		{
			var doc = LoadXml(file);
			var root = doc.DocumentElement;
			if (root is null || !root.Name.Equals("npc", StringComparison.OrdinalIgnoreCase))
			{
				continue;
			}

			var name = root.GetAttribute("name");
			if (string.IsNullOrWhiteSpace(name))
			{
				name = Path.GetFileNameWithoutExtension(file);
			}

			var script = root.GetAttribute("script");
			var lookType = 0;
			var lookTypeEx = 0;
			var look = root.SelectSingleNode("look") as XmlElement;
			if (look is not null)
			{
				int.TryParse(look.GetAttribute("type"), NumberStyles.Integer, CultureInfo.InvariantCulture, out lookType);
				int.TryParse(look.GetAttribute("typeex"), NumberStyles.Integer, CultureInfo.InvariantCulture, out lookTypeEx);
			}

			var shopIds = new List<int>();
			var parameters = root.SelectNodes(".//parameter");
			if (parameters is not null)
			{
				foreach (XmlNode node in parameters)
				{
					if (node is not XmlElement param)
					{
						continue;
					}

					var key = param.GetAttribute("key");
					if (key is "shop_buyable" or "shop_sellable")
					{
						foreach (Match match in ShopItemRegex.Matches(param.GetAttribute("value") ?? ""))
						{
							shopIds.Add(int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture));
						}
					}
				}
			}

			list.Add(new NpcDefinition(Path.GetFileName(file), name, script, lookType, lookTypeEx, shopIds));
		}

		_ = scriptsDir;
		return list;
	}

	public static IReadOnlyList<SpawnedNpc> LoadSpawnedNpcs(string spawnXml)
	{
		var list = new List<SpawnedNpc>();
		if (!File.Exists(spawnXml))
		{
			return list;
		}

		var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore, IgnoreComments = true };
		using var reader = XmlReader.Create(spawnXml, settings);
		var centerX = 0;
		var centerY = 0;
		var centerZ = 0;
		while (reader.Read())
		{
			if (reader.NodeType != XmlNodeType.Element)
			{
				continue;
			}

			if (reader.Name == "spawn")
			{
				centerX = ParseInt(reader.GetAttribute("centerx"));
				centerY = ParseInt(reader.GetAttribute("centery"));
				centerZ = ParseInt(reader.GetAttribute("centerz"));
			}
			else if (reader.Name == "npc")
			{
				var name = reader.GetAttribute("name") ?? "";
				var x = centerX + ParseInt(reader.GetAttribute("x"));
				var y = centerY + ParseInt(reader.GetAttribute("y"));
				var z = reader.GetAttribute("z") is { Length: > 0 } zs ? ParseInt(zs) : centerZ;
				list.Add(new SpawnedNpc(name, new MapPosition(x, y, z)));
			}
		}

		return list;
	}

	public static HashSet<string> LoadMonsterNames(string monsterDir)
	{
		var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
		if (!Directory.Exists(monsterDir))
		{
			return names;
		}

		foreach (var file in Directory.GetFiles(monsterDir, "*.xml", SearchOption.AllDirectories))
		{
			try
			{
				var doc = LoadXml(file);
				var name = doc.DocumentElement?.GetAttribute("name");
				if (!string.IsNullOrWhiteSpace(name))
				{
					names.Add(name);
				}
			}
			catch (XmlException)
			{
			}
		}

		return names;
	}

	public static IReadOnlyList<string> LoadSpawnedMonsterNames(string spawnXml)
	{
		var list = new List<string>();
		if (!File.Exists(spawnXml))
		{
			return list;
		}

		var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore, IgnoreComments = true };
		using var reader = XmlReader.Create(spawnXml, settings);
		while (reader.Read())
		{
			if (reader.NodeType == XmlNodeType.Element && reader.Name == "monster")
			{
				var name = reader.GetAttribute("name");
				if (!string.IsNullOrWhiteSpace(name))
				{
					list.Add(name);
				}
			}
		}

		return list;
	}

	static void AddIdRange(HashSet<int> set, XmlElement el)
	{
		var itemId = ParseInt(el.GetAttribute("itemid"));
		if (itemId != 0)
		{
			set.Add(itemId);
			return;
		}

		var fromId = ParseInt(el.GetAttribute("fromid"));
		var toId = ParseInt(el.GetAttribute("toid"));
		if (fromId != 0 && toId != 0)
		{
			for (var id = fromId; id <= toId; id++)
			{
				set.Add(id);
			}
		}
	}

	static void AddKeyRange(
		Dictionary<int, ActionHandler> map,
		XmlElement el,
		string singleAttr,
		string fromAttr,
		string toAttr,
		ActionHandler handler)
	{
		var id = ParseInt(el.GetAttribute(singleAttr));
		if (id != 0)
		{
			map[id] = handler;
			return;
		}

		var fromId = ParseInt(el.GetAttribute(fromAttr));
		var toId = ParseInt(el.GetAttribute(toAttr));
		if (fromId != 0 && toId != 0)
		{
			for (var key = fromId; key <= toId; key++)
			{
				map[key] = handler;
			}
		}
	}

	static HashSet<int> ParseIntSet(string lua, string identifier)
	{
		var idx = lua.IndexOf(identifier, StringComparison.Ordinal);
		if (idx < 0)
		{
			return [];
		}

		var slice = lua[idx..];
		var match = LuaIntListRegex.Match(slice);
		if (!match.Success)
		{
			return [];
		}

		var set = new HashSet<int>();
		foreach (var part in match.Groups[1].Value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
		{
			if (int.TryParse(part, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value))
			{
				set.Add(value);
			}
		}

		return set;
	}

	static IEnumerable<XmlElement> EnumerateElements(string path, string name)
	{
		var doc = LoadXml(path);
		foreach (XmlElement el in doc.GetElementsByTagName(name))
		{
			yield return el;
		}
	}

	static XmlDocument LoadXml(string path)
	{
		var doc = new XmlDocument { XmlResolver = null };
		doc.Load(path);
		return doc;
	}

	static int ParseInt(string? value) =>
		int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : 0;
}
