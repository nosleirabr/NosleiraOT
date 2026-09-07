namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Node types, mirroring <c>OTBM_NodeTypes_t</c> in <c>server/src/iomap.h</c>.
/// Values marked as unsupported are defined by the format but never emitted for 7.4 maps.
/// </summary>
public enum OtbmNodeType : byte
{
	/// <summary>
	/// Documented as 1 in <c>iomap.h</c>. The 7.4 realmap writes 0 here; TFS never inspects the value.
	/// </summary>
	RootV1 = 1,
	MapData = 2,

	/// <summary>Unsupported by TFS 1.2.</summary>
	ItemDef = 3,

	/// <summary>A 256x256 block; child tiles carry offsets relative to its base coordinate.</summary>
	TileArea = 4,
	Tile = 5,
	Item = 6,

	/// <summary>Unsupported by TFS 1.2.</summary>
	TileSquare = 7,

	/// <summary>Unsupported by TFS 1.2.</summary>
	TileRef = 8,

	/// <summary>Unsupported by TFS 1.2; spawns live in the external spawn XML.</summary>
	Spawns = 9,

	/// <summary>Unsupported by TFS 1.2.</summary>
	SpawnArea = 10,

	/// <summary>Unsupported by TFS 1.2.</summary>
	Monster = 11,

	Towns = 12,
	Town = 13,
	HouseTile = 14,
	Waypoints = 15,
	Waypoint = 16
}
