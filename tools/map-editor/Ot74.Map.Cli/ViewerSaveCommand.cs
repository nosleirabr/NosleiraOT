using Ot74.Map.Source;

namespace Ot74.Map.Cli;

/// <summary>Persiste o payload JSON do viewer-editor nos chunks JSON e nos YAML de setor.</summary>
public static class ViewerSaveCommand
{
	public static int Run(Dictionary<string, string> options, string repo)
	{
		var payloadPath = Resolve(repo, Required(options, "in"));
		if (!File.Exists(payloadPath))
		{
			Console.Error.WriteLine($"Payload not found: {payloadPath}");
			return 1;
		}

		var viewerDir = Resolve(repo, Option(options, "viewer", ViewerEditStore.DefaultViewerRel));
		var sectorsRel = Option(options, "sectors", ViewerEditStore.DefaultSectorsRel);
		var sectorsDir = string.Equals(sectorsRel, "none", StringComparison.OrdinalIgnoreCase)
			? null
			: Resolve(repo, sectorsRel);
		var spawnRel = Option(options, "spawn", ViewerEditStore.DefaultSpawnRel);
		var spawnPath = string.Equals(spawnRel, "none", StringComparison.OrdinalIgnoreCase)
			? null
			: Resolve(repo, spawnRel);

		var json = File.ReadAllText(payloadPath);
		var result = ViewerEditStore.Save(json, viewerDir, sectorsDir, spawnPath);
		if (result.ViewerPath is not null)
		{
			Console.WriteLine($"Saved {result.TileCount} tile(s) → {result.ViewerPath} (JSON chunks)");
		}

		if (result.SectorsPath is not null)
		{
			Console.WriteLine($"Patched sector YAML → {result.SectorsPath}");
		}

		if (result.SpawnCount > 0 && result.SpawnPath is not null)
		{
			Console.WriteLine($"Patched {result.SpawnCount} spawn node(s) → {result.SpawnPath}");
		}

		return 0;
	}

	static string Required(Dictionary<string, string> options, string name) =>
		options.TryGetValue(name, out var value) && !string.IsNullOrWhiteSpace(value)
			? value
			: throw new InvalidDataException($"Missing --{name}");

	static string Option(Dictionary<string, string> options, string name, string fallback) =>
		options.TryGetValue(name, out var value) && !string.IsNullOrWhiteSpace(value) ? value : fallback;

	static string Resolve(string repo, string path) =>
		Path.IsPathRooted(path) ? path : Path.GetFullPath(Path.Combine(repo, path.Replace('/', Path.DirectorySeparatorChar)));
}
