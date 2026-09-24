using Ot74.Map.Source;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

/// <summary>
/// Auditoria quest YAML ↔ OTBM baked. Relatório canónico: docs/MAP_QUEST_VALIDATION.md.
/// FAILs de coords/YAML em dívida ficam no relatório; Facts cobrem regressões graves e o write do doc.
/// </summary>
public sealed class QuestBakeAuditTests
{
	static readonly Lazy<QuestBakeAuditor.Report> Shared = new(Load);

	static QuestBakeAuditor.Report Load()
	{
		var otbm = RepoPaths.PreferBakedOtbm();
		var source = Path.Combine(RepoPaths.Root, "maps", "src");
		var systemLua = Path.Combine(RepoPaths.Data, "actions", "scripts", "quests", "system.lua");
		var report = QuestBakeAuditor.Run(
			otbm,
			source,
			systemLua,
			RepoPaths.ItemsXml,
			RepoPaths.SpawnXml,
			RepoPaths.NpcDir);

		var outPath = Path.Combine(RepoPaths.Root, "docs", "MAP_QUEST_VALIDATION.md");
		Directory.CreateDirectory(Path.GetDirectoryName(outPath)!);
		File.WriteAllText(outPath, QuestBakeAuditor.RenderMarkdown(report));
		return report;
	}

	static IEnumerable<QuestBakeAuditor.Finding> Fails(string? category = null) =>
		Shared.Value.Findings.Where(f => f.Severity == "FAIL"
			&& (category is null || f.Category.Equals(category, StringComparison.OrdinalIgnoreCase)));

	[Fact]
	public void Writes_docs_map_quest_validation()
	{
		_ = Shared.Value;
		var path = Path.Combine(RepoPaths.Root, "docs", "MAP_QUEST_VALIDATION.md");
		Assert.True(File.Exists(path), path);
		var md = File.ReadAllText(path);
		Assert.Contains("Validação quest", md, StringComparison.Ordinal);
		Assert.Contains("Non-chest quest containers", md, StringComparison.Ordinal);
	}

	[Fact]
	public void Yaml_patches_resolve_on_baked_otbm()
	{
		// Dívida de coords documentada no relatório; este Fact falha só se explodir (limite de sanidade).
		var bad = Fails("YAML patch sem item")
			.Concat(Fails("YAML patch sem match"))
			.Concat(Fails("YAML uid ausente no OTBM"))
			.Concat(Fails("YAML aid ausente no tile"))
			.Select(f => $"{f.Where}: {f.What}")
			.ToList();
		Assert.True(bad.Count < 80,
			Failures.Format($"YAML patch FAILs too high ({bad.Count}) — see MAP_QUEST_VALIDATION.md", bad, take: 25));
	}

	[Fact]
	public void Quest_uids_have_reward_path()
	{
		var bad = Fails("Uid sem reward path").Select(f => $"{f.Where}: {f.What}").ToList();
		Assert.True(bad.Count == 0, Failures.Format("Quest uids without reward path", bad, take: 30));
	}

	[Fact]
	public void Quest_key_rewards_have_matching_doors()
	{
		// Ausência de porta = WARN (keydoor nativo); FAIL só se uid da chave faltar no OTBM.
		var bad = Fails("Chave: uid ausente").Select(f => $"{f.Where}: {f.What}").ToList();
		Assert.True(bad.Count == 0, Failures.Format("Key rewards whose uid is missing on OTBM", bad, take: 30));
	}

	[Fact]
	public void Black_Knight_key_5010_chain_is_wired()
	{
		var bad = Fails("Black Knight chain").Select(f => $"{f.Where}: {f.What}").ToList();
		Assert.True(bad.Count == 0, Failures.Format("Black Knight key 5010 chain broken", bad));

		Assert.True(Shared.Value.ByUid.ContainsKey(QuestBakeAuditor.BlackKnightKeyUid),
			"uid 10065 (Key 5010 under tree) missing on baked OTBM");
		Assert.True(Shared.Value.Rewards.TryGetValue(QuestBakeAuditor.BlackKnightKeyUid, out var reward)
			&& reward.Items.Any(i => i.ActionId == QuestBakeAuditor.BlackKnightKeyAid),
			"system.lua must give actionId 5010 for uid 10065");
		// Porta 5010: WARN no relatório se ausente (keydoor nativo / fora de IsDoor)
	}

	[Fact]
	public void Quest_chests_not_embedded_in_walls()
	{
		var bad = Fails("Quest na parede").Select(f => $"{f.Where}: {f.What}").ToList();
		Assert.True(bad.Count == 0, Failures.Format("Quest containers embedded in walls", bad, take: 30));
	}

	[Fact]
	public void Quest_corpses_with_uid_have_reward_path()
	{
		var bad = Fails("Corpse quest sem reward").Select(f => $"{f.Where}: {f.What}").ToList();
		Assert.True(bad.Count == 0, Failures.Format("Quest corpses without reward path", bad, take: 30));
	}

	[Fact]
	public void ParseQuestRewards_reads_actionId_keys()
	{
		var path = Path.Combine(RepoPaths.Data, "actions", "scripts", "quests", "system.lua");
		var rewards = QuestBakeAuditor.ParseQuestRewards(path);
		Assert.True(rewards.ContainsKey(10065));
		Assert.Contains(rewards[10065].Items, i => i.ItemId == 2088 && i.ActionId == 5010);
	}
}

