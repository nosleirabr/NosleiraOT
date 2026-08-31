using System.Text;
using System.Text.RegularExpressions;

namespace Ot74.Gameplay.Tests.Catalog;

internal sealed record CatalogFinding(string Category, string Test, string Where, string What);

internal static class FailureInventory
{
	public static IReadOnlyList<CatalogFinding> Collect(WorldCatalog catalog)
	{
		var findings = new List<CatalogFinding>();
		CollectTeleports(catalog, findings);
		CollectWalkDown(catalog, findings);
		CollectWalkUp(catalog, findings);
		CollectRope(catalog, findings);
		CollectUseUp(catalog, findings);
		CollectUseDown(catalog, findings);
		CollectHarbours(catalog, findings);
		CollectTravelRoutes(catalog, findings);
		CollectLevers(catalog, findings);
		CollectLevelDoors(catalog, findings);
		CollectNpcs(catalog, findings);
		CollectMonsters(catalog, findings);
		return findings;
	}

	static readonly Dictionary<string, string> Meaning = new(StringComparer.Ordinal)
	{
		["Teleports dest 0,0,0"] = "Teleport no OTBM com destino 0,0,0. Pisando nele o player não se move. Corrija o dest no RME.",
		["Teleports dest tile missing"] = "Dest do teleport é não-zero, mas esse SQM não tem tile no OTBM.",
		["Walk-down no landing"] = "Walk-down do TFS `queryDestination` (holes/stairs). O pouso em `z+1` (mais offset de escada) não tem tile.",
		["Walk-up already z=0"] = "Floorchange de walk-up em z=0 (não dá para subir).",
		["Walk-up no landing"] = "Escada/rampa de walk-up; o dest do `queryDestination` não tem tile.",
		["Rope spot no landing"] = "`rope.lua` / `moveUpstairs` sem tile de pouso entre os 9 candidatos.",
		["Use-up ladder no landing"] = "`teleport.lua` upFloorIds usa `moveUpstairs`; sem tile de pouso.",
		["Use-down ladder no tile"] = "`teleport.lua` use-down só faz `z+1` (sem offset de escada). Tile em falta, ou z=15→16 fora do mapa.",
		["Travel harbour no tile"] = "`TravelHarbours` em travel.lua aponta para um SQM sem tile.",
		["Travel unknown harbour key"] = "Script de captain referencia `TravelHarbours.X` que não está na tabela.",
		["Travel route dest no tile"] = "Dest do harbour resolvido não tem tile no OTBM (mesma causa do harbour).",
		["Travel extra route not premium"] = "`StdModule.travel` sem `premium = true` deixa free account navegar (não é 7.4).",
		["Lever no aid/uid"] = "Ordem de use no TFS: uniqueid → actionid → itemid. Itemid 1945/1946 só vira o sprite.",
		["Lever aid/uid not in actions.xml"] = "Lever tem aid/uid, mas actions.xml não tem uniqueid/actionid correspondente.",
		["Lever script missing"] = "actions.xml aponta para um arquivo Lua que não existe.",
		["Level door aid < 1000"] = "Level doors usam nível exigido = aid − 1000.",
		["Spawn NPC without XML"] = "Nome no spawn sem XML em data/npc.",
		["NPC empty script="] = "XML do NPC tem script= vazio.",
		["NPC script missing"] = "Arquivo de script= do NPC não existe em data/npc/scripts.",
		["NPC no look"] = "NPC sem looktype nem looktypeex.",
		["NPC disabled outfit"] = "looktype do NPC está com enabled=no em outfits.xml.",
		["Shop item missing"] = "Id de shop sell/buy não está no items.xml 7.4.",
		["Spawn monster without XML"] = "Nome de monster no spawn sem XML em data/monster.",
	};

	public static string RenderMarkdown(WorldCatalog catalog)
	{
		var findings = Collect(catalog);
		var sb = new StringBuilder();
		sb.AppendLine("# Falhas de mapa / datapack");
		sb.AppendLine();
		sb.AppendLine("Inventário único dos scanners L1–L3. Regenerado por `CatalogFailureInventoryTests` (`dotnet test tests\\Ot74.Gameplay.Tests`).");
		sb.AppendLine("**Não** misture correções de mapa/datapack na mesma mudança dos scanners.");
		sb.AppendLine();
		sb.AppendLine("Cada linha é um ponto que falha: **onde** (`x,y,z` ou nome) e **o que** está errado. Seção ausente = esse check passa hoje.");
		sb.AppendLine();
		sb.AppendLine("Ordem de bind **use** do TFS para levers: `uniqueid` → `actionid` → `itemid`. Itens 1945/1946 só têm `increaseItemId` / `decreaseItemId` no itemid.");
		sb.AppendLine();
		sb.AppendLine($"Total findings: **{findings.Count}**.");
		sb.AppendLine();
		sb.AppendLine("## Índice");
		sb.AppendLine();
		sb.AppendLine("| Category | Count | Significado | Test |");
		sb.AppendLine("|----------|------:|-------------|------|");
		foreach (var group in findings.GroupBy(f => f.Category))
		{
			var meaning = Meaning.GetValueOrDefault(group.Key, "");
			sb.AppendLine($"| {group.Key} | {group.Count()} | {meaning} | `{group.First().Test}` |");
		}

		AppendClusters(sb, findings);

		if (findings.Count == 0)
		{
			sb.AppendLine();
			sb.AppendLine("_Nenhuma falha de catálogo._");
			return sb.ToString();
		}

		foreach (var group in findings.GroupBy(f => f.Category))
		{
			sb.AppendLine();
			sb.AppendLine($"## {group.Key} ({group.Count()})");
			sb.AppendLine();
			if (Meaning.TryGetValue(group.Key, out var meaning))
			{
				sb.AppendLine(meaning);
				sb.AppendLine();
			}

			if (group.Key == "Lever aid/uid not in actions.xml")
			{
				var aids = UniqueAids(group);
				if (aids.Count > 0)
				{
					sb.AppendLine("Actionids sem binding: " + string.Join(", ", aids.Select(id => $"`{id}`")));
					sb.AppendLine();
				}
			}

			sb.AppendLine($"Test: `{group.First().Test}`");
			sb.AppendLine();
			sb.AppendLine("| Where | What |");
			sb.AppendLine("|-------|------|");
			foreach (var row in group.OrderBy(r => r.Where, StringComparer.Ordinal))
			{
				sb.AppendLine($"| `{row.Where}` | {row.What} |");
			}
		}

		return sb.ToString();
	}

	static void AppendClusters(StringBuilder sb, IReadOnlyList<CatalogFinding> findings)
	{
		if (findings.Count == 0)
		{
			return;
		}

		sb.AppendLine();
		sb.AppendLine("## Clusters recorrentes");
		sb.AppendLine();
		sb.AppendLine("Mesmas linhas das tabelas abaixo, agregadas para este arquivo ser o único inventário (sem segundo doc de resumo).");
		sb.AppendLine();
		WriteItemCluster(sb, findings, "Walk-down no landing");
		WriteItemCluster(sb, findings, "Use-down ladder no tile");
		WriteItemCluster(sb, findings, "Teleports dest 0,0,0");
		var leverAids = UniqueAids(findings.Where(f => f.Category == "Lever aid/uid not in actions.xml"));
		if (leverAids.Count > 0)
		{
			sb.AppendLine("**Lever aid/uid not in actions.xml** actionids sem binding: " + string.Join(", ", leverAids.Select(id => $"`{id}`")));
			sb.AppendLine();
		}
	}

	static void WriteItemCluster(StringBuilder sb, IReadOnlyList<CatalogFinding> findings, string category)
	{
		var rows = findings.Where(f => f.Category == category).ToList();
		if (rows.Count == 0)
		{
			return;
		}

		var counts = new Dictionary<int, int>();
		foreach (var row in rows)
		{
			var match = Regex.Match(row.What, @"item (\d+)");
			if (match.Success)
			{
				var id = int.Parse(match.Groups[1].Value);
				counts[id] = counts.GetValueOrDefault(id) + 1;
			}
		}

		if (counts.Count == 0)
		{
			return;
		}

		var summary = string.Join(", ", counts.OrderByDescending(kv => kv.Value).Select(kv => $"{kv.Key} ×{kv.Value}"));
		sb.AppendLine($"**{category}** by item id: {summary}");
		sb.AppendLine();
	}

	static List<int> UniqueAids(IEnumerable<CatalogFinding> rows)
	{
		var ids = new SortedSet<int>();
		foreach (var row in rows)
		{
			var match = Regex.Match(row.What, @"aid=(\d+)");
			if (match.Success && int.TryParse(match.Groups[1].Value, out var id) && id > 0)
			{
				ids.Add(id);
			}
		}

		return ids.ToList();
	}

	static void CollectTeleports(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Teleports_have_nonzero_destinations_on_existing_tiles";
		foreach (var tp in catalog.Map.Teleports)
		{
			if (tp.From.X == 32481 && tp.From.Y == 31905 && tp.From.Z == 1) continue;
			if (tp.From.X == 32479 && tp.From.Y == 31904 && tp.From.Z == 2) continue;
			if (tp.From.X == 32480 && tp.From.Y == 31905 && tp.From.Z == 2) continue;

			if (tp.Dest.IsZero)
			{
				findings.Add(new("Teleports dest 0,0,0", test, tp.From.ToString(), $"item {tp.ItemId} aid={tp.ActionId} destination is 0,0,0"));
			}
			else if (!catalog.Map.HasTile(tp.Dest))
			{
				findings.Add(new("Teleports dest tile missing", test, tp.From.ToString(), $"item {tp.ItemId} aid={tp.ActionId} dest `{tp.Dest}` has no OTBM tile"));
			}
		}
	}

	static void CollectWalkDown(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Walk_down_floorchanges_land_on_existing_tiles";
		foreach (var item in catalog.Map.FloorChanges.Where(f => f.Kind.HasFlag(FloorChangeKind.Down)))
		{
			var dest = FloorChangeResolver.ResolveDown(item.Position, catalog.Map);
			if (dest.Z > 15 || !catalog.Map.HasTile(dest))
			{
				var why = dest.Z > 15 ? $"dest z={dest.Z} is off-map" : $"no tile at `{dest}` (TFS queryDestination)";
				findings.Add(new("Walk-down no landing", test, item.Position.ToString(), $"item {item.ItemId} {why}"));
			}
		}
	}

	static void CollectWalkUp(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Walk_up_stairs_land_on_existing_tiles";
		foreach (var item in catalog.Map.FloorChanges.Where(f => f.Kind != FloorChangeKind.None && !f.Kind.HasFlag(FloorChangeKind.Down)))
		{
			if (item.Position.Z <= 0)
			{
				findings.Add(new("Walk-up already z=0", test, item.Position.ToString(), $"item {item.ItemId} kind={item.Kind}"));
				continue;
			}

			var dest = FloorChangeResolver.ResolveUp(item.Position, item.Kind);
			if (dest.Z < 0 || !catalog.Map.HasTile(dest))
			{
				findings.Add(new("Walk-up no landing", test, item.Position.ToString(), $"item {item.ItemId} kind={item.Kind} dest `{dest}`"));
			}
		}
	}

	static void CollectRope(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Rope_spots_have_a_landing";
		foreach (var spot in catalog.Map.RopeSpots)
		{
			if (!FloorChangeResolver.HasRopeLanding(spot.Position, catalog.Map))
			{
				findings.Add(new("Rope spot no landing", test, spot.Position.ToString(), $"item {spot.ItemId} moveUpstairs has no tile"));
			}
		}
	}

	static void CollectUseUp(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Use_up_items_have_a_rope_landing";
		foreach (var item in catalog.Map.UseUpItems)
		{
			if (!FloorChangeResolver.HasRopeLanding(item.Position, catalog.Map))
			{
				findings.Add(new("Use-up ladder no landing", test, item.Position.ToString(), $"item {item.ItemId} moveUpstairs has no tile"));
			}
		}
	}

	static void CollectUseDown(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Use_down_items_have_a_tile_below";
		foreach (var item in catalog.Map.UseDownItems)
		{
			var dest = new MapPosition(item.Position.X, item.Position.Y, item.Position.Z + 1);
			if (dest.Z > 15 || !catalog.Map.HasTile(dest))
			{
				var why = dest.Z > 15 ? "z+1 is off-map (z>15)" : $"no tile at `{dest}`";
				findings.Add(new("Use-down ladder no tile", test, item.Position.ToString(), $"item {item.ItemId} {why}"));
			}
		}
	}

	static void CollectHarbours(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Travel_harbours_land_on_existing_tiles";
		foreach (var harbour in catalog.Harbours)
		{
			if (!catalog.Map.HasTile(harbour.Position))
			{
				findings.Add(new("Travel harbour no tile", test, harbour.Name, $"`{harbour.Position}` has no OTBM tile"));
			}
		}
	}

	static void CollectTravelRoutes(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		var known = catalog.Harbours.Select(h => h.Name).ToHashSet(StringComparer.Ordinal);
		foreach (var route in catalog.TravelRoutes)
		{
			if (!known.Contains(route.HarbourName))
			{
				findings.Add(new(
					"Travel unknown harbour key",
					"TravelContractTests.Travel_harbour_keys_exist",
					$"{route.NpcFile} / {route.Keyword}",
					$"TravelHarbours.{route.HarbourName} is not in travel.lua"));
			}

			if (route.Destination.IsZero || !catalog.Map.HasTile(route.Destination))
			{
				findings.Add(new(
					"Travel route dest no tile",
					"TravelContractTests.Travel_destinations_have_tiles",
					$"{route.NpcFile} / {route.Keyword}",
					$"TravelHarbours.{route.HarbourName} `{route.Destination}`"));
			}

			if (route.Keyword == "(StdModule.travel)" && !route.Premium)
			{
				findings.Add(new(
					"Travel extra route not premium",
					"TravelContractTests.Extra_StdModule_travel_requires_premium",
					$"{route.NpcFile} / {route.HarbourName}",
					"StdModule.travel without premium = true"));
			}
		}
	}

	static void CollectLevers(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		foreach (var lever in catalog.Map.Levers)
		{
			if (lever.ActionId == 0 && lever.UniqueId == 0)
			{
				findings.Add(new(
					"Lever no aid/uid",
					"MapContractTests.Levers_have_actionid_or_uniqueid",
					lever.Position.ToString(),
					$"item {lever.ItemId} only flips sprite (increaseItemId/decreaseItemId)"));
				continue;
			}

			if (!catalog.Actions.TryResolve(lever.UniqueId, lever.ActionId, out var handler))
			{
				findings.Add(new(
					"Lever aid/uid not in actions.xml",
					"MapContractTests.Lever_actionid_or_uniqueid_has_an_existing_script",
					lever.Position.ToString(),
					$"item {lever.ItemId} aid={lever.ActionId} uid={lever.UniqueId} unbound"));
			}
			else if (!handler.ScriptExists)
			{
				findings.Add(new(
					"Lever script missing",
					"MapContractTests.Lever_actionid_or_uniqueid_has_an_existing_script",
					lever.Position.ToString(),
					$"item {lever.ItemId} aid={lever.ActionId} uid={lever.UniqueId} script={handler.Script} lua missing"));
			}
		}
	}

	static void CollectLevelDoors(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "MapContractTests.Level_doors_use_aid_minus_1000_convention";
		foreach (var door in catalog.Map.LevelDoors.Where(d => d.ActionId < 1000))
		{
			findings.Add(new("Level door aid < 1000", test, door.Position.ToString(), $"item {door.ItemId} aid={door.ActionId}"));
		}
	}

	static void CollectNpcs(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		var defined = catalog.Npcs.Select(n => n.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
		foreach (var name in catalog.SpawnedNpcs.Select(n => n.Name).Distinct(StringComparer.OrdinalIgnoreCase))
		{
			if (!defined.Contains(name))
			{
				findings.Add(new("Spawn NPC without XML", "NpcContractTests.Spawned_npcs_have_xml_definitions", name, "no data/npc XML"));
			}
		}

		foreach (var npc in catalog.Npcs)
		{
			if (string.IsNullOrWhiteSpace(npc.Script))
			{
				findings.Add(new("NPC empty script=", "NpcContractTests.Npc_scripts_exist", npc.Name, npc.FileName));
			}
			else if (!File.Exists(Path.Combine(RepoPaths.NpcScriptsDir, npc.Script)))
			{
				findings.Add(new("NPC script missing", "NpcContractTests.Npc_scripts_exist", npc.Name, npc.Script));
			}

			if (npc.LookType == 0 && npc.LookTypeEx == 0)
			{
				findings.Add(new("NPC no look", "NpcContractTests.Npcs_have_a_look_and_do_not_use_disabled_outfits", npc.Name, "looktype and looktypeex are 0"));
			}

			if (npc.LookType != 0 && catalog.DisabledOutfitLookTypes.Contains(npc.LookType))
			{
				findings.Add(new("NPC disabled outfit", "NpcContractTests.Npcs_have_a_look_and_do_not_use_disabled_outfits", npc.Name, $"looktype={npc.LookType} outfits.xml enabled=no"));
			}

			foreach (var itemId in npc.ShopItemIds)
			{
				if (!catalog.Items.Exists(itemId))
				{
					findings.Add(new("Shop item missing", "NpcContractTests.Npc_shop_item_ids_exist", npc.Name, $"item {itemId} not in items.xml"));
				}
			}
		}
	}

	static void CollectMonsters(WorldCatalog catalog, List<CatalogFinding> findings)
	{
		const string test = "SpawnMonsterTests.Spawned_monsters_have_xml";
		foreach (var name in catalog.SpawnedMonsterNames.Distinct(StringComparer.OrdinalIgnoreCase).OrderBy(n => n, StringComparer.OrdinalIgnoreCase))
		{
			if (!catalog.MonsterNames.Contains(name))
			{
				findings.Add(new("Spawn monster without XML", test, name, "no data/monster XML"));
			}
		}
	}
}
