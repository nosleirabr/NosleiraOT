using Ot74.Map.Core.Otbm;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Ot74.Map.Source;

/// <summary>YAML document that patches aid/uid/contents onto items that already exist in the baseline.</summary>
public sealed class QuestDocument
{
	public string Kind { get; set; } = "quest";
	public string Name { get; set; } = "";
	public List<QuestPatch> Patches { get; set; } = new();

	/// <summary>
	/// Raster scans from the Lua injectors. The compiler expands them to patches using the same
	/// order as Lua: x from west to east, then y from north to south, skipping items that already
	/// have an actionId.
	/// </summary>
	public List<QuestScan> Scans { get; set; } = new();

	/// <summary>Apply the same actionId to every matching item in a bounding box (doors, etc.).</summary>
	public List<QuestAidBox> Boxes { get; set; } = new();
}

public sealed class QuestScan
{
	public int[] Center { get; set; } = [0, 0, 7];
	public int Radius { get; set; }
	public List<int> Uids { get; set; } = new();
	public int Aid { get; set; } = 2000;
	public List<int> Match { get; set; } = new();

	public MapPos CenterPos => new(Center[0], Center[1], Center.Length > 2 ? Center[2] : 7);

	public bool Contains(MapPos pos)
	{
		var c = CenterPos;
		return pos.Z == c.Z
			&& Math.Abs(pos.X - c.X) <= Radius
			&& Math.Abs(pos.Y - c.Y) <= Radius;
	}
}

public sealed class QuestAidBox
{
	public int[] From { get; set; } = [0, 0, 7];
	public int[] To { get; set; } = [0, 0, 7];
	public int Aid { get; set; }
	public string Kind { get; set; } = "door";

	public MapPos FromPos => new(From[0], From[1], From.Length > 2 ? From[2] : 7);
	public MapPos ToPos => new(To[0], To[1], To.Length > 2 ? To[2] : 7);

	public bool Contains(MapPos pos) =>
		pos.X >= FromPos.X && pos.X <= ToPos.X
		&& pos.Y >= FromPos.Y && pos.Y <= ToPos.Y
		&& pos.Z >= FromPos.Z && pos.Z <= ToPos.Z;
}

/// <summary>
/// One item patch. Unlike a region tile, this never replaces the stack: it finds a matching item
/// and writes attributes onto it.
/// </summary>
public sealed class QuestPatch
{
	public int[] At { get; set; } = [0, 0, 7];
	public int? Aid { get; set; }
	public int? Uid { get; set; }
	public int? Id { get; set; }
	public int? Transform { get; set; }
	public List<int> Match { get; set; } = new();
	public List<ItemDocument> Contents { get; set; } = new();

	public MapPos Position => new(At[0], At[1], At.Length > 2 ? At[2] : 7);
}

public static class QuestYaml
{
	static readonly ISerializer Serializer = new SerializerBuilder()
		.WithNamingConvention(CamelCaseNamingConvention.Instance)
		.ConfigureDefaultValuesHandling(DefaultValuesHandling.OmitNull | DefaultValuesHandling.OmitEmptyCollections)
		.Build();

	static readonly IDeserializer Deserializer = new DeserializerBuilder()
		.WithNamingConvention(CamelCaseNamingConvention.Instance)
		.IgnoreUnmatchedProperties()
		.Build();

	public static string Serialize(QuestDocument quest) => Serializer.Serialize(quest);

	public static QuestDocument Deserialize(string yaml) => Deserializer.Deserialize<QuestDocument>(yaml);
}
