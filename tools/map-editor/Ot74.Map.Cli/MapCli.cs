using Ot74.Map.Core.Otbm;
using Ot74.Map.Source;

namespace Ot74.Map.Cli;

/// <summary>
/// Headless CLI for the map toolchain. Commands are parsed by hand so the tool stays a
/// single extra project with no extra packages.
/// </summary>
public static class MapCli
{
	public static int Run(string[] args)
	{
		if (args.Length == 0 || args[0] is "-h" or "--help")
		{
			PrintHelp();
			return args.Length == 0 ? 1 : 0;
		}

		try
		{
			return args[0] switch
			{
				"export" => Export(ParseOptions(args.AsSpan(1))),
				"decompile" => Decompile(ParseOptions(args.AsSpan(1))),
				"build" => Build(ParseOptions(args.AsSpan(1))),
				"validate" => Validate(ParseOptions(args.AsSpan(1))),
				"validate-quests" => ValidateQuests(ParseOptions(args.AsSpan(1))),
				"find-match" => FindMatch(ParseOptions(args.AsSpan(1))),
				"viewer-data" => ViewerDataCommand.Run(ParseOptions(args.AsSpan(1)), RepoRoot.Find()),
				"viewer-save" => ViewerSaveCommand.Run(ParseOptions(args.AsSpan(1)), RepoRoot.Find()),
				"new" => NewMap(ParseOptions(args.AsSpan(1))),
				"gen" => Generate(args.AsSpan(1)),
				"import" => Import(ParseOptions(args.AsSpan(1))),
				_ => Fail($"Unknown command '{args[0]}'.")
			};
		}
		catch (Exception ex)
		{
			Console.Error.WriteLine(ex.Message);
			return 1;
		}
	}

	static int Export(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var otbm = Resolve(repo, Option(options, "otbm", "maps/build/world.otbm"));
		var region = ParseTriple(Required(options, "region"));
		var size = ParsePair(Required(options, "size"));
		var output = Resolve(repo, Required(options, "out"));
		var name = Path.GetFileNameWithoutExtension(output);

		var document = RegionExtractor.Extract(otbm, name, new MapPos(region.X, region.Y, region.Z), size.W, size.H);
		Directory.CreateDirectory(Path.GetDirectoryName(output) ?? ".");
		File.WriteAllText(output, MapYaml.Serialize(document));
		Console.WriteLine($"Exported {document.Tiles.Count} tile(s) to {output}");
		return 0;
	}

	static int Decompile(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		// Import raro: OTBM externo via --otbm. NÃ£o hÃ¡ baseline versionado em maps/.
		var otbm = Resolve(repo, Option(options, "otbm", "maps/build/world.otbm"));
		var source = Resolve(repo, Option(options, "src", "maps/src"));
		var sectors = Path.Combine(source, "sectors");
		var meta = Path.Combine(source, "meta");
		if (!File.Exists(otbm))
		{
			return Fail($"OTBM not found: {otbm}. Pass --otbm path/to/external.otbm for a one-time import.");
		}

		Console.WriteLine($"Decompiling {otbm} â†’ {sectors}");
		var result = MapDecompiler.DecompileAll(otbm, sectors, meta);

		var manifestPath = Path.Combine(source, "world.map.yaml");
		var manifest = File.Exists(manifestPath)
			? MapYaml.DeserializeManifest(File.ReadAllText(manifestPath))
			: new WorldManifest();
		manifest.Sectors = "sectors";
		manifest.TownsFile = "meta/towns.yaml";
		manifest.WaypointsFile = "meta/waypoints.yaml";
		manifest.MapDataFile = "meta/mapdata.yaml";
		manifest.HeaderFile = "meta/header.yaml";
		// Fonte = sectors; sem baseline OTBM no Git.
		manifest.Baseline = null;

		File.WriteAllText(manifestPath, SerializeManifest(manifest));
		Console.WriteLine($"Decompiled {result.TileCount} tiles into {result.SectorCount} sectors; meta â†’ {meta}");
		return 0;
	}

	static string SerializeManifest(WorldManifest manifest)
	{
		var sb = new System.Text.StringBuilder();
		sb.AppendLine("kind: world");
		sb.AppendLine($"name: {manifest.Name}");
		if (!string.IsNullOrWhiteSpace(manifest.Baseline))
		{
			sb.AppendLine($"baseline: {manifest.Baseline}");
		}

		if (!string.IsNullOrWhiteSpace(manifest.Sectors))
		{
			sb.AppendLine($"sectors: {manifest.Sectors}");
		}

		sb.AppendLine("regions:");
		foreach (var r in manifest.Regions)
		{
			sb.AppendLine($"  - {r}");
		}

		sb.AppendLine("# Same order as inject_quests.lua so scan expansion sees earlier aids first.");
		sb.AppendLine("quests:");
		foreach (var q in manifest.Quests)
		{
			sb.AppendLine($"  - {q}");
		}

		if (!string.IsNullOrWhiteSpace(manifest.TownsFile))
		{
			sb.AppendLine($"townsFile: {manifest.TownsFile}");
		}

		if (!string.IsNullOrWhiteSpace(manifest.WaypointsFile))
		{
			sb.AppendLine($"waypointsFile: {manifest.WaypointsFile}");
		}

		if (!string.IsNullOrWhiteSpace(manifest.MapDataFile))
		{
			sb.AppendLine($"mapDataFile: {manifest.MapDataFile}");
		}

		if (!string.IsNullOrWhiteSpace(manifest.HeaderFile))
		{
			sb.AppendLine($"headerFile: {manifest.HeaderFile}");
		}

		return sb.ToString();
	}

	static int Build(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var source = Resolve(repo, Option(options, "src", "maps/src"));
		var outputDir = Resolve(repo, Option(options, "out", "maps/build"));
		var workspace = SourceWorkspace.Load(source);
		var items = TryItems(repo);
		var forceOverlay = options.ContainsKey("overlay");
		var forceSource = options.ContainsKey("from-source");

		var issues = SourceValidator.Validate(workspace.Regions, items);
		if (issues.Count > 0)
		{
			foreach (var issue in issues)
			{
				Console.Error.WriteLine(issue);
			}

			return 1;
		}

		var output = Path.Combine(outputDir, "world.otbm");
		var useSource = forceSource || (!forceOverlay && workspace.HasSectorShards);
		if (useSource)
		{
			if (!workspace.HasSectorShards)
			{
				return Fail("No sector shards under maps/src/sectors. Run: otmap decompile --all");
			}

			Console.WriteLine("Building from sector shards (no baseline)...");
			SourceCompiler.Build(workspace, output);
		}
		else
		{
			if (string.IsNullOrWhiteSpace(workspace.BaselinePath))
			{
				return Fail("No baseline and no sectors. Run otmap decompile --all or set baseline.");
			}

			Console.WriteLine($"Building overlay on baseline {workspace.BaselinePath}...");
			OverlayCompiler.Build(workspace, output);
		}

		CopySidecar(repo, outputDir, "world-spawn.xml");
		CopySidecar(repo, outputDir, "world-house.xml");
		Console.WriteLine($"Built {output}");
		return 0;
	}

	static int Validate(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var source = Resolve(repo, Option(options, "src", "maps/src"));
		var workspace = SourceWorkspace.Load(source);
		var issues = SourceValidator.Validate(workspace.Regions, TryItems(repo));
		if (issues.Count == 0)
		{
			Console.WriteLine($"OK: {workspace.Regions.Count} region(s), {workspace.Quests.Count} quest(s).");
			return 0;
		}

		foreach (var issue in issues)
		{
			Console.Error.WriteLine(issue);
		}

		return 1;
	}

	static int ValidateQuests(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var source = Resolve(repo, Option(options, "src", "maps/src"));
		var baked = Path.Combine(repo, "maps", "build", "world.otbm");
		var baseline = baked; // bake artifact only; no baseline world.otbm
		var otbm = options.TryGetValue("otbm", out var otbmOpt)
			? Resolve(repo, otbmOpt)
			: File.Exists(baked) && new FileInfo(baked).Length > 1024 ? baked : baseline;
		if (!File.Exists(otbm) || new FileInfo(otbm).Length < 1024)
		{
			return Fail($"OTBM not found or LFS pointer: {otbm}. Run otmap build --from-source.");
		}

		var systemLua = Resolve(repo, Option(options, "system-lua", "server/server/data/actions/scripts/quests/system.lua"));
		var itemsXml = Resolve(repo, Option(options, "items", "server/server/data/items/items.xml"));
		var spawn = Resolve(repo, Option(options, "spawn", "maps/world-spawn.xml"));
		var npcDir = Resolve(repo, Option(options, "npc", "server/server/data/npc"));
		var reportPath = Resolve(repo, Option(options, "report", "docs/MAP_QUEST_VALIDATION.md"));

		Console.WriteLine($"Auditing quests vs {otbm} â€¦");
		var report = QuestBakeAuditor.Run(otbm, source, systemLua, itemsXml, spawn, npcDir);
		var markdown = QuestBakeAuditor.RenderMarkdown(report);
		Directory.CreateDirectory(Path.GetDirectoryName(reportPath) ?? ".");
		File.WriteAllText(reportPath, markdown);

		var fails = report.Findings.Count(f => f.Severity == "FAIL");
		var warns = report.Findings.Count(f => f.Severity == "WARN");
		Console.WriteLine($"Wrote {reportPath}");
		Console.WriteLine($"FAIL={fails} WARN={warns} (quests={report.Quests.Count}, rewards={report.Rewards.Count})");
		return fails > 0 ? 1 : 0;
	}

	/// <summary>Lista contentores/levers/portas matchÃ¡veis num bounding box (debug de coords YAML).</summary>
	static int FindMatch(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var baked = Path.Combine(repo, "maps", "build", "world.otbm");
		var otbm = options.TryGetValue("otbm", out var o)
			? Resolve(repo, o)
			: File.Exists(baked) && new FileInfo(baked).Length > 1024
				? baked
				: throw new FileNotFoundException(
					"maps/build/world.otbm missing. Run: otmap build --from-source");
		var center = ParseTriple(Required(options, "center"));
		var radius = int.Parse(Option(options, "radius", "15"));
		var zFrom = options.TryGetValue("z-from", out var zf) ? int.Parse(zf) : center.Z;
		var zTo = options.TryGetValue("z-to", out var zt) ? int.Parse(zt) : center.Z;
		var ids = new HashSet<int>();
		if (options.TryGetValue("ids", out var idsText))
		{
			foreach (var part in idsText.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
			{
				ids.Add(int.Parse(part));
			}
		}
		else
		{
			foreach (var id in QuestPatcher.DefaultMatchIds)
			{
				ids.Add(id);
			}

			foreach (var extra in new[] { 1408, 1409, 2709, 2710, 2711, 2712, 2713, 2714, 2715, 2716, 2717, 2718, 2719 })
			{
				ids.Add(extra);
			}
		}

		var hits = new List<(int X, int Y, int Z, int Id, int Aid, int Uid)>();
		using var reader = OtbmReader.Open(otbm);
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
			var p = tile.Position;
			if (p.Z < zFrom || p.Z > zTo)
			{
				continue;
			}

			if (Math.Abs(p.X - center.X) > radius || Math.Abs(p.Y - center.Y) > radius)
			{
				continue;
			}

			foreach (var item in tile.Items)
			{
				if (!ids.Contains(item.Id))
				{
					continue;
				}

				hits.Add((p.X, p.Y, p.Z, item.Id, item.ActionId ?? 0, item.UniqueId ?? 0));
			}
		}

		hits = hits
			.OrderBy(h => h.Aid == 0 && h.Uid == 0 ? 0 : 1)
			.ThenBy(h => Math.Abs(h.X - center.X) + Math.Abs(h.Y - center.Y))
			.ThenBy(h => h.Z)
			.ToList();

		Console.WriteLine($"find-match center={center.X},{center.Y},{center.Z} r={radius} z={zFrom}..{zTo} hits={hits.Count}");
		foreach (var h in hits.Take(40))
		{
			Console.WriteLine($"  {h.X},{h.Y},{h.Z} id={h.Id} aid={h.Aid} uid={h.Uid}");
		}

		if (hits.Count > 40)
		{
			Console.WriteLine($"  â€¦ +{hits.Count - 40} more");
		}

		return 0;
	}

	static int NewMap(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var size = ParsePair(Option(options, "size", "256,256"));
		var output = Resolve(repo, Option(options, "out", "maps/build/empty.otbm"));
		Directory.CreateDirectory(Path.GetDirectoryName(output) ?? ".");
		File.WriteAllBytes(output, MapGenerators.EmptyOtbm((ushort)size.W, (ushort)size.H));
		Console.WriteLine($"Wrote empty OTBM {output}");
		return 0;
	}

	static int Generate(ReadOnlySpan<string> args)
	{
		if (args.Length == 0)
		{
			return Fail("gen needs a kind: city, hunt, or prefab.");
		}

		var kind = args[0];
		var options = ParseOptions(args[1..]);
		var repo = RepoRoot.Find();
		var output = Resolve(repo, Required(options, "out"));
		Directory.CreateDirectory(Path.GetDirectoryName(output) ?? ".");
		var name = Path.GetFileNameWithoutExtension(output);
		var seed = options.TryGetValue("seed", out var seedText) ? int.Parse(seedText) : 1;
		RegionDocument region = kind switch
		{
			"city" => MapGenerators.City(name, seed),
			"hunt" => MapGenerators.Hunt(name, seed),
			"prefab" => InstantiatePrefab(repo, options, name),
			_ => throw new InvalidDataException($"Unknown gen kind '{kind}'.")
		};

		var items = TryItems(repo);
		var issues = SourceValidator.Validate([region], items);
		if (issues.Count > 0)
		{
			foreach (var issue in issues)
			{
				Console.Error.WriteLine(issue);
			}

			return 1;
		}

		File.WriteAllText(output, MapYaml.Serialize(region));
		Console.WriteLine($"Wrote {region.Tiles.Count} tile(s) to {output}");
		return 0;
	}

	static RegionDocument InstantiatePrefab(string repo, Dictionary<string, string> options, string name)
	{
		var from = Resolve(repo, Required(options, "from"));
		var at = ParseTriple(Required(options, "at"));
		var prefab = MapYaml.DeserializeRegion(File.ReadAllText(from));
		if (string.IsNullOrWhiteSpace(prefab.Name))
		{
			prefab.Name = name;
		}

		return MapGenerators.InstantiatePrefab(prefab, new MapPos(at.X, at.Y, at.Z));
	}

	static int Import(Dictionary<string, string> options)
	{
		var repo = RepoRoot.Find();
		var otbm = Resolve(repo, Required(options, "otbm"));
		var region = ParseTriple(Required(options, "region"));
		var size = ParsePair(Required(options, "size"));
		var output = Resolve(repo, Required(options, "out"));
		var name = Path.GetFileNameWithoutExtension(output);
		var requireMapped = !options.TryGetValue("allow-unmapped", out _);
		var items = TryItems(repo);
		var (document, report) = MapImporter.Import(
			otbm,
			new MapPos(region.X, region.Y, region.Z),
			size.W,
			size.H,
			name,
			items,
			requireMapped);
		Directory.CreateDirectory(Path.GetDirectoryName(output) ?? ".");
		File.WriteAllText(output, MapYaml.Serialize(document));
		var reportPath = Path.ChangeExtension(output, ".report.yaml");
		File.WriteAllText(reportPath, $"""
			mappedExact: {report.MappedExact}
			unmapped: {report.Unmapped}
			fidelity: {report.Fidelity}
			unmappedIds: [{string.Join(", ", report.UnmappedIds)}]
			""");
		Console.WriteLine($"Imported {document.Tiles.Count} tile(s) to {output}");
		return 0;
	}

	static void CopySidecar(string repo, string outputDir, string name)
	{
		var source = Path.Combine(repo, "maps", name);
		if (!File.Exists(source))
		{
			return;
		}

		Directory.CreateDirectory(outputDir);
		File.Copy(source, Path.Combine(outputDir, name), overwrite: true);
	}

	static ItemsXmlIndex? TryItems(string repo)
	{
		var path = Path.Combine(repo, "server", "server", "data", "items", "items.xml");
		return File.Exists(path) ? ItemsXmlIndex.Load(path) : null;
	}

	static Dictionary<string, string> ParseOptions(ReadOnlySpan<string> args)
	{
		var options = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
		for (var i = 0; i < args.Length; i++)
		{
			var key = args[i];
			if (!key.StartsWith("--", StringComparison.Ordinal))
			{
				throw new InvalidDataException($"Unexpected argument '{key}'.");
			}

			if (key is "--allow-unmapped" or "--all" or "--from-source" or "--overlay")
			{
				options[key[2..]] = "1";
				continue;
			}

			if (i + 1 >= args.Length)
			{
				throw new InvalidDataException($"Option '{key}' is missing a value.");
			}

			options[key[2..]] = args[++i];
		}

		return options;
	}

	static string Required(Dictionary<string, string> options, string name) =>
		options.TryGetValue(name, out var value)
			? value
			: throw new InvalidDataException($"Missing --{name}.");

	static string Option(Dictionary<string, string> options, string name, string fallback) =>
		options.TryGetValue(name, out var value) ? value : fallback;

	static string Resolve(string repo, string path) =>
		Path.IsPathRooted(path) ? path : Path.GetFullPath(Path.Combine(repo, path.Replace('/', Path.DirectorySeparatorChar)));

	static (int X, int Y, int Z) ParseTriple(string text)
	{
		var parts = text.Split(',', StringSplitOptions.TrimEntries);
		if (parts.Length != 3)
		{
			throw new InvalidDataException($"Expected x,y,z but got '{text}'.");
		}

		return (int.Parse(parts[0]), int.Parse(parts[1]), int.Parse(parts[2]));
	}

	static (int W, int H) ParsePair(string text)
	{
		var parts = text.Split(',', StringSplitOptions.TrimEntries);
		if (parts.Length != 2)
		{
			throw new InvalidDataException($"Expected w,h but got '{text}'.");
		}

		return (int.Parse(parts[0]), int.Parse(parts[1]));
	}

	static int Fail(string message)
	{
		Console.Error.WriteLine(message);
		PrintHelp();
		return 1;
	}

	static void PrintHelp()
	{
		Console.WriteLine("""
			otmap â€” OT 7.4 map toolchain

			  otmap export --region x,y,z --size w,h --out maps/src/regions/name.yaml [--otbm maps/build/world.otbm]
			  otmap decompile [--otbm maps/build/world.otbm] [--src maps/src]
			  otmap build [--src maps/src] [--out maps/build] [--from-source|--overlay]
			  otmap validate [--src maps/src]
			  otmap validate-quests [--otbm maps/build/world.otbm] [--src maps/src] [--report docs/MAP_QUEST_VALIDATION.md]
			  otmap find-match --center x,y,z [--radius 15] [--z-from 7] [--z-to 15] [--otbm maps/build/world.otbm]
			  otmap viewer-data --all [--out maps/build/viewer]
			  otmap viewer-data [--region x,y,z] [--size w,h] [--out maps/build/viewer]
			      (--all = every TILE_AREA / all floors as sectors; launch-map-viewer.ps1 uses this)
			  otmap viewer-save --in payload.json [--viewer maps/build/viewer] [--sectors maps/src/sectors] [--spawn maps/world-spawn.xml]
			  otmap new [--size w,h] [--out maps/build/empty.otbm]
			  otmap gen city --out maps/src/regions/name.yaml [--seed 1]
			  otmap gen hunt --out maps/src/regions/name.yaml [--seed 1]
			  otmap gen prefab --from maps/src/prefabs/x.yaml --at x,y,z --out maps/src/regions/name.yaml
			  otmap import --otbm path --region x,y,z --size w,h --out maps/src/imports/name.yaml [--allow-unmapped]
			""");
	}
}

static class RepoRoot
{
	public static string Find()
	{
		var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
		while (dir is not null)
		{
			var compose = File.Exists(Path.Combine(dir.FullName, "docker-compose.yml"))
				|| File.Exists(Path.Combine(dir.FullName, "compose.yml"));
			if (compose && Directory.Exists(Path.Combine(dir.FullName, "maps")))
			{
				return dir.FullName;
			}

			dir = dir.Parent;
		}

		throw new DirectoryNotFoundException(
			"Run otmap from the OpenTibia-740 workspace root (docker-compose.yml + maps/).");
	}
}

