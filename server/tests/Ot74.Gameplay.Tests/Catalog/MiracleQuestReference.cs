using System.Globalization;
using System.Text.RegularExpressions;

namespace Ot74.Gameplay.Tests.Catalog;

public sealed record MiracleQuestEntry(int Index, string Name, int? StoreId, string StoreRaw, string City);

public static class MiracleQuestReference
{
	static readonly Regex QuestLine = new(
		@"\[(?<idx>\d+)\]\s*=\s*\{Name\s*=\s*""(?<name>[^""]+)""\s*,Store\s*=\s*(?<store>[^,]+)",
		RegexOptions.Compiled);

	static readonly Regex StorageAssign = new(
		@"(?<key>[\w]+)\s*=\s*(?<val>\d+)",
		RegexOptions.Compiled);

	public static IReadOnlyList<string> LoadMiracleCatalog(string path)
	{
		if (!File.Exists(path))
		{
			return Array.Empty<string>();
		}

		return File.ReadAllLines(path)
			.Select(l => l.Trim())
			.Where(l => l.Length > 0 && !l.StartsWith('#'))
			.ToList();
	}

	public static IReadOnlyList<MissionNpcStatus> LoadMissionNpcStatus(string npcDir, string npcScriptsDir)
	{
		var missionNpcs = new[]
		{
			"Baa'Leal", "Gabel", "Kevin", "Dalbrect", "Costello", "Queen Eloise", "King Tibianus",
			"Malor", "Alesar", "Bo'Ques", "Fa'Hradin", "Haroun", "Nah'Bob", "Yaman", "Partos", "Umar", "Ubaid",
			"The Queen Of The Banshees", "Omur", "Thalas", "Diphtrah", "Mahrdis", "Vashresamun", "Morguthis", "Rahemos"
		};

		var stubScripts = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
		{
			"default.lua", "healer.lua", "bank.lua", "runes.lua", "bless.lua", "promotion.lua"
		};

		var results = new List<MissionNpcStatus>();
		foreach (var expectedName in missionNpcs)
		{
			var xml = Directory.GetFiles(npcDir, "*.xml")
				.FirstOrDefault(f => string.Equals(Path.GetFileNameWithoutExtension(f), expectedName, StringComparison.OrdinalIgnoreCase));
			if (xml is null)
			{
				results.Add(new MissionNpcStatus(expectedName, false, null, "missing-xml"));
				continue;
			}

			var script = ReadNpcScript(xml);
			var scriptPath = Path.Combine(npcScriptsDir, script);
			var isStub = stubScripts.Contains(script) || !File.Exists(scriptPath);
			results.Add(new MissionNpcStatus(expectedName, true, script, isStub ? "stub" : "real"));
		}

		return results;
	}

	public static LeverQuestStatus LoadLeverQuestScripts(string actionsXmlPath, string actionScriptsDir)
	{
		var xml = File.Exists(actionsXmlPath) ? File.ReadAllText(actionsXmlPath) : "";
		var patterns = new (string Quest, string[] Patterns)[]
		{
			("Annihilator", new[] { "annihilator", "2214", "2208" }),
			("Desert Dungeon", new[] { "desert", "1912", "desertDungeon" }),
			("Paradox Tower", new[] { "paradox", "11001", "11002", "11004", "11005" }),
			("Queen of the Banshees", new[] { "banshee", "49998", "50002", "50021", "firstSeal", "thirdSeal" })
		};

		var entries = patterns.Select(p =>
		{
			var found = p.Patterns.Any(pat => xml.Contains(pat, StringComparison.OrdinalIgnoreCase));
			var scriptHits = p.Patterns
				.SelectMany(pat => Directory.Exists(actionScriptsDir)
					? Directory.EnumerateFiles(actionScriptsDir, "*.lua", SearchOption.AllDirectories)
						.Where(f => f.Contains(pat, StringComparison.OrdinalIgnoreCase))
					: Enumerable.Empty<string>())
				.Distinct()
				.ToList();
			return new LeverQuestEntry(p.Quest, found || scriptHits.Count > 0, scriptHits);
		}).ToList();

		return new LeverQuestStatus(entries);
	}

	public static IReadOnlyList<MiracleQuestEntry> LoadQuestLua(string questLuaPath, string? storagesLuaPath)
	{
		if (!File.Exists(questLuaPath))
		{
			return Array.Empty<MiracleQuestEntry>();
		}

		var storageMap = storagesLuaPath is not null && File.Exists(storagesLuaPath)
			? BuildStorageMap(File.ReadAllText(storagesLuaPath))
			: new Dictionary<string, int>(StringComparer.Ordinal);

		var list = new List<MiracleQuestEntry>();
		foreach (Match m in QuestLine.Matches(File.ReadAllText(questLuaPath)))
		{
			var idx = int.Parse(m.Groups["idx"].Value, CultureInfo.InvariantCulture);
			var name = m.Groups["name"].Value.Trim();
			var storeRaw = m.Groups["store"].Value.Trim();
			list.Add(new MiracleQuestEntry(idx, name, ResolveStore(storeRaw, storageMap), storeRaw, ""));
		}

		return list;
	}

	static string ReadNpcScript(string npcXmlPath)
	{
		foreach (var line in File.ReadAllLines(npcXmlPath))
		{
			var match = Regex.Match(line, @"script=""([^""]+)""");
			if (match.Success)
			{
				return match.Groups[1].Value;
			}
		}

		return "default.lua";
	}

	static Dictionary<string, int> BuildStorageMap(string lua)
	{
		var map = new Dictionary<string, int>(StringComparer.Ordinal);
		var stack = new Stack<string>();
		foreach (var rawLine in lua.Split('\n'))
		{
			var line = rawLine.Trim();
			if (line.StartsWith("--", StringComparison.Ordinal))
			{
				continue;
			}

			var open = Regex.Match(line, @"^(?<key>[\w]+)\s*=\s*\{");
			if (open.Success)
			{
				stack.Push(open.Groups["key"].Value);
				continue;
			}

			if (line == "}," || line == "}")
			{
				if (stack.Count > 0)
				{
					stack.Pop();
				}

				continue;
			}

			var assign = StorageAssign.Match(line);
			if (!assign.Success || stack.Count == 0)
			{
				continue;
			}

			var path = string.Join('.', stack.Reverse()) + "." + assign.Groups["key"].Value;
			map[path] = int.Parse(assign.Groups["val"].Value, CultureInfo.InvariantCulture);
		}

		return map;
	}

	static int? ResolveStore(string storeRaw, IReadOnlyDictionary<string, int> storageMap)
	{
		storeRaw = storeRaw.Trim();
		if (int.TryParse(storeRaw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var direct))
		{
			return direct;
		}

		if (storeRaw.StartsWith("Storage.", StringComparison.Ordinal))
		{
			var key = storeRaw["Storage.".Length..].Trim();
			if (storageMap.TryGetValue(key, out var val))
			{
				return val;
			}
		}

		return null;
	}

	public static string NormalizeName(string name) =>
		Regex.Replace(name.ToLowerInvariant(), @"[^a-z0-9]+", "");

	public static bool NamesMatch(string a, string b)
	{
		var na = NormalizeName(a);
		var nb = NormalizeName(b);
		return na == nb || na.Contains(nb, StringComparison.Ordinal) || nb.Contains(na, StringComparison.Ordinal);
	}
}

public sealed record MissionNpcStatus(string Name, bool XmlExists, string? Script, string Status);

public sealed record LeverQuestEntry(string Quest, bool Present, IReadOnlyList<string> ScriptPaths);

public sealed record LeverQuestStatus(IReadOnlyList<LeverQuestEntry> Entries);
