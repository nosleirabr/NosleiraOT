using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class NpcContractTests
{
	readonly WorldCatalog _catalog;

	public NpcContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[Fact]
	public void Spawned_npcs_have_xml_definitions()
	{
		var defined = _catalog.Npcs
			.Select(n => n.Name)
			.ToHashSet(StringComparer.OrdinalIgnoreCase);
		var missing = _catalog.SpawnedNpcs
			.Select(n => n.Name)
			.Distinct(StringComparer.OrdinalIgnoreCase)
			.Where(name => !defined.Contains(name))
			.OrderBy(n => n, StringComparer.OrdinalIgnoreCase)
			.ToList();

		Assert.True(missing.Count == 0, Failures.Format("Spawn NPCs without data/npc XML", missing));
	}

	[Fact]
	public void Npc_scripts_exist()
	{
		var missing = new List<string>();
		foreach (var npc in _catalog.Npcs)
		{
			if (string.IsNullOrWhiteSpace(npc.Script))
			{
				missing.Add($"{npc.Name}: empty script=");
				continue;
			}

			var path = Path.Combine(RepoPaths.NpcScriptsDir, npc.Script);
			if (!File.Exists(path))
			{
				missing.Add($"{npc.Name} -> {npc.Script}");
			}
		}

		Assert.True(missing.Count == 0, Failures.Format("NPC script files missing", missing));
	}

	[Fact]
	public void Npcs_have_a_look_and_do_not_use_disabled_outfits()
	{
		var missingLook = new List<string>();
		var disabled = new List<string>();
		foreach (var npc in _catalog.Npcs)
		{
			if (npc.LookType == 0 && npc.LookTypeEx == 0)
			{
				missingLook.Add(npc.Name);
			}

			if (npc.LookType != 0 && _catalog.DisabledOutfitLookTypes.Contains(npc.LookType))
			{
				disabled.Add($"{npc.Name} looktype={npc.LookType}");
			}
		}

		Assert.True(missingLook.Count == 0, Failures.Format("NPCs without look type/typeex", missingLook));
		Assert.True(disabled.Count == 0, Failures.Format("NPCs using outfits.xml enabled=no looktypes", disabled));
	}

	[Fact]
	public void Npc_shop_item_ids_exist()
	{
		var missing = new List<string>();
		foreach (var npc in _catalog.Npcs)
		{
			foreach (var itemId in npc.ShopItemIds)
			{
				if (!_catalog.Items.Exists(itemId))
				{
					missing.Add($"{npc.Name} item {itemId}");
				}
			}
		}

		Assert.True(missing.Count == 0, Failures.Format("Shop item ids missing from items.xml", missing));
	}
}
