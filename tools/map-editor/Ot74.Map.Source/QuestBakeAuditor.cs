using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Valida quests YAML + system.lua contra o OTBM baked (uids, rewards, portas, chaves, corpses, paredes).
/// </summary>
public static class QuestBakeAuditor
{
	public const int BlackKnightKeyUid = 10065;
	public const int BlackKnightKeyAid = 5010;
	public const int DeadTreeId = 2720;

	public sealed record Finding(string Severity, string Category, string Where, string What);

	public sealed record Report(
		IReadOnlyList<Finding> Findings,
		IReadOnlyList<QuestDocument> Quests,
		IReadOnlyDictionary<int, RewardEntry> Rewards,
		IReadOnlyDictionary<int, List<IndexedItem>> ByUid,
		IReadOnlyDictionary<int, List<IndexedItem>> ByAid,
		IReadOnlyList<IndexedItem> NonChestContainers);

	public sealed record RewardEntry(int Uid, IReadOnlyList<RewardItem> Items);

	public sealed record RewardItem(int ItemId, int Count, int? ActionId);

	public sealed record IndexedItem(int X, int Y, int Z, int ItemId, int Aid, int Uid, bool HasContents);

	public static Report Run(
		string otbmPath,
		string sourceRoot,
		string systemLuaPath,
		string itemsXmlPath,
		string? spawnXmlPath = null,
		string? npcDir = null)
	{
		var quests = LoadQuests(sourceRoot);
		var rewards = ParseQuestRewards(systemLuaPath);
		var corpseIds = LoadDeadContainerIds(itemsXmlPath);
		var wallIds = LoadWallIds(itemsXmlPath);
		var groundIds = LoadLikelyGroundIds(itemsXmlPath);
		var matchIds = new HashSet<int>(QuestPatcher.DefaultMatchIds);
		foreach (var id in corpseIds)
		{
			matchIds.Add(id);
		}

		var yamlUids = CollectYamlPatchUids(quests);
		var keyAids = rewards.Values
			.SelectMany(r => r.Items)
			.Where(i => i.ActionId is > 0)
			.Select(i => i.ActionId!.Value)
			.ToHashSet();

		var patchPositions = new HashSet<(int X, int Y, int Z)>();
		foreach (var quest in quests)
		{
			foreach (var patch in quest.Patches)
			{
				var p = patch.Position;
				patchPositions.Add((p.X, p.Y, p.Z));
			}
		}

		var byUid = new Dictionary<int, List<IndexedItem>>();
		var byAid = new Dictionary<int, List<IndexedItem>>();
		var byPos = new Dictionary<(int, int, int), List<IndexedItem>>();

		IndexOtbm(otbmPath, patchPositions, keyAids, byUid, byAid, byPos);

		var findings = new List<Finding>();
		CheckYamlPatches(quests, byPos, byUid, matchIds, wallIds, groundIds, findings);
		CheckYamlUidRewards(yamlUids, byUid, rewards, findings);
		CheckOrphanQuestContainers(byUid, rewards, yamlUids, findings);
		CheckKeyDoorChains(rewards, byUid, byAid, findings);
		CheckCorpseRewards(byUid, corpseIds, rewards, yamlUids, findings);
		CheckDoorBoxes(quests, byAid, findings);
		if (spawnXmlPath is not null && npcDir is not null)
		{
			CheckNpcScripts(spawnXmlPath, npcDir, findings);
		}

		var nonChest = byUid.Values
			.SelectMany(v => v)
			.Where(i => i.Uid > 0 && IsNonChestContainer(i.ItemId, matchIds, corpseIds))
			.GroupBy(i => i.Uid)
			.Select(g => g.First())
			.OrderBy(i => i.Uid)
			.ToList();

		return new Report(findings, quests, rewards, byUid, byAid, nonChest);
	}

	public static string RenderMarkdown(Report report)
	{
		var fails = report.Findings.Where(f => f.Severity == "FAIL").ToList();
		var warns = report.Findings.Where(f => f.Severity == "WARN").ToList();
		var sb = new StringBuilder();
		sb.AppendLine("# Validação quest ↔ OTBM baked");
		sb.AppendLine();
		sb.AppendLine("Gerado por `otmap validate-quests` / `QuestBakeAuditTests`.");
		sb.AppendLine();
		sb.AppendLine($"**FAIL:** {fails.Count} · **WARN:** {warns.Count} · quests YAML: {report.Quests.Count} · questRewards: {report.Rewards.Count}");
		sb.AppendLine();
		sb.AppendLine("## Dívida conhecida");
		sb.AppendLine();
		sb.AppendLine("FAILs de **YAML patch sem match/item** e **Door box** são dívida de coords/boxes vs baked OTBM — documentados aqui; Facts de regressão cobrem paredes, rewards YAML presentes, Black Knight uid+actionId, e o write deste ficheiro. Keydoor `5010` sem `IsDoor` fica WARN.");
		sb.AppendLine();
		sb.AppendLine("## Índice");
		sb.AppendLine();
		sb.AppendLine("| Severity | Category | Count |");
		sb.AppendLine("|----------|----------|------:|");
		foreach (var g in report.Findings.GroupBy(f => (f.Severity, f.Category)).OrderBy(g => g.Key.Severity).ThenBy(g => g.Key.Category))
		{
			sb.AppendLine($"| {g.Key.Severity} | {g.Key.Category} | {g.Count()} |");
		}

		sb.AppendLine();
		sb.AppendLine("## Non-chest quest containers");
		sb.AppendLine();
		if (report.NonChestContainers.Count == 0)
		{
			sb.AppendLine("_Nenhum (árvore/drawer/corpse com uid)._");
		}
		else
		{
			sb.AppendLine("| Uid | ItemId | Coords |");
			sb.AppendLine("|----:|-------:|--------|");
			foreach (var c in report.NonChestContainers.Take(100))
			{
				sb.AppendLine($"| {c.Uid} | {c.ItemId} | `{c.X},{c.Y},{c.Z}` |");
			}
		}

		if (report.Findings.Count == 0)
		{
			sb.AppendLine();
			sb.AppendLine("_Nenhum finding._");
			return sb.ToString();
		}

		foreach (var g in report.Findings.GroupBy(f => f.Category).OrderBy(g => g.Key))
		{
			sb.AppendLine();
			sb.AppendLine($"## {g.Key} ({g.Count()})");
			sb.AppendLine();
			sb.AppendLine("| Sev | Onde | O quê |");
			sb.AppendLine("|-----|------|-------|");
			foreach (var f in g.Take(80))
			{
				sb.AppendLine($"| {f.Severity} | `{EscapePipe(f.Where)}` | {EscapePipe(f.What)} |");
			}

			if (g.Count() > 80)
			{
				sb.AppendLine($"| … | … | +{g.Count() - 80} mais |");
			}
		}

		return sb.ToString();
	}

	static string EscapePipe(string s) => s.Replace("|", "\\|", StringComparison.Ordinal);

	static List<QuestDocument> LoadQuests(string sourceRoot)
	{
		var manifestPath = Path.Combine(sourceRoot, "world.map.yaml");
		if (File.Exists(manifestPath))
		{
			return SourceWorkspace.Load(sourceRoot).Quests.ToList();
		}

		var dir = Path.Combine(sourceRoot, "quests");
		if (!Directory.Exists(dir))
		{
			return [];
		}

		var quests = new List<QuestDocument>();
		foreach (var path in Directory.GetFiles(dir, "*.yaml").OrderBy(p => p, StringComparer.Ordinal))
		{
			var quest = QuestYaml.Deserialize(File.ReadAllText(path));
			if (string.IsNullOrWhiteSpace(quest.Name))
			{
				quest.Name = Path.GetFileNameWithoutExtension(path);
			}

			quests.Add(quest);
		}

		return quests;
	}

	/// <summary>Só uids de patches explícitos (scans são aspiracionais até o bake expandir).</summary>
	static HashSet<int> CollectYamlPatchUids(IReadOnlyList<QuestDocument> quests)
	{
		var set = new HashSet<int>();
		foreach (var quest in quests)
		{
			foreach (var patch in quest.Patches)
			{
				if (patch.Uid is { } uid)
				{
					set.Add(uid);
				}
			}
		}

		return set;
	}

	internal static Dictionary<int, RewardEntry> ParseQuestRewards(string systemLuaPath)
	{
		var text = File.ReadAllText(systemLuaPath);
		var start = text.IndexOf("questRewards", StringComparison.Ordinal);
		if (start < 0)
		{
			return new Dictionary<int, RewardEntry>();
		}

		var brace = text.IndexOf('{', start);
		if (brace < 0)
		{
			return new Dictionary<int, RewardEntry>();
		}

		var depth = 0;
		var end = brace;
		for (var i = brace; i < text.Length; i++)
		{
			if (text[i] == '{')
			{
				depth++;
			}
			else if (text[i] == '}')
			{
				depth--;
				if (depth == 0)
				{
					end = i;
					break;
				}
			}
		}

		var body = text[(brace + 1)..end];
		var map = new Dictionary<int, RewardEntry>();
		// Entrada: [uid] = { {itemId=…}, … }
		foreach (Match block in Regex.Matches(
			         body,
			         @"\[(\d+)\]\s*=\s*\{((?:[^{}]|\{[^{}]*\})*)\}",
			         RegexOptions.Singleline))
		{
			var uid = int.Parse(block.Groups[1].Value);
			var inner = block.Groups[2].Value;
			var items = new List<RewardItem>();
			foreach (Match item in Regex.Matches(inner, @"\{([^{}]*)\}", RegexOptions.Singleline))
			{
				var slice = item.Groups[1].Value;
				var idMatch = Regex.Match(slice, @"itemId\s*=\s*(\d+)", RegexOptions.IgnoreCase);
				if (!idMatch.Success)
				{
					continue;
				}

				var itemId = int.Parse(idMatch.Groups[1].Value);
				var countMatch = Regex.Match(slice, @"count\s*=\s*(\d+)", RegexOptions.IgnoreCase);
				var count = countMatch.Success ? int.Parse(countMatch.Groups[1].Value) : 1;
				var aidMatch = Regex.Match(slice, @"actionId\s*=\s*(\d+)", RegexOptions.IgnoreCase);
				int? actionId = aidMatch.Success ? int.Parse(aidMatch.Groups[1].Value) : null;
				items.Add(new RewardItem(itemId, count, actionId));
			}

			map[uid] = new RewardEntry(uid, items);
		}

		return map;
	}

	static HashSet<int> LoadDeadContainerIds(string itemsXmlPath) =>
		LoadItemIds(itemsXmlPath, (name, hasContainer) =>
			name.StartsWith("dead ", StringComparison.OrdinalIgnoreCase) && hasContainer);

	static HashSet<int> LoadWallIds(string itemsXmlPath) =>
		LoadItemIds(itemsXmlPath, (name, _) =>
		{
			var n = name.ToLowerInvariant();
			return n.Contains("wall", StringComparison.Ordinal)
				&& !n.Contains("lamp", StringComparison.Ordinal)
				&& !n.Contains("mirror", StringComparison.Ordinal)
				&& !n.Contains("fountain", StringComparison.Ordinal)
				&& !n.Contains("clock", StringComparison.Ordinal);
		});

	/// <summary>Chãos típicos 7.4; evita falso positivo “parede” quando há grass/floor no tile.</summary>
	static HashSet<int> LoadLikelyGroundIds(string itemsXmlPath)
	{
		string[] needles =
		[
			"grass", "sand", "dirt", "earth", "soil", "floor", "tile", "rock soil",
			"wooden floor", "stone floor", "marble floor", "drawbridge", "ice", "snow",
			"lava", "water", "swamp", "mud", "cobbled", "ploughed"
		];
		return LoadItemIds(itemsXmlPath, (name, _) =>
		{
			var n = name.ToLowerInvariant();
			if (n.Contains("wall", StringComparison.Ordinal))
			{
				return false;
			}

			return needles.Any(needle => n.Contains(needle, StringComparison.Ordinal));
		});
	}

	static HashSet<int> LoadItemIds(string itemsXmlPath, Func<string, bool, bool> accept)
	{
		var ids = new HashSet<int>();
		if (!File.Exists(itemsXmlPath))
		{
			return ids;
		}

		using var reader = XmlReader.Create(itemsXmlPath, new XmlReaderSettings { IgnoreComments = true, DtdProcessing = DtdProcessing.Ignore });
		while (reader.Read())
		{
			if (reader.NodeType != XmlNodeType.Element || reader.Name != "item")
			{
				continue;
			}

			var name = reader.GetAttribute("name") ?? "";
			var idAttr = reader.GetAttribute("id");
			var from = reader.GetAttribute("fromid") ?? reader.GetAttribute("fromId");
			var to = reader.GetAttribute("toid") ?? reader.GetAttribute("toId");
			var hasContainer = false;
			if (!reader.IsEmptyElement)
			{
				var sub = reader.ReadSubtree();
				while (sub.Read())
				{
					if (sub.NodeType == XmlNodeType.Element && sub.Name == "attribute"
					    && string.Equals(sub.GetAttribute("key"), "containersize", StringComparison.OrdinalIgnoreCase))
					{
						hasContainer = true;
					}
				}
			}

			if (!accept(name, hasContainer))
			{
				continue;
			}

			if (int.TryParse(idAttr, out var id))
			{
				ids.Add(id);
			}
			else if (int.TryParse(from, out var a) && int.TryParse(to, out var b))
			{
				for (var i = a; i <= b; i++)
				{
					ids.Add(i);
				}
			}
		}

		return ids;
	}

	static void IndexOtbm(
		string otbmPath,
		HashSet<(int X, int Y, int Z)> patchPositions,
		HashSet<int> keyAids,
		Dictionary<int, List<IndexedItem>> byUid,
		Dictionary<int, List<IndexedItem>> byAid,
		Dictionary<(int, int, int), List<IndexedItem>> byPos)
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

			if (area is not { } current)
			{
				continue;
			}

			if (reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = RegionExtractor.ReadTileTree(reader, current);
			var key = (tile.Position.X, tile.Position.Y, tile.Position.Z);
			var interestingPos = patchPositions.Contains(key);

			foreach (var item in Flatten(tile.Items))
			{
				var aid = item.ActionId ?? 0;
				var uid = item.UniqueId ?? 0;
				var keep = interestingPos
					|| uid > 0
					|| aid is 2000 or 2001
					|| keyAids.Contains(aid)
					|| (aid > 0 && QuestPatcher.IsDoor(item.Id));
				if (!keep)
				{
					continue;
				}

				var indexed = new IndexedItem(
					tile.Position.X,
					tile.Position.Y,
					tile.Position.Z,
					item.Id,
					aid,
					uid,
					item.Contents.Count > 0);
				if (!byPos.TryGetValue(key, out var list))
				{
					list = [];
					byPos[key] = list;
				}

				list.Add(indexed);
				if (uid > 0)
				{
					AddIndex(byUid, uid, indexed);
				}

				if (aid > 0)
				{
					AddIndex(byAid, aid, indexed);
				}
			}

			// Em tiles de patch, indexa também walls/grounds sem aid/uid para heurística de parede
			if (interestingPos && tile.Items.Count > 0)
			{
				if (!byPos.TryGetValue(key, out var list))
				{
					list = [];
					byPos[key] = list;
				}

				foreach (var item in tile.Items)
				{
					var aid = item.ActionId ?? 0;
					var uid = item.UniqueId ?? 0;
					if (list.Any(x => x.ItemId == item.Id && x.Aid == aid && x.Uid == uid))
					{
						continue;
					}

					list.Add(new IndexedItem(
						tile.Position.X, tile.Position.Y, tile.Position.Z,
						item.Id, aid, uid, item.Contents.Count > 0));
				}
			}
		}
	}

	static IEnumerable<OtbmPlacedItem> Flatten(IEnumerable<OtbmPlacedItem> items)
	{
		foreach (var item in items)
		{
			yield return item;
			foreach (var child in Flatten(item.Contents))
			{
				yield return child;
			}
		}
	}

	static void AddIndex(Dictionary<int, List<IndexedItem>> map, int key, IndexedItem item)
	{
		if (!map.TryGetValue(key, out var list))
		{
			list = [];
			map[key] = list;
		}

		list.Add(item);
	}

	static void CheckYamlPatches(
		IReadOnlyList<QuestDocument> quests,
		Dictionary<(int, int, int), List<IndexedItem>> byPos,
		Dictionary<int, List<IndexedItem>> byUid,
		HashSet<int> matchIds,
		HashSet<int> wallIds,
		HashSet<int> groundIds,
		List<Finding> findings)
	{
		foreach (var quest in quests)
		{
			foreach (var patch in quest.Patches)
			{
				var pos = patch.Position;
				var key = (pos.X, pos.Y, pos.Z);
				var where = $"{quest.Name} @ {pos.X},{pos.Y},{pos.Z}";
				if (!byPos.TryGetValue(key, out var items) || items.Count == 0)
				{
					findings.Add(new Finding("FAIL", "YAML patch sem item", where,
						"Nenhum item indexado neste tile no OTBM baked."));
					continue;
				}

				IReadOnlyList<int> preferred = patch.Id is { } id
					? [id]
					: patch.Match.Count > 0 ? patch.Match : matchIds.ToList();

				var matched = items.Where(i => preferred.Contains(i.ItemId)).ToList();
				if (matched.Count == 0 && (patch.Uid is > 0 || patch.Aid is > 0))
				{
					matched = items.Where(i =>
						(patch.Uid is > 0 && i.Uid == patch.Uid) ||
						(patch.Aid is > 0 && i.Aid == patch.Aid)).ToList();
				}

				if (matched.Count == 0)
				{
					findings.Add(new Finding("FAIL", "YAML patch sem match", where,
						$"Esperado match ids [{string.Join(',', preferred.Take(8))}] ou aid/uid do patch."));
					continue;
				}

				if (patch.Uid is { } uid)
				{
					if (!matched.Any(i => i.Uid == uid) && !byUid.ContainsKey(uid))
					{
						findings.Add(new Finding("FAIL", "YAML uid ausente no OTBM", where,
							$"uid {uid} não encontrado no tile nem no índice global."));
					}
				}

				if (patch.Aid is { } aid && !matched.Any(i => i.Aid == aid))
				{
					findings.Add(new Finding("FAIL", "YAML aid ausente no tile", where,
						$"aid {aid} não está no item matchado."));
				}

				// Baú/contentor embutido em parede: há wall e não há chão no tile
				var isContainerPatch = matched.Any(m => matchIds.Contains(m.ItemId) || m.Uid > 0);
				if (isContainerPatch)
				{
					var hasWall = items.Any(i => wallIds.Contains(i.ItemId));
					var hasGround = items.Any(i => groundIds.Contains(i.ItemId));
					if (hasWall && !hasGround)
					{
						findings.Add(new Finding("FAIL", "Quest na parede", where,
							"Contentor de quest no mesmo tile que parede, sem ground reconhecido."));
					}
				}
			}
		}
	}

	static void CheckYamlUidRewards(
		HashSet<int> yamlUids,
		Dictionary<int, List<IndexedItem>> byUid,
		Dictionary<int, RewardEntry> rewards,
		List<Finding> findings)
	{
		foreach (var uid in yamlUids.OrderBy(u => u))
		{
			if (!byUid.TryGetValue(uid, out var placements))
			{
				// Ausência no OTBM já sai como YAML patch sem match/item — não duplicar aqui
				continue;
			}

			var hasReward = rewards.ContainsKey(uid);
			var hasContents = placements.Any(p => p.HasContents);
			if (!hasReward && !hasContents)
			{
				findings.Add(new Finding("FAIL", "Uid sem reward path",
					$"uid {uid} @ {FormatPos(placements[0])}",
					"Sem entrada em questRewards e sem contents no container."));
			}
		}
	}

	/// <summary>
	/// Contentores aid 2000/2001 no mapa que não vêm do YAML — inventário (WARN), não regressão de bake.
	/// </summary>
	static void CheckOrphanQuestContainers(
		Dictionary<int, List<IndexedItem>> byUid,
		Dictionary<int, RewardEntry> rewards,
		HashSet<int> yamlUids,
		List<Finding> findings)
	{
		foreach (var (uid, placements) in byUid)
		{
			if (yamlUids.Contains(uid) || uid is >= 52169 and <= 52171 or 9000)
			{
				continue;
			}

			var questish = placements.Where(p => p.Uid == uid && p.Aid is 2000 or 2001).ToList();
			if (questish.Count == 0)
			{
				continue;
			}

			if (rewards.ContainsKey(uid) || questish.Any(p => p.HasContents))
			{
				continue;
			}

			findings.Add(new Finding("WARN", "Uid sem reward path",
				$"uid {uid} @ {FormatPos(questish[0])}",
				"Contentor aid 2000/2001 legado sem questRewards nem contents (não está no YAML)."));
		}
	}

	static void CheckKeyDoorChains(
		Dictionary<int, RewardEntry> rewards,
		Dictionary<int, List<IndexedItem>> byUid,
		Dictionary<int, List<IndexedItem>> byAid,
		List<Finding> findings)
	{
		foreach (var reward in rewards.Values)
		{
			foreach (var item in reward.Items.Where(i => i.ActionId is > 0))
			{
				var keyAid = item.ActionId!.Value;
				if (!byUid.ContainsKey(reward.Uid))
				{
					findings.Add(new Finding("FAIL", "Chave: uid ausente",
						$"uid {reward.Uid} → key aid {keyAid}",
						"questRewards define chave mas o uid não está no OTBM."));
					continue;
				}

				var doorHits = byAid.GetValueOrDefault(keyAid)?
					.Where(d => QuestPatcher.IsDoor(d.ItemId))
					.ToList() ?? [];
				var anyAidHits = byAid.GetValueOrDefault(keyAid) ?? [];
				if (doorHits.Count == 0 && anyAidHits.Count == 0)
				{
					// Keydoor nativo pode não aparecer como IsDoor; sem nenhum item com o aid = WARN
					findings.Add(new Finding("WARN", "Chave sem porta",
						$"uid {reward.Uid} key aid {keyAid}",
						"Nenhum item com esse actionid no OTBM (porta/keydoor)."));
				}
				else if (doorHits.Count == 0)
				{
					findings.Add(new Finding("WARN", "Chave sem porta",
						$"uid {reward.Uid} key aid {keyAid}",
						$"Aid existe em {anyAidHits.Count} item(ns) não-porta — verificar keydoor nativo."));
				}
			}
		}

		// Black Knight canónico (árvore 10065 → key 5010 → porta)
		if (!byUid.ContainsKey(BlackKnightKeyUid))
		{
			findings.Add(new Finding("FAIL", "Black Knight chain",
				$"uid {BlackKnightKeyUid}",
				"Key 5010 (árvore) ausente no OTBM baked."));
		}
		else if (!rewards.TryGetValue(BlackKnightKeyUid, out var bk) ||
		         bk.Items.All(i => i.ActionId != BlackKnightKeyAid))
		{
			findings.Add(new Finding("FAIL", "Black Knight chain",
				$"uid {BlackKnightKeyUid}",
				"system.lua deve recompensar item com actionId 5010."));
		}
		else if (!byAid.TryGetValue(BlackKnightKeyAid, out var bkDoors) ||
		         bkDoors.All(d => !QuestPatcher.IsDoor(d.ItemId)))
		{
			findings.Add(new Finding("WARN", "Black Knight chain",
				$"key aid {BlackKnightKeyAid}",
				"Nenhuma porta IsDoor com actionid 5010 (keydoor pode ser nativo / fora do range)."));
		}
	}

	static void CheckCorpseRewards(
		Dictionary<int, List<IndexedItem>> byUid,
		HashSet<int> corpseIds,
		Dictionary<int, RewardEntry> rewards,
		HashSet<int> yamlUids,
		List<Finding> findings)
	{
		foreach (var (uid, placements) in byUid)
		{
			if (!yamlUids.Contains(uid))
			{
				continue;
			}

			if (!placements.Any(p => corpseIds.Contains(p.ItemId) && p.Aid is 2000 or 2001))
			{
				continue;
			}

			if (!rewards.ContainsKey(uid) && placements.All(p => !p.HasContents))
			{
				findings.Add(new Finding("FAIL", "Corpse quest sem reward",
					$"uid {uid} @ {FormatPos(placements[0])} item {placements[0].ItemId}",
					"Corpse YAML com aid de quest sem questRewards nem contents."));
			}
		}
	}

	static void CheckDoorBoxes(
		IReadOnlyList<QuestDocument> quests,
		Dictionary<int, List<IndexedItem>> byAid,
		List<Finding> findings)
	{
		foreach (var quest in quests)
		{
			foreach (var box in quest.Boxes.Where(b => b.Kind.Equals("door", StringComparison.OrdinalIgnoreCase)))
			{
			if (!byAid.TryGetValue(box.Aid, out var items) || items.Count == 0)
			{
				findings.Add(new Finding("FAIL", "Door box sem porta",
					$"{quest.Name} aid {box.Aid} box {box.FromPos}-{box.ToPos}",
					"Nenhum item com este aid no OTBM (box não aplicou)."));
			}
			else if (!items.Any(i => QuestPatcher.IsDoor(i.ItemId)))
			{
				findings.Add(new Finding("WARN", "Door box sem porta",
					$"{quest.Name} aid {box.Aid} box {box.FromPos}-{box.ToPos}",
					$"Aid presente em {items.Count} item(ns) mas nenhum IsDoor."));
			}
			}
		}
	}

	static void CheckNpcScripts(string spawnXmlPath, string npcDir, List<Finding> findings)
	{
		if (!File.Exists(spawnXmlPath) || !Directory.Exists(npcDir))
		{
			return;
		}

		foreach (var npcXml in Directory.GetFiles(npcDir, "*.xml"))
		{
			var name = Path.GetFileNameWithoutExtension(npcXml);
			var npcText = File.ReadAllText(npcXml);
			var script = Regex.Match(npcText, @"script\s*=\s*""([^""]*)""", RegexOptions.IgnoreCase);
			if (!script.Success || string.IsNullOrWhiteSpace(script.Groups[1].Value))
			{
				findings.Add(new Finding("WARN", "NPC script", name, "script= vazio ou ausente."));
				continue;
			}

			var scriptPath = Path.Combine(npcDir, "scripts", script.Groups[1].Value);
			if (!File.Exists(scriptPath))
			{
				findings.Add(new Finding("WARN", "NPC script", name, $"Ficheiro em falta: {script.Groups[1].Value}"));
			}
		}
	}

	static bool IsNonChestContainer(int itemId, HashSet<int> matchIds, HashSet<int> corpseIds) =>
		itemId == DeadTreeId
		|| (itemId is >= 2709 and <= 2720)
		|| corpseIds.Contains(itemId)
		|| (matchIds.Contains(itemId) && itemId is not (>= 1738 and <= 1753));

	static string FormatPos(IndexedItem i) => $"{i.X},{i.Y},{i.Z}";
}

