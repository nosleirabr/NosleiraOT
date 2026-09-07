using Ot74.Map.Core.Otbm;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Ot74.Map.Source;

/// <summary>YAML document describing one map region.</summary>
public sealed class RegionDocument
{
	public string Kind { get; set; } = "region";
	public string Name { get; set; } = "";
	public int[] Origin { get; set; } = [0, 0, 7];
	public int[] Size { get; set; } = [1, 1];
	public string Fidelity { get; set; } = "canonical-74";
	public List<TileDocument> Tiles { get; set; } = new();

	public MapPos OriginPos => new(Origin[0], Origin[1], Origin.Length > 2 ? Origin[2] : 7);
	public int Width => Size[0];
	public int Height => Size.Length > 1 ? Size[1] : Size[0];
}

public sealed class TileDocument
{
	public int[] At { get; set; } = [0, 0, 7];
	public string? Flags { get; set; }
	public uint? House { get; set; }
	public List<ItemDocument> Items { get; set; } = new();

	public MapPos Position => new(At[0], At[1], At.Length > 2 ? At[2] : 7);
}

public sealed class ItemDocument
{
	public int Id { get; set; }
	public int? Aid { get; set; }
	public int? Uid { get; set; }
	public int? Count { get; set; }
	public int? Charges { get; set; }
	public int? Depot { get; set; }
	public int? Door { get; set; }
	public string? Text { get; set; }
	public int[]? Dest { get; set; }
	public List<ItemDocument> Contents { get; set; } = new();
	public List<UnknownAttributeDocument> Unknown { get; set; } = new();
}

public sealed class UnknownAttributeDocument
{
	public byte Type { get; set; }
	public string Hex { get; set; } = "";
}

public sealed class WorldManifest
{
	public string Kind { get; set; } = "world";
	public string Name { get; set; } = "otserver76";
	/// <summary>Optional LFS baseline — used by hybrid overlay build and as decompile input.</summary>
	public string? Baseline { get; set; } = "maps/world.otbm";
	/// <summary>When present, <see cref="SourceCompiler"/> builds without opening the baseline.</summary>
	public string? Sectors { get; set; }
	public List<string> Regions { get; set; } = ["regions/*.yaml"];
	public List<string> Quests { get; set; } = ["quests/*.yaml"];
	public string? TownsFile { get; set; } = "meta/towns.yaml";
	public string? WaypointsFile { get; set; } = "meta/waypoints.yaml";
	public string? MapDataFile { get; set; } = "meta/mapdata.yaml";
	public string? HeaderFile { get; set; } = "meta/header.yaml";
}

public sealed class TownDocument
{
	public uint Id { get; set; }
	public string Name { get; set; } = "";
	public int[] Temple { get; set; } = [0, 0, 7];
}

public sealed class WaypointDocument
{
	public string Name { get; set; } = "";
	public int[] At { get; set; } = [0, 0, 7];
}

public sealed class MapDataAttributes
{
	public string? Description { get; set; }
	public string? SpawnFile { get; set; }
	public string? HouseFile { get; set; }
}

public sealed class WorldHeaderDocument
{
	public uint Version { get; set; } = 1;
	public ushort Width { get; set; } = 65000;
	public ushort Height { get; set; } = 65000;
	public uint MajorVersionItems { get; set; } = 3;
	public uint MinorVersionItems { get; set; } = OtbmRootHeader.ClientVersion740;
}

public sealed class SectorIndexDocument
{
	public int SectorSize { get; set; } = TileAreaBase.BlockSize;
	public int[] Bounds { get; set; } = [];
	public List<string> Sectors { get; set; } = [];
}

public static class MapYaml
{
	static readonly ISerializer Serializer = new SerializerBuilder()
		.WithNamingConvention(CamelCaseNamingConvention.Instance)
		.ConfigureDefaultValuesHandling(DefaultValuesHandling.OmitNull | DefaultValuesHandling.OmitEmptyCollections)
		.Build();

	static readonly IDeserializer Deserializer = new DeserializerBuilder()
		.WithNamingConvention(CamelCaseNamingConvention.Instance)
		.IgnoreUnmatchedProperties()
		.Build();

	public static string Serialize(RegionDocument region) => Serializer.Serialize(region);

	public static RegionDocument DeserializeRegion(string yaml) => Deserializer.Deserialize<RegionDocument>(yaml);

	public static WorldManifest DeserializeManifest(string yaml) => Deserializer.Deserialize<WorldManifest>(yaml);

	public static string SerializeTowns(IReadOnlyList<TownDocument> towns) =>
		Serializer.Serialize(new { kind = "towns", towns });

	public static string SerializeWaypoints(IReadOnlyList<WaypointDocument> waypoints) =>
		Serializer.Serialize(new { kind = "waypoints", waypoints });

	public static string SerializeMapData(MapDataAttributes attrs) => Serializer.Serialize(attrs);

	public static string SerializeHeader(WorldHeaderDocument header) => Serializer.Serialize(header);

	public static string SerializeSectorIndex(SectorIndexDocument index) => Serializer.Serialize(index);

	public static List<TownDocument> DeserializeTowns(string yaml)
	{
		var bag = Deserializer.Deserialize<TownsBag>(yaml);
		return bag.Towns ?? [];
	}

	public static List<WaypointDocument> DeserializeWaypoints(string yaml)
	{
		var bag = Deserializer.Deserialize<WaypointsBag>(yaml);
		return bag.Waypoints ?? [];
	}

	public static MapDataAttributes DeserializeMapData(string yaml) =>
		Deserializer.Deserialize<MapDataAttributes>(yaml) ?? new MapDataAttributes();

	public static WorldHeaderDocument DeserializeHeader(string yaml) =>
		Deserializer.Deserialize<WorldHeaderDocument>(yaml) ?? new WorldHeaderDocument();

	public static SectorIndexDocument DeserializeSectorIndex(string yaml) =>
		Deserializer.Deserialize<SectorIndexDocument>(yaml) ?? new SectorIndexDocument();

	sealed class TownsBag
	{
		public List<TownDocument>? Towns { get; set; }
	}

	sealed class WaypointsBag
	{
		public List<WaypointDocument>? Waypoints { get; set; }
	}
}
