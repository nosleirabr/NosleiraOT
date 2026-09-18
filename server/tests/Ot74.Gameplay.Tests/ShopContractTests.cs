using System.Text.RegularExpressions;
using Ot74.Gameplay.Tests.Catalog;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class ShopContractTests
{
	readonly WorldCatalog _catalog;

	public ShopContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	static readonly Regex AddBuyableRegex = new(@"addBuyableItem\(.*?,\s*(\d+)\s*,\s*(\d+)", RegexOptions.Compiled);
	static readonly Regex AddSellableRegex = new(@"addSellableItem\(.*?,\s*(\d+)\s*,\s*(\d+)", RegexOptions.Compiled);

	[Fact(Skip = "Issue pending: audit 8.0+ items in NPC scripts")]
	public void Lua_shop_buyable_items_are_valid()
	{
		var bad = new List<string>();
		var npcDir = RepoPaths.NpcScriptsDir;

		foreach (var file in Directory.GetFiles(npcDir, "*.lua", SearchOption.TopDirectoryOnly))
		{
			var text = File.ReadAllText(file);
			foreach (Match match in AddBuyableRegex.Matches(text))
			{
				var itemId = int.Parse(match.Groups[1].Value);
				var cost = int.Parse(match.Groups[2].Value);
				
				if (!_catalog.Items.Exists(itemId))
					bad.Add($"{Path.GetFileName(file)}: item {itemId} missing from items.xml");
					
				if (cost <= 0)
					bad.Add($"{Path.GetFileName(file)}: item {itemId} has invalid cost {cost}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Invalid buyable items in lua scripts", bad));
	}

	[Fact(Skip = "Issue pending: audit 8.0+ items in NPC scripts")]
	public void Lua_shop_sellable_items_are_valid()
	{
		var bad = new List<string>();
		var npcDir = RepoPaths.NpcScriptsDir;

		foreach (var file in Directory.GetFiles(npcDir, "*.lua", SearchOption.TopDirectoryOnly))
		{
			var text = File.ReadAllText(file);
			foreach (Match match in AddSellableRegex.Matches(text))
			{
				var itemId = int.Parse(match.Groups[1].Value);
				var cost = int.Parse(match.Groups[2].Value);
				
				if (!_catalog.Items.Exists(itemId))
					bad.Add($"{Path.GetFileName(file)}: item {itemId} missing from items.xml");
					
				if (cost <= 0)
					bad.Add($"{Path.GetFileName(file)}: item {itemId} has invalid cost {cost}");
			}
		}

		Assert.True(bad.Count == 0, Failures.Format("Invalid sellable items in lua scripts", bad));
	}
}
