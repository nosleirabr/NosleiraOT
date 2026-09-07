using Ot74.Gameplay.Tests;

namespace Ot74.Gameplay.Tests.Catalog;

public sealed class WorldCatalog
{
	public ItemCatalog Items { get; }
	public HashSet<int> OutfitLookTypes { get; }
	public HashSet<int> DisabledOutfitLookTypes { get; }
	public IReadOnlyList<TravelHarbour> Harbours { get; }
	public HashSet<int> LevelDoorIds { get; }
	public HashSet<int> QuestDoorIds { get; }
	public IReadOnlyList<NpcDefinition> Npcs { get; }
	public IReadOnlyList<SpawnedNpc> SpawnedNpcs { get; }
	public HashSet<string> MonsterNames { get; }
	public IReadOnlyList<string> SpawnedMonsterNames { get; }
	public OtbmMap Map { get; }
	public ActionRegistry Actions { get; }
	public IReadOnlyList<TravelRoute> TravelRoutes { get; }
	public IReadOnlyList<QuestDefinition> Quests { get; }

	WorldCatalog(
		ItemCatalog items,
		HashSet<int> outfitLookTypes,
		HashSet<int> disabledOutfitLookTypes,
		IReadOnlyList<TravelHarbour> harbours,
		HashSet<int> levelDoorIds,
		HashSet<int> questDoorIds,
		IReadOnlyList<NpcDefinition> npcs,
		IReadOnlyList<SpawnedNpc> spawnedNpcs,
		HashSet<string> monsterNames,
		IReadOnlyList<string> spawnedMonsterNames,
		OtbmMap map,
		ActionRegistry actions,
		IReadOnlyList<TravelRoute> travelRoutes,
		IReadOnlyList<QuestDefinition> quests)
	{
		Items = items;
		OutfitLookTypes = outfitLookTypes;
		DisabledOutfitLookTypes = disabledOutfitLookTypes;
		Harbours = harbours;
		LevelDoorIds = levelDoorIds;
		QuestDoorIds = questDoorIds;
		Npcs = npcs;
		SpawnedNpcs = spawnedNpcs;
		MonsterNames = monsterNames;
		SpawnedMonsterNames = spawnedMonsterNames;
		Map = map;
		Actions = actions;
		TravelRoutes = travelRoutes;
		Quests = quests;
	}

	public static WorldCatalog Load()
	{
		var items = ItemCatalog.Load(RepoPaths.ItemsXml);
		var outfits = DatapackCatalog.LoadOutfitLookTypes(RepoPaths.OutfitsXml, enabledOnly: false);
		var disabledOutfits = DatapackCatalog.LoadDisabledOutfitLookTypes(RepoPaths.OutfitsXml);
		var harbours = DatapackCatalog.LoadHarbours(RepoPaths.TravelLua);
		var (levelDoors, questDoors) = DatapackCatalog.LoadDoorIds(RepoPaths.GlobalLua);
		var ropeSpots = DatapackCatalog.LoadLuaIntSet(RepoPaths.GlobalLua, "ropeSpots");
		var upFloorIds = DatapackCatalog.LoadLuaIntSet(RepoPaths.TeleportLua, "upFloorIds");
		var teleportActionIds = DatapackCatalog.LoadActionItemIds(RepoPaths.ActionsXml, "other/teleport.lua");
		var useUpIds = new HashSet<int>(upFloorIds);
		useUpIds.UnionWith(teleportActionIds.Where(upFloorIds.Contains));
		if (useUpIds.Count == 0)
		{
			useUpIds.UnionWith(upFloorIds);
		}

		var useDownIds = new HashSet<int>(teleportActionIds);
		useDownIds.ExceptWith(upFloorIds);
		var npcs = DatapackCatalog.LoadNpcs(RepoPaths.NpcDir, RepoPaths.NpcScriptsDir);
		var spawnedNpcs = DatapackCatalog.LoadSpawnedNpcs(RepoPaths.SpawnXml);
		var monsters = DatapackCatalog.LoadMonsterNames(RepoPaths.MonsterDir);
		var spawnedMonsters = DatapackCatalog.LoadSpawnedMonsterNames(RepoPaths.SpawnXml);
		var actions = DatapackCatalog.LoadActionRegistry(RepoPaths.ActionsXml, RepoPaths.ActionScriptsDir);

		// Prefer baked OTBM (quest aids/uids from otmap); fall back to LFS baseline.
		var otbmPath = RepoPaths.PreferBakedOtbm();
		var map = OtbmParser.Load(otbmPath, items, levelDoors, questDoors, ropeSpots, useUpIds, useDownIds);
		var travelRoutes = DatapackCatalog.LoadTravelRoutes(RepoPaths.NpcScriptsDir, harbours);
		var quests = QuestCatalog.Load(RepoPaths.QuestsXml);
		return new WorldCatalog(items, outfits, disabledOutfits, harbours, levelDoors, questDoors, npcs, spawnedNpcs, monsters, spawnedMonsters, map, actions, travelRoutes, quests);
	}
}
