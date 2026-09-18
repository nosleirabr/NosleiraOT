using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class QuestContractTests
{
	readonly WorldCatalog _catalog;

	public QuestContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Quests_xml_loads_74_catalog()
	{
		Assert.InRange(_catalog.Quests.Count, 5, 8);
		Assert.Contains(_catalog.Quests, q => q.Name == "The Queen of the Banshees");
		Assert.Contains(_catalog.Quests, q => q.Name == "The Ancient Tombs");
		Assert.Contains(_catalog.Quests, q => q.Name == "The Djinn War - Efreet Faction");
		Assert.Contains(_catalog.Quests, q => q.Name == "The White Raven Monastery");
		Assert.DoesNotContain(_catalog.Quests, q => q.Name == "Barbarian Test Quest");
		Assert.DoesNotContain(_catalog.Quests, q => q.Name == "The Ape City");
		Assert.DoesNotContain(_catalog.Quests, q => q.Name == "The Ultimate Challenges");
		Assert.DoesNotContain(_catalog.Quests, q => q.Name == "Friends and Traders");
	}

	[Fact]
	public void Quest_start_storage_ids_are_unique()
	{
		var dupes = _catalog.Quests
			.GroupBy(q => q.StartStorageId)
			.Where(g => g.Key > 0 && g.Count() > 1)
			.Select(g => $"{g.Key}: {string.Join(", ", g.Select(q => q.Name))}")
			.ToList();

		Assert.True(dupes.Count == 0, Failures.Format("Duplicate quest startstorageid", dupes));
	}

	[Fact]
	public void Quest_missions_have_valid_value_ranges()
	{
		var bad = new List<string>();
		foreach (var quest in _catalog.Quests)
		{
			foreach (var mission in quest.Missions)
			{
				if (mission.EndValue < mission.StartValue)
				{
					bad.Add($"{quest.Name} / {mission.Name}: end {mission.EndValue} < start {mission.StartValue}");
				}
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Invalid quest mission ranges", bad));
	}

	[Fact]
	public void Quest_chests_exist_on_the_map()
	{
		Assert.True(_catalog.Map.QuestChests.Count > 0,
			"Parser found zero quest chests (container + aid 2000/2001 or uid>0). OTBM walk or items.xml is probably wrong.");
	}

	[Fact]
	public void Quest_chests_with_uniqueid_use_quest_system_actionid()
	{
		var bad = _catalog.Map.QuestChests
			.Where(c => c.UniqueId > 0 && c.UniqueId != 9000 && !QuestCatalog.QuestSystemActionIds.Contains(c.ActionId))
			.Select(c => $"{c.Position} item {c.ItemId} uid={c.UniqueId} aid={c.ActionId} (expected aid 2000/2001 for system.lua storage=uid)")
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Quest chests with uid but no system actionid", bad, take: 25));
	}

	[Fact]
	public void Quest_chests_with_system_actionid_have_system_script()
	{
		var bad = new List<string>();
		foreach (var chest in _catalog.Map.QuestChests.Where(c => QuestCatalog.QuestSystemActionIds.Contains(c.ActionId)))
		{
			if (!_catalog.Actions.TryResolve(chest.UniqueId, chest.ActionId, out var handler))
			{
				bad.Add($"{chest.Position} aid={chest.ActionId} uid={chest.UniqueId} (no actions.xml entry)");
				continue;
			}

			if (!QuestCatalog.IsQuestSystemScript(handler))
			{
				bad.Add($"{chest.Position} aid={chest.ActionId} -> {handler.Script} (expected quests/system.lua)");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Quest chests without quests/system handler", bad, take: 25));
	}

	[Fact]
	public void Quest_doors_have_actionid()
	{
		var bad = _catalog.Map.QuestDoors
			.Where(d => d.ActionId <= 0)
			.Select(d => $"{d.Position} item {d.ItemId}")
			.ToList();

		Assert.True(bad.Count == 0, Failures.Format("Quest doors without actionid", bad, take: 25));
	}

	public static QuestChest? PickL4Chest(WorldCatalog catalog) =>
		catalog.Map.QuestChests
			.Where(c => QuestCatalog.QuestSystemActionIds.Contains(c.ActionId) && c.UniqueId > 0)
			.OrderBy(c => c.HasContents ? 0 : 1)
			.ThenBy(c => c.UniqueId)
			.FirstOrDefault();

	[Fact]
	public void Medusa_Shield_Quest_is_properly_wired_on_map()
	{
		var medusaChest = _catalog.Map.QuestChests.FirstOrDefault(c => c.UniqueId == 10026);
		var skullStaffChest = _catalog.Map.QuestChests.FirstOrDefault(c => c.UniqueId == 10027);
		var blueBookChest = _catalog.Map.QuestChests.FirstOrDefault(c => c.UniqueId == 10028);

		Assert.True(medusaChest != null, "Missing Medusa Shield chest (uid 10026) in Drefia.");
		Assert.True(skullStaffChest != null, "Missing Skull Staff chest (uid 10027) in Drefia.");
		Assert.True(blueBookChest != null, "Missing Blue Book chest (uid 10028) in Drefia.");
	}

	[Fact]
	public void Quest_levers_for_major_74_quests_are_properly_wired()
	{
		int[] requiredActionIds = new[]
		{
			30016, // Annihilator Lever
			50666, // Demon Helmet Quest Lever
			30047, // Bright Sword Quest Lever
			30030, // Paradox Tower Stairs Lever
			30033, // Paradox Tower Magic Walls Lever
			30041, // Banshee Logic Seal 1
			30042, // Banshee Logic Seal 2
			30043, // Banshee Logic Seal 3
			30044, // Banshee Logic Seal 4
			30045  // Banshee Logic Seal 5
		};

		var missing = new List<string>();
		foreach (var aid in requiredActionIds)
		{
			if (!_catalog.Actions.TryResolve(uniqueId: 0, actionId: aid, out var handler) || !handler.ScriptExists)
			{
				missing.Add($"ActionId {aid} missing script handler in actions.xml");
			}
		}

		Assert.True(missing.Count == 0, Failures.Format("Missing major quest lever handlers", missing));
	}
}
