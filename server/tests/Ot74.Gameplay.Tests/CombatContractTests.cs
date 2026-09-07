using System.IO;
using System.Xml.Linq;
using Xunit;

namespace Ot74.Gameplay.Tests;

public sealed class CombatContractTests
{
	[Fact]
	public void Vocations_do_not_contain_soul_points_for_74_authenticity()
	{
		var doc = XDocument.Load(RepoPaths.VocationsXml);
		var vocations = doc.Descendants("vocation");
		
		foreach (var voc in vocations)
		{
			Assert.Null(voc.Attribute("soulmax"));
			Assert.Null(voc.Attribute("gainsoulticks"));
		}
	}

	[Fact]
	public void Vocation_attack_speed_is_strictly_classic()
	{
		var doc = XDocument.Load(RepoPaths.VocationsXml);
		var vocations = doc.Descendants("vocation");
		
		foreach (var voc in vocations)
		{
			Assert.Equal("2000", voc.Attribute("attackspeed")?.Value);
		}
	}

	[Fact]
	public void Spells_global_exhaust_and_groups_are_correct()
	{
		var doc = XDocument.Load(RepoPaths.SpellsXml);
		var spells = doc.Root?.Elements() ?? Enumerable.Empty<XElement>();
		
		foreach (var spell in spells)
		{
			if (spell.Name == "rune" || spell.Name == "instant")
			{
				// Classic exhaust is exactly 2 seconds globally
				Assert.Equal("2000", spell.Attribute("exhaustion")?.Value);
				Assert.Equal("2000", spell.Attribute("groupcooldown")?.Value);

				// Attack and Healing groups must be separated
				var script = spell.Attribute("script")?.Value ?? "";
				if (script.StartsWith("attack/"))
				{
					Assert.Equal("attack", spell.Attribute("group")?.Value);
				}
				else if (script.StartsWith("healing/"))
				{
					Assert.Equal("healing", spell.Attribute("group")?.Value);
				}
			}
		}
	}

	[Fact]
	public void Rune_formulas_use_classic_math_and_armor_mitigation()
	{
		var sdScript = File.ReadAllText(Path.Combine(RepoPaths.Data, "spells", "scripts", "attack", "sudden death.lua"));
		// Classic SD relies on standard (lvl*2 + ml*3) and mitigates by armor as physical damage
		Assert.Contains("(level * 2) + (maglevel * 3)", sdScript, StringComparison.Ordinal);
		Assert.Contains("COMBAT_PARAM_BLOCKARMOR, true", sdScript, StringComparison.Ordinal);

		var uhScript = File.ReadAllText(Path.Combine(RepoPaths.Data, "spells", "scripts", "healing", "ultimate healing rune.lua"));
		// Classic UH heal
		Assert.Contains("(level * 2) + (maglevel * 3)", uhScript, StringComparison.Ordinal);
	}
}
