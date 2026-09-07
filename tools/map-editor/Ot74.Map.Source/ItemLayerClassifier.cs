using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>
/// Partitions stack items into readable sector layer files. Ambiguous / attributed
/// items always go to <see cref="MapLayer.Special"/> so attrs are never lost.
/// </summary>
public enum MapLayer
{
	Ground,
	Walls,
	Furniture,
	Special
}

public static class ItemLayerClassifier
{
	// Common 7.4 wall / border serverIds (non-exhaustive; unknowns fall through).
	static readonly HashSet<int> WallIds =
	[
		1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
		1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
		1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
		1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072,
		1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214,
		1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1532, 1533
	];

	static readonly HashSet<int> SpecialIds =
	[
		// Holes / pits
		383, 384, 385, 386, 387, 388, 389, 390, 391, 392,
		469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485,
		// Stairs / ladders
		1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397,
		// Levers / switches / common quest interactables
		1945, 1946, 9825, 9826,
		// Chests / boxes often quested
		1740, 1747, 1748, 1777, 1987, 1988
	];

	public static bool IsWall(int id) => WallIds.Contains(id);

	public static MapLayer Classify(ItemDocument item, bool isFirstOnTile)
	{
		if (HasSpecialAttrs(item) || SpecialIds.Contains(item.Id))
		{
			return MapLayer.Special;
		}

		if (WallIds.Contains(item.Id))
		{
			return MapLayer.Walls;
		}

		if (isFirstOnTile)
		{
			return MapLayer.Ground;
		}

		return MapLayer.Furniture;
	}

	public static string FileName(MapLayer layer) => layer switch
	{
		MapLayer.Ground => "ground.yaml",
		MapLayer.Walls => "walls.yaml",
		MapLayer.Furniture => "furniture.yaml",
		MapLayer.Special => "special.yaml",
		_ => throw new ArgumentOutOfRangeException(nameof(layer))
	};

	public static IReadOnlyList<MapLayer> LoadOrder { get; } =
		[MapLayer.Ground, MapLayer.Walls, MapLayer.Furniture, MapLayer.Special];

	static bool HasSpecialAttrs(ItemDocument item) =>
		item.Aid is not null
		|| item.Uid is not null
		|| item.Dest is not null
		|| item.Door is not null
		|| item.Depot is not null
		|| !string.IsNullOrEmpty(item.Text)
		|| item.Contents.Count > 0
		|| item.Unknown.Count > 0;
}
