using System.Text;
using Ot74.Gameplay.Tests.Catalog;
using Xunit;
using Xunit.Abstractions;

namespace Ot74.Gameplay.Tests;

public sealed class QuestCoverageAudit
{
	readonly ITestOutputHelper _output;

	public QuestCoverageAudit(ITestOutputHelper output) => _output = output;

	[Fact]
	public void Emit_miracle74_coverage_report()
	{
		var miracleMapPath = Path.Combine(RepoPaths.Root, "..", "miracle74", "map", "Miracle74.otbm");
		if (!File.Exists(miracleMapPath))
		{
			// Ignore test if external map is not found
			return;
		}

		var catalog = WorldCatalog.Load();
		var miraclePath = Path.Combine(RepoPaths.Root, "tests", "Ot74.Gameplay.Tests", "fixtures", "miracle74-quest-catalog.txt");
		var allowlistPath = Path.Combine(RepoPaths.Root, "tests", "Ot74.Gameplay.Tests", "fixtures", "quests-74-allowlist.txt");
		var questLuaPath = @"C:\Projetos\otserver800\server\data\lib\QuestPoints\Quest.lua";
		var storagesPath = @"C:\Projetos\otserver800\server\data\lib\core\storages.lua";

		if (!File.Exists(questLuaPath))
		{
			_output.WriteLine("Skipping audit: otserver800 reference files not found locally.");
			return;
		}

		var miracleNames = MiracleQuestReference.LoadMiracleCatalog(miraclePath);
		var allowlist = MiracleQuestReference.LoadMiracleCatalog(allowlistPath)
			.Select(MiracleQuestReference.NormalizeName)
			.ToHashSet(StringComparer.Ordinal);
		var questLua = MiracleQuestReference.LoadQuestLua(questLuaPath, storagesPath);
		var missionNpcs = MiracleQuestReference.LoadMissionNpcStatus(RepoPaths.NpcDir, RepoPaths.NpcScriptsDir);
		var leverQuests = MiracleQuestReference.LoadLeverQuestScripts(RepoPaths.ActionsXml, RepoPaths.ActionScriptsDir);

		var chests = catalog.Map.QuestChests;
		var mapUids = chests.Where(c => c.UniqueId > 0).Select(c => c.UniqueId).ToHashSet();
		var mapAid2000 = chests.Count(c => c.ActionId == 2000);
		var mapAid2001 = chests.Count(c => c.ActionId == 2001);
		var mapWithContents = chests.Count(c => c.HasContents);
		var mapWithUid = chests.Count(c => c.UniqueId > 0);

		var luaNumericStores = questLua
			.Where(q => q.StoreId.HasValue && q.StoreId.Value is > 0 and <= 65535)
			.GroupBy(q => q.StoreId!.Value)
			.ToDictionary(g => g.Key, g => g.Select(x => x.Name).ToList());

		var onMapFromLua = luaNumericStores.Keys.Where(mapUids.Contains).ToList();
		var missingOnMapFromLua = luaNumericStores.Keys.Where(k => !mapUids.Contains(k)).OrderBy(k => k).ToList();
		var onMapNotInLua = mapUids.Where(k => !luaNumericStores.ContainsKey(k)).OrderBy(k => k).ToList();

		var handlerOk = 0;
		var handlerBad = new List<string>();
		foreach (var chest in chests.Where(c => QuestCatalog.QuestSystemActionIds.Contains(c.ActionId)))
		{
			if (catalog.Actions.TryResolve(chest.UniqueId, chest.ActionId, out var handler)
			    && QuestCatalog.IsQuestSystemScript(handler))
			{
				handlerOk++;
			}
			else
			{
				handlerBad.Add($"{chest.Position} uid={chest.UniqueId} aid={chest.ActionId}");
			}
		}

		static bool IsMissionQuest(string name, HashSet<string> allow)
		{
			var n = MiracleQuestReference.NormalizeName(name);
			if (allow.Contains(n))
			{
				return true;
			}

			string[] missionHints =
			{
				"annihilator", "desertdungeon", "paradox", "djinnwar", "postman", "banshee", "ancienttombs", "whiteraven"
			};
			return missionHints.Any(h => n.Contains(h, StringComparison.Ordinal));
		}

		var missionMiracle = miracleNames.Where(n => IsMissionQuest(n, allowlist)).ToList();
		var chestMiracle = miracleNames.Where(n => !IsMissionQuest(n, allowlist)).ToList();

		var chestMatched = new List<string>();
		var chestUnmatched = new List<string>();
		foreach (var name in chestMiracle)
		{
			var luaHit = questLua.FirstOrDefault(q => MiracleQuestReference.NamesMatch(q.Name, name));
			if (luaHit?.StoreId is > 0 and <= 65535 && mapUids.Contains(luaHit.StoreId.Value))
			{
				chestMatched.Add(name);
			}
			else
			{
				chestUnmatched.Add(name);
			}
		}

		var sb = new StringBuilder();
		sb.AppendLine("=== Miracle74 Quest Coverage Audit ===");
		sb.AppendLine($"Miracle74 catalog names: {miracleNames.Count}");
		sb.AppendLine($"  mission-style: {missionMiracle.Count}");
		sb.AppendLine($"  chest/exploration: {chestMiracle.Count}");
		sb.AppendLine($"otserver800 Quest.lua entries: {questLua.Count} (indices 0-{questLua.Max(q => q.Index)})");
		sb.AppendLine($"quests.xml loaded: {catalog.Quests.Count} quest(s)");
		sb.AppendLine();
		sb.AppendLine("--- OTBM quest chests ---");
		sb.AppendLine($"Total quest chests (container + uid>0 or aid 2000/2001): {chests.Count}");
		sb.AppendLine($"  with uid > 0: {mapWithUid}");
		sb.AppendLine($"  with aid 2000: {mapAid2000}");
		sb.AppendLine($"  with aid 2001: {mapAid2001}");
		sb.AppendLine($"  with container contents: {mapWithContents}");
		sb.AppendLine($"  aid 2000/2001 wired to quests/system.lua: {handlerOk} ok, {handlerBad.Count} bad");
		sb.AppendLine();
		sb.AppendLine("--- UID crosswalk (Quest.lua numeric Store vs OTBM uid) ---");
		sb.AppendLine($"Quest.lua numeric stores (<=65535): {luaNumericStores.Count}");
		sb.AppendLine($"  present on map: {onMapFromLua.Count}");
		sb.AppendLine($"  missing on map: {missingOnMapFromLua.Count}");
		sb.AppendLine($"Map uids not in Quest.lua: {onMapNotInLua.Count}");
		if (onMapNotInLua.Count > 0)
		{
			sb.AppendLine($"Map-only uids: {string.Join(", ", onMapNotInLua.OrderBy(x => x))}");
		}
		if (missingOnMapFromLua.Count > 0)
		{
			sb.AppendLine("Top missing uids (store, quest name):");
			foreach (var uid in missingOnMapFromLua.Take(15))
			{
				var names = string.Join("; ", luaNumericStores[uid]);
				sb.AppendLine($"  uid {uid}: {names}");
			}
		}

		sb.AppendLine();
		sb.AppendLine("--- Miracle74 chest quests (map presence via Quest.lua uid) ---");
		sb.AppendLine($"Matched (uid on map): {chestMatched.Count}/{chestMiracle.Count}");
		sb.AppendLine($"Unmatched / no uid on map: {chestUnmatched.Count}");
		if (chestUnmatched.Count > 0)
		{
			sb.AppendLine("Unmatched chest quests:");
			foreach (var name in chestUnmatched.Take(25))
			{
				sb.AppendLine($"  - {name}");
			}

			if (chestUnmatched.Count > 25)
			{
				sb.AppendLine($"  ... and {chestUnmatched.Count - 25} more");
			}
		}

		sb.AppendLine();
		sb.AppendLine("--- Mission quests ---");
		sb.AppendLine($"Miracle74 mission count: {missionMiracle.Count}");
		foreach (var name in missionMiracle)
		{
			var inXml = catalog.Quests.Any(q => MiracleQuestReference.NamesMatch(q.Name, name));
			sb.AppendLine($"  {(inXml ? "[quests.xml]" : "[no xml]")} {name}");
		}

		sb.AppendLine();
		sb.AppendLine("--- Mission NPC script status ---");
		foreach (var npc in missionNpcs)
		{
			sb.AppendLine($"  {npc.Name}: {npc.Status} (script={npc.Script ?? "n/a"})");
		}

		sb.AppendLine();
		sb.AppendLine("--- Lever / puzzle quest actions ---");
		foreach (var entry in leverQuests.Entries)
		{
			sb.AppendLine($"  {entry.Quest}: {(entry.Present ? "FOUND" : "MISSING")}");
			if (entry.ScriptPaths.Count > 0)
			{
				foreach (var path in entry.ScriptPaths.Take(3))
				{
					sb.AppendLine($"    script: {path}");
				}
			}
		}

		sb.AppendLine();
		sb.AppendLine("--- Verdict ---");
		var chestPct = chestMiracle.Count == 0 ? 0 : (double)chestMatched.Count / chestMiracle.Count * 100;
		var missionXml = missionMiracle.Count(n => catalog.Quests.Any(q => MiracleQuestReference.NamesMatch(q.Name, n)));
		var missionNpcReal = missionNpcs.Count(n => n.Status == "real");
		sb.AppendLine($"NOT all 99 Miracle74 quests are playable in otserver76.");
		sb.AppendLine($"Chest layer: ~{chestPct:F0}% map uid presence ({chestMatched.Count}/{chestMiracle.Count}); system.lua handler generic only (specialQuests empty).");
		sb.AppendLine($"Mission layer: {missionXml}/{missionMiracle.Count} in quests.xml; {missionNpcReal}/{missionNpcs.Count} mission NPCs have real scripts.");
		sb.AppendLine($"Lever/puzzle quests (Annihilator, Desert, Paradox, Banshee seals): action scripts MISSING in otserver76/actions.");

		var report = sb.ToString();
		_output.WriteLine(report);
		Console.WriteLine(report);

		Assert.True(chests.Count > 0, "Expected quest chests on map.");
	}
}
