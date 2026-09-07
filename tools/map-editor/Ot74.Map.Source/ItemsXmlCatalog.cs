using System.Globalization;
using System.Text.Json;
using System.Xml;

namespace Ot74.Map.Source;

/// <summary>
/// Catálogo de <c>items.xml</c> para o viewer-editor: nomes, atributos e enums conhecidos.
/// </summary>
public sealed class ItemsXmlCatalog
{
	static readonly JsonSerializerOptions JsonOpts = new()
	{
		WriteIndented = false,
		DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
	};

	/// <summary>Chaves cujo valor no XML é um enumerador (dropdown no editor).</summary>
	public static readonly IReadOnlyDictionary<string, IReadOnlyList<string>> KnownEnums =
		new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase)
		{
			["type"] =
			[
				"none", "container", "depot", "mailbox", "trashholder", "door", "teleport",
				"magicfield", "bed", "key", "rune"
			],
			["floorchange"] =
			[
				"none", "down", "north", "south", "east", "west",
				"northex", "southex", "eastex", "westex", "southalt", "eastalt"
			],
			["weaponType"] = ["sword", "club", "axe", "distance", "wand", "ammunition", "shield", "fist"],
			["slotType"] = ["head", "necklace", "backpack", "body", "legs", "feet", "ring", "ammo", "two-handed"],
			["ammoType"] = ["arrow", "bolt", "thrown"],
			["shootType"] =
			[
				"spear", "bolt", "arrow", "fire", "energy", "poisonarrow", "burstarrow", "throwingstar",
				"throwingknife", "smallstone", "death", "largerock", "snowball", "powerbolt", "poison",
				"infernalbolt", "huntingspear", "enchantedspear", "redstar", "greenstar", "royalspear",
				"sniperarrow", "onyxarrow", "piercingbolt", "whirlwindclub", "whirlwindaxe", "whirlwindsword",
				"eartharrow", "poisonedarrow", "flasharrow", "flammingarrow", "shiverarrow", "redspark",
				"yellowspark"
			],
			["fluidSource"] =
			[
				"none", "water", "blood", "beer", "slime", "lemonade", "milk", "mana", "life",
				"oil", "urine", "wine", "mud", "fruitjuice", "lava", "rum"
			],
			["corpseType"] = ["none", "blood", "undead", "venom", "fire"]
		};

	public static readonly IReadOnlyList<string> PaletteGroups =
	[
		"ground", "walls", "doors", "containers", "teleports", "fields", "fluids", "holes", "other"
	];

	public static readonly IReadOnlyList<string> BooleanKeys =
	[
		"blocking", "blockprojectile", "blockpathfind", "pickupable", "moveable", "stackable",
		"rotatable", "readable", "writeable", "allowdistread", "forceuse", "multiuse",
		"hasheight", "walkstack", "vertical", "horizontal"
	];

	readonly List<CatalogItem> _items;
	readonly Dictionary<string, SortedSet<string>> _enumValues;

	ItemsXmlCatalog(List<CatalogItem> items, Dictionary<string, SortedSet<string>> enumValues)
	{
		_items = items;
		_enumValues = enumValues;
	}

	public IReadOnlyList<CatalogItem> Items => _items;

	public static ItemsXmlCatalog Load(string itemsXmlPath)
	{
		var items = new List<CatalogItem>();
		var enumValues = KnownEnums.ToDictionary(
			pair => pair.Key,
			pair => new SortedSet<string>(pair.Value, StringComparer.OrdinalIgnoreCase),
			StringComparer.OrdinalIgnoreCase);

		var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore, IgnoreComments = true };
		using var reader = XmlReader.Create(itemsXmlPath, settings);
		while (reader.Read())
		{
			if (reader.NodeType != XmlNodeType.Element || reader.Name != "item")
			{
				continue;
			}

			var idAttr = reader.GetAttribute("id");
			var fromAttr = reader.GetAttribute("fromid") ?? reader.GetAttribute("fromId");
			var toAttr = reader.GetAttribute("toid") ?? reader.GetAttribute("toId");
			var name = reader.GetAttribute("name") ?? "";
			var article = reader.GetAttribute("article");
			var attrs = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

			if (!reader.IsEmptyElement)
			{
				var subtree = reader.ReadSubtree();
				while (subtree.Read())
				{
					if (subtree.NodeType != XmlNodeType.Element || subtree.Name != "attribute")
					{
						continue;
					}

					var key = subtree.GetAttribute("key") ?? "";
					var value = subtree.GetAttribute("value") ?? "";
					if (key.Length == 0)
					{
						continue;
					}

					attrs[key] = value;
					if (enumValues.TryGetValue(key, out var bag) && value.Length > 0)
					{
						bag.Add(value);
					}
				}
			}

			void Add(int id)
			{
				items.Add(new CatalogItem(id, name, article, new Dictionary<string, string>(attrs, StringComparer.OrdinalIgnoreCase)));
			}

			if (int.TryParse(idAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id))
			{
				Add(id);
			}
			else if (int.TryParse(fromAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var from)
				&& int.TryParse(toAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var to))
			{
				for (var i = from; i <= to; i++)
				{
					Add(i);
				}
			}
		}

		items.Sort((a, b) => a.Id.CompareTo(b.Id));
		return new ItemsXmlCatalog(items, enumValues);
	}

	/// <summary>Escreve <c>items.json</c> com clientId do OTB quando existir.</summary>
	public void WriteJson(string path, IReadOnlyDictionary<int, int> serverToClient)
	{
		var payload = new
		{
			enums = _enumValues.ToDictionary(
				pair => pair.Key,
				pair => pair.Value.ToArray(),
				StringComparer.OrdinalIgnoreCase),
			boolKeys = BooleanKeys,
			groups = PaletteGroups,
			items = _items.Select(item => Describe(item, serverToClient)).ToList()
		};
		File.WriteAllText(path, JsonSerializer.Serialize(payload, JsonOpts));
	}

	public static string ClassifyGroup(CatalogItem item)
	{
		var type = item.Attr("type") ?? "";
		if (type.Equals("door", StringComparison.OrdinalIgnoreCase))
		{
			return "doors";
		}

		if (type.Equals("teleport", StringComparison.OrdinalIgnoreCase))
		{
			return "teleports";
		}

		if (type.Equals("magicfield", StringComparison.OrdinalIgnoreCase))
		{
			return "fields";
		}

		var containerSize = item.IntAttr("containerSize") ?? item.IntAttr("containersize");
		if (containerSize is > 0
			|| type.Equals("container", StringComparison.OrdinalIgnoreCase)
			|| type.Equals("depot", StringComparison.OrdinalIgnoreCase))
		{
			return "containers";
		}

		if (!string.IsNullOrEmpty(item.Attr("fluidSource")))
		{
			return "fluids";
		}

		if (ItemLayerClassifier.IsWall(item.Id) || IsWallName(item.Name))
		{
			return "walls";
		}

		if (!string.IsNullOrEmpty(item.Attr("floorchange")))
		{
			return "holes";
		}

		if (IsGroundName(item.Name) && item.Attr("pickupable") != "1")
		{
			return "ground";
		}

		return "other";
	}

	static bool IsWallName(string name)
	{
		if (string.IsNullOrEmpty(name))
		{
			return false;
		}

		var n = name.ToLowerInvariant();
		if (n.Contains("lamp") || n.Contains("clock") || n.Contains("mirror") || n.Contains("fire"))
		{
			return false;
		}

		return n.EndsWith("wall") || n.Contains(" wall") || n is "archway" or "brick wall";
	}

	static bool IsGroundName(string name)
	{
		if (string.IsNullOrEmpty(name))
		{
			return false;
		}

		var n = name.ToLowerInvariant();
		return n is "grass" or "sand" or "dirt" or "earth" or "void" or "gravel"
			or "rock soil" or "dirt floor" or "muddy floor" or "wooden floor"
			or "white marble floor" or "black marble floor" or "earth ground"
			or "flowers" or "snow" or "water" or "lava" or "mud"
			|| n.EndsWith(" floor") || n.EndsWith(" ground");
	}

	static object Describe(CatalogItem item, IReadOnlyDictionary<int, int> serverToClient)
	{
		serverToClient.TryGetValue(item.Id, out var clientId);
		var type = item.Attr("type");
		var containerSize = item.IntAttr("containerSize") ?? item.IntAttr("containersize");
		var isContainer = containerSize is > 0
			|| string.Equals(type, "container", StringComparison.OrdinalIgnoreCase)
			|| string.Equals(type, "depot", StringComparison.OrdinalIgnoreCase);
		var group = ClassifyGroup(item);

		return new
		{
			id = item.Id,
			clientId = clientId > 0 ? clientId : (int?)null,
			name = string.IsNullOrEmpty(item.Name) ? null : item.Name,
			article = item.Article,
			type,
			group,
			container = isContainer ? true : (bool?)null,
			containerSize,
			attrs = item.Attrs.Count == 0 ? null : item.Attrs
		};
	}

	public readonly record struct CatalogItem(
		int Id,
		string Name,
		string? Article,
		Dictionary<string, string> Attrs)
	{
		public string? Attr(string key) =>
			Attrs.TryGetValue(key, out var value) && value.Length > 0 ? value : null;

		public int? IntAttr(string key) =>
			int.TryParse(Attr(key), NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : null;
	}
}
