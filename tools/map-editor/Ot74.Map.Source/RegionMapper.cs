using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>Converts between YAML documents and the codec model.</summary>
public static class RegionMapper
{
	public static OtbmPlacedTile ToTile(TileDocument document)
	{
		var tile = new OtbmPlacedTile
		{
			Position = document.Position,
			HouseId = document.House,
			Flags = ParseFlags(document.Flags)
		};

		foreach (var item in document.Items)
		{
			tile.Items.Add(ToItem(item));
		}

		return tile;
	}

	public static TileDocument ToDocument(OtbmPlacedTile tile)
	{
		var document = new TileDocument
		{
			At = [tile.Position.X, tile.Position.Y, tile.Position.Z],
			House = tile.HouseId,
			Flags = FormatFlags(tile.Flags)
		};

		foreach (var item in tile.Items)
		{
			document.Items.Add(ToDocument(item));
		}

		return document;
	}

	public static OtbmPlacedItem ToItem(ItemDocument document)
	{
		var item = new OtbmPlacedItem
		{
			Id = document.Id,
			ActionId = document.Aid,
			UniqueId = document.Uid,
			Count = document.Count,
			Charges = document.Charges,
			DepotId = document.Depot,
			HouseDoorId = document.Door,
			Text = document.Text,
			Teleport = document.Dest is { Length: >= 3 } dest
				? new MapPos(dest[0], dest[1], dest[2])
				: null
		};

		foreach (var child in document.Contents)
		{
			item.Contents.Add(ToItem(child));
		}

		foreach (var unknown in document.Unknown)
		{
			item.Unknown.Add(new OtbmRawAttribute { Type = unknown.Type, Hex = unknown.Hex });
		}

		return item;
	}

	public static ItemDocument ToDocument(OtbmPlacedItem item)
	{
		var document = new ItemDocument
		{
			Id = item.Id,
			Aid = item.ActionId,
			Uid = item.UniqueId,
			Count = item.Count,
			Charges = item.Charges,
			Depot = item.DepotId,
			Door = item.HouseDoorId,
			Text = item.Text,
			Dest = item.Teleport is { } dest ? [dest.X, dest.Y, dest.Z] : null
		};

		foreach (var child in item.Contents)
		{
			document.Contents.Add(ToDocument(child));
		}

		foreach (var unknown in item.Unknown)
		{
			document.Unknown.Add(new UnknownAttributeDocument { Type = unknown.Type, Hex = unknown.Hex });
		}

		return document;
	}

	static OtbmTileFlag ParseFlags(string? flags)
	{
		if (string.IsNullOrWhiteSpace(flags))
		{
			return OtbmTileFlag.None;
		}

		var value = OtbmTileFlag.None;
		foreach (var part in flags.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
		{
			value |= part.ToLowerInvariant() switch
			{
				"protection-zone" or "pz" => OtbmTileFlag.ProtectionZone,
				"no-pvp" => OtbmTileFlag.NoPvpZone,
				"no-logout" => OtbmTileFlag.NoLogout,
				"pvp" => OtbmTileFlag.PvpZone,
				_ => throw new InvalidDataException($"Unknown tile flag '{part}'.")
			};
		}

		return value;
	}

	static string? FormatFlags(OtbmTileFlag flags)
	{
		if (flags == OtbmTileFlag.None)
		{
			return null;
		}

		var parts = new List<string>();
		if (flags.HasFlag(OtbmTileFlag.ProtectionZone))
		{
			parts.Add("protection-zone");
		}

		if (flags.HasFlag(OtbmTileFlag.NoPvpZone))
		{
			parts.Add("no-pvp");
		}

		if (flags.HasFlag(OtbmTileFlag.NoLogout))
		{
			parts.Add("no-logout");
		}

		if (flags.HasFlag(OtbmTileFlag.PvpZone))
		{
			parts.Add("pvp");
		}

		return string.Join(", ", parts);
	}
}
