namespace Ot74.Map.Core.Otbm;

/// <summary>One item on a tile, including the attributes the compiler knows how to emit.</summary>
public sealed class OtbmPlacedItem
{
	public int Id { get; set; }
	public int? ActionId { get; set; }
	public int? UniqueId { get; set; }
	public int? Count { get; set; }
	public int? Charges { get; set; }
	public int? DepotId { get; set; }
	public int? HouseDoorId { get; set; }
	public string? Text { get; set; }
	public MapPos? Teleport { get; set; }
	public List<OtbmPlacedItem> Contents { get; } = new();

	/// <summary>Attributes the codec does not understand, kept so export/build does not drop them.</summary>
	public List<OtbmRawAttribute> Unknown { get; } = new();
}

/// <summary>An attribute we cannot decode, stored as type + remaining payload hex.</summary>
public sealed class OtbmRawAttribute
{
	public byte Type { get; set; }
	public string Hex { get; set; } = "";
}

/// <summary>One map tile, ready to serialise as TILE or HOUSETILE.</summary>
public sealed class OtbmPlacedTile
{
	public MapPos Position { get; set; }
	public uint? HouseId { get; set; }
	public OtbmTileFlag Flags { get; set; }
	public List<OtbmPlacedItem> Items { get; } = new();
}
