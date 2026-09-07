namespace Ot74.Gameplay.Tests;

internal static class RepoPaths
{
	public static string Root { get; } = FindRoot();

	public static string Maps => Path.Combine(Root, "maps");
	public static string Data => Path.Combine(Root, "server", "server", "data");
	public static string Otbm => Path.Combine(Maps, "world.otbm");
	public static string BakedOtbm => Path.Combine(Maps, "build", "world.otbm");

	public static string PreferBakedOtbm() =>
		File.Exists(BakedOtbm) && new FileInfo(BakedOtbm).Length > 1024 ? BakedOtbm : RequireOtbm();

	public static string RequireOtbm()
	{
		var path = File.Exists(BakedOtbm) && new FileInfo(BakedOtbm).Length > 1024 ? BakedOtbm : Otbm;
		if (!File.Exists(path))
		{
			throw new FileNotFoundException($"'{path}' is missing. Run: git lfs pull", path);
		}

		var length = new FileInfo(path).Length;
		if (length < 1024)
		{
			throw new InvalidDataException(
				$"'{path}' is only {length} bytes, which looks like a Git LFS pointer. Run: git lfs pull");
		}

		return path;
	}

	public static string SpawnXml => Path.Combine(Maps, "world-spawn.xml");
	public static string HouseXml => Path.Combine(Maps, "world-house.xml");
	public static string ItemsXml => Path.Combine(Data, "items", "items.xml");
	public static string OutfitsXml => Path.Combine(Data, "XML", "outfits.xml");
	public static string VocationsXml => Path.Combine(Data, "XML", "vocations.xml");
	public static string SpellsXml => Path.Combine(Data, "spells", "spells.xml");
	public static string GlobalLua => Path.Combine(Data, "global.lua");
	public static string TravelLua => Path.Combine(Data, "npc", "lib", "travel.lua");
	public static string TeleportLua => Path.Combine(Data, "actions", "scripts", "other", "teleport.lua");
	public static string ActionsXml => Path.Combine(Data, "actions", "actions.xml");
	public static string QuestsXml => Path.Combine(Data, "XML", "quests.xml");
	public static string ActionScriptsDir => Path.Combine(Data, "actions", "scripts");
	public static string NpcDir => Path.Combine(Data, "npc");
	public static string NpcScriptsDir => Path.Combine(Data, "npc", "scripts");
	public static string MonsterDir => Path.Combine(Data, "monster");

	static string FindRoot()
	{
		var envRoot = Environment.GetEnvironmentVariable("OT740_WORKSPACE_ROOT");
		if (!string.IsNullOrWhiteSpace(envRoot))
		{
			var normalized = Path.GetFullPath(envRoot);
			if (File.Exists(Path.Combine(normalized, "docker-compose.yml")))
			{
				return normalized;
			}
		}

		var dir = new DirectoryInfo(AppContext.BaseDirectory);
		while (dir is not null)
		{
			var compose = Path.Combine(dir.FullName, "docker-compose.yml");
			if (File.Exists(compose) && Directory.Exists(Path.Combine(dir.FullName, "server")))
			{
				return dir.FullName;
			}

			dir = dir.Parent;
		}

		throw new DirectoryNotFoundException("Could not find workspace root (docker-compose.yml).");
	}
}
