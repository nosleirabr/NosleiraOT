using System.Globalization;
using System.Xml;

namespace Ot74.Gameplay.Tests.Catalog;

public sealed class ItemInfo
{
	public int Id { get; init; }
	public int ClientId { get; set; }
	public string Name { get; init; } = "";
	public bool IsTeleport { get; init; }
	public bool IsMailbox { get; init; }
	public bool IsLever { get; init; }
	public bool IsContainer { get; init; }
	public FloorChangeKind FloorChange { get; init; }
}

public sealed class ItemCatalog
{
	readonly Dictionary<int, ItemInfo> _byId;

	ItemCatalog(Dictionary<int, ItemInfo> byId) => _byId = byId;

	public IReadOnlyDictionary<int, ItemInfo> ById => _byId;

	public bool Exists(int id) => _byId.ContainsKey(id);

	public bool IsTeleport(int id) => _byId.TryGetValue(id, out var info) && info.IsTeleport;

	public bool IsMailbox(int id) => _byId.TryGetValue(id, out var info) && info.IsMailbox;

	public bool IsLever(int id) => _byId.TryGetValue(id, out var info) && info.IsLever;

	public bool IsContainer(int id) => _byId.TryGetValue(id, out var info) && info.IsContainer;

	public int ClientIdOf(int serverId) =>
		_byId.TryGetValue(serverId, out var info) ? info.ClientId : serverId;

	public bool IsHole(int id) => FloorChangeOf(id).HasFlag(FloorChangeKind.Down);

	public FloorChangeKind FloorChangeOf(int id) =>
		_byId.TryGetValue(id, out var info) ? info.FloorChange : FloorChangeKind.None;

	public static FloorChangeKind ParseFloorChange(string value) => value.ToLowerInvariant() switch
	{
		"down" => FloorChangeKind.Down,
		"north" => FloorChangeKind.North,
		"south" => FloorChangeKind.South,
		"east" => FloorChangeKind.East,
		"west" => FloorChangeKind.West,
		"southalt" => FloorChangeKind.SouthAlt,
		"eastalt" => FloorChangeKind.EastAlt,
		_ => FloorChangeKind.None,
	};

	public static ItemCatalog Load(string itemsXmlPath)
	{
		var byId = new Dictionary<int, ItemInfo>();
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
			var isTeleport = false;
			var isMailbox = false;
			var isLever = name.Equals("lever", StringComparison.OrdinalIgnoreCase);
			var isContainer = false;
			var floorChange = FloorChangeKind.None;

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
					if (key.Equals("type", StringComparison.OrdinalIgnoreCase))
					{
						isTeleport |= value.Equals("teleport", StringComparison.OrdinalIgnoreCase);
						isMailbox |= value.Equals("mailbox", StringComparison.OrdinalIgnoreCase);
					}
					else if (key.Equals("floorchange", StringComparison.OrdinalIgnoreCase))
					{
						floorChange |= ParseFloorChange(value);
					}
					else if (key.Equals("containersize", StringComparison.OrdinalIgnoreCase)
						&& int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var size)
						&& size > 0)
					{
						isContainer = true;
					}
				}
			}

			void Add(int id, int clientId)
			{
				byId[id] = new ItemInfo
				{
					Id = id,
					ClientId = clientId,
					Name = name,
					IsTeleport = isTeleport,
					IsMailbox = isMailbox,
					IsLever = isLever,
					IsContainer = isContainer,
					FloorChange = floorChange
				};
			}

			if (int.TryParse(idAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id))
			{
				Add(id, id);
			}
			else if (int.TryParse(fromAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var from)
				&& int.TryParse(toAttr, NumberStyles.Integer, CultureInfo.InvariantCulture, out var to))
			{
				for (var i = from; i <= to; i++)
				{
					Add(i, i);
				}
			}
		}

		var otbPath = Path.Combine(Path.GetDirectoryName(itemsXmlPath)!, "items.otb");
		foreach (var (serverId, clientId) in ItemsOtbClientIds.Load(otbPath))
		{
			if (byId.TryGetValue(serverId, out var info))
			{
				info.ClientId = clientId;
				byId[serverId] = info;
			}
			else
			{
				byId[serverId] = new ItemInfo { Id = serverId, ClientId = clientId };
			}
		}

		return new ItemCatalog(byId);
	}
}
