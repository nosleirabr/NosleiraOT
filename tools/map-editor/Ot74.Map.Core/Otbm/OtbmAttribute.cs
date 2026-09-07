namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Property keys used inside map, tile and item nodes, mirroring <c>OTBM_AttrTypes_t</c>
/// in <c>server/src/iomap.h</c>.
/// </summary>
public enum OtbmAttribute : byte
{
	Description = 1,
	ExtFile = 2,
	TileFlags = 3,
	ActionId = 4,
	UniqueId = 5,
	Text = 6,
	Desc = 7,
	TeleDest = 8,
	Item = 9,
	DepotId = 10,
	ExtSpawnFile = 11,
	RuneCharges = 12,
	ExtHouseFile = 13,
	HouseDoorId = 14,
	Count = 15,
	Duration = 16,
	DecayingState = 17,
	WrittenDate = 18,
	WrittenBy = 19,
	SleeperGuid = 20,
	SleepStart = 21,
	Charges = 22
}

/// <summary>
/// Tile zone flags, mirroring <c>OTBM_TileFlag_t</c> in <c>server/src/iomap.h</c>.
/// </summary>
[Flags]
public enum OtbmTileFlag : uint
{
	None = 0,
	ProtectionZone = 1 << 0,
	NoPvpZone = 1 << 2,
	NoLogout = 1 << 3,
	PvpZone = 1 << 4
}
