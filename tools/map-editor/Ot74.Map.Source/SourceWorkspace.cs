namespace Ot74.Map.Source;

/// <summary>Loads <c>maps/src</c>: the world manifest plus regions, quests, and optional sector shards.</summary>
public sealed class SourceWorkspace
{
	public required string Root { get; init; }
	public required WorldManifest Manifest { get; init; }
	public required List<RegionDocument> Regions { get; init; }
	public required List<QuestDocument> Quests { get; init; }
	public string? BaselinePath { get; init; }
	public string? SectorsPath { get; init; }
	public List<TownDocument> Towns { get; init; } = [];
	public List<WaypointDocument> Waypoints { get; init; } = [];
	public MapDataAttributes MapData { get; init; } = new();
	public WorldHeaderDocument? Header { get; init; }

	public bool HasSectorShards =>
		SectorsPath is not null
		&& Directory.Exists(SectorsPath)
		&& Directory.EnumerateDirectories(SectorsPath).Any();

	public static SourceWorkspace Load(string sourceRoot)
	{
		var manifestPath = Path.Combine(sourceRoot, "world.map.yaml");
		if (!File.Exists(manifestPath))
		{
			throw new FileNotFoundException($"Missing manifest '{manifestPath}'.", manifestPath);
		}

		var manifest = MapYaml.DeserializeManifest(File.ReadAllText(manifestPath));
		var regions = new List<RegionDocument>();
		foreach (var pattern in manifest.Regions)
		{
			foreach (var path in Expand(sourceRoot, pattern))
			{
				var region = MapYaml.DeserializeRegion(File.ReadAllText(path));
				if (string.IsNullOrWhiteSpace(region.Name))
				{
					region.Name = Path.GetFileNameWithoutExtension(path);
				}

				regions.Add(region);
			}
		}

		var quests = new List<QuestDocument>();
		foreach (var pattern in manifest.Quests)
		{
			foreach (var path in Expand(sourceRoot, pattern))
			{
				var quest = QuestYaml.Deserialize(File.ReadAllText(path));
				if (string.IsNullOrWhiteSpace(quest.Name))
				{
					quest.Name = Path.GetFileNameWithoutExtension(path);
				}

				quests.Add(quest);
			}
		}

		string? baseline = null;
		if (!string.IsNullOrWhiteSpace(manifest.Baseline))
		{
			baseline = Path.IsPathRooted(manifest.Baseline)
				? manifest.Baseline
				: Path.GetFullPath(Path.Combine(sourceRoot, "..", "..", manifest.Baseline.Replace('/', Path.DirectorySeparatorChar)));

			if (!File.Exists(baseline))
			{
				baseline = Path.GetFullPath(Path.Combine(sourceRoot, "..", Path.GetFileName(manifest.Baseline)));
			}

			if (!File.Exists(baseline))
			{
				baseline = null;
			}
		}

		var sectorsRel = string.IsNullOrWhiteSpace(manifest.Sectors) ? "sectors" : manifest.Sectors.TrimEnd('/', '\\');
		var sectorsPath = Path.Combine(sourceRoot, sectorsRel.Replace('/', Path.DirectorySeparatorChar));
		if (!Directory.Exists(sectorsPath))
		{
			sectorsPath = null;
		}

		var towns = LoadOptional(sourceRoot, manifest.TownsFile, MapYaml.DeserializeTowns) ?? [];
		var waypoints = LoadOptional(sourceRoot, manifest.WaypointsFile, MapYaml.DeserializeWaypoints) ?? [];
		var mapData = LoadOptional(sourceRoot, manifest.MapDataFile, MapYaml.DeserializeMapData) ?? new MapDataAttributes();
		var header = LoadOptional(sourceRoot, manifest.HeaderFile, MapYaml.DeserializeHeader);

		return new SourceWorkspace
		{
			Root = sourceRoot,
			Manifest = manifest,
			Regions = regions,
			Quests = quests,
			BaselinePath = baseline,
			SectorsPath = sectorsPath,
			Towns = towns,
			Waypoints = waypoints,
			MapData = mapData,
			Header = header
		};
	}

	static T? LoadOptional<T>(string root, string? relative, Func<string, T> parse)
		where T : class
	{
		if (string.IsNullOrWhiteSpace(relative))
		{
			return null;
		}

		var path = Path.Combine(root, relative.Replace('/', Path.DirectorySeparatorChar));
		return File.Exists(path) ? parse(File.ReadAllText(path)) : null;
	}

	static IEnumerable<string> Expand(string root, string pattern)
	{
		var normalised = pattern.Replace('/', Path.DirectorySeparatorChar);
		var searchRoot = Path.GetDirectoryName(Path.Combine(root, normalised)) ?? root;
		var filePattern = Path.GetFileName(normalised);
		if (!Directory.Exists(searchRoot))
		{
			return [];
		}

		return Directory.GetFiles(searchRoot, filePattern).OrderBy(path => path, StringComparer.OrdinalIgnoreCase);
	}
}
