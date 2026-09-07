namespace Ot74.Gameplay.Tests.Catalog;

/// <summary>
/// Mirrors TFS 1.2 <c>Tile::queryDestination</c> (tile.cpp) and Lua
/// <c>Position:moveUpstairs</c> / <c>rope.lua</c>.
/// </summary>
public static class FloorChangeResolver
{
	public static MapPosition ResolveWalk(MapPosition from, FloorChangeKind kind, OtbmMap map)
	{
		if (kind.HasFlag(FloorChangeKind.Down))
		{
			return ResolveDown(from, map);
		}

		return ResolveUp(from, kind);
	}

	/// <summary>Walk onto a hole/stairs-down: land at z+1, then offset if the lower tile is itself a stair.</summary>
	public static MapPosition ResolveDown(MapPosition from, OtbmMap map)
	{
		var x = from.X;
		var y = from.Y;
		var z = from.Z + 1;

		var southDown = new MapPosition(x, y - 1, z);
		if (map.FlagsAt(southDown).HasFlag(FloorChangeKind.SouthAlt))
		{
			return new MapPosition(x, y - 2, z);
		}

		var eastDown = new MapPosition(x - 1, y, z);
		if (map.FlagsAt(eastDown).HasFlag(FloorChangeKind.EastAlt))
		{
			return new MapPosition(x - 2, y, z);
		}

		var down = new MapPosition(x, y, z);
		var flags = map.FlagsAt(down);
		if (flags.HasFlag(FloorChangeKind.North))
		{
			y++;
		}

		if (flags.HasFlag(FloorChangeKind.South))
		{
			y--;
		}

		if (flags.HasFlag(FloorChangeKind.SouthAlt))
		{
			y -= 2;
		}

		if (flags.HasFlag(FloorChangeKind.East))
		{
			x--;
		}

		if (flags.HasFlag(FloorChangeKind.EastAlt))
		{
			x -= 2;
		}

		if (flags.HasFlag(FloorChangeKind.West))
		{
			x++;
		}

		return new MapPosition(x, y, z);
	}

	/// <summary>Walk onto stairs/ramp: land at z-1 shifted by the stair's own floorchange.</summary>
	public static MapPosition ResolveUp(MapPosition from, FloorChangeKind flags)
	{
		var x = from.X;
		var y = from.Y;
		var z = from.Z - 1;
		if (flags.HasFlag(FloorChangeKind.North))
		{
			y--;
		}

		if (flags.HasFlag(FloorChangeKind.South))
		{
			y++;
		}

		if (flags.HasFlag(FloorChangeKind.East))
		{
			x++;
		}

		if (flags.HasFlag(FloorChangeKind.West))
		{
			x--;
		}

		if (flags.HasFlag(FloorChangeKind.SouthAlt))
		{
			y += 2;
		}

		if (flags.HasFlag(FloorChangeKind.EastAlt))
		{
			x += 2;
		}

		return new MapPosition(x, y, z);
	}

	/// <summary>
	/// Rope / ladder: <c>Position:moveUpstairs</c> prefers one SQM south at z-1,
	/// then the other 7 neighbours, then the same XY.
	/// </summary>
	public static IReadOnlyList<MapPosition> RopeUpCandidates(MapPosition from)
	{
		var z = from.Z - 1;
		return
		[
			new MapPosition(from.X, from.Y + 1, z),
			new MapPosition(from.X, from.Y - 1, z),
			new MapPosition(from.X + 1, from.Y, z),
			new MapPosition(from.X - 1, from.Y, z),
			new MapPosition(from.X + 1, from.Y + 1, z),
			new MapPosition(from.X - 1, from.Y + 1, z),
			new MapPosition(from.X + 1, from.Y - 1, z),
			new MapPosition(from.X - 1, from.Y - 1, z),
			new MapPosition(from.X, from.Y, z),
		];
	}

	public static bool HasRopeLanding(MapPosition from, OtbmMap map)
	{
		if (from.Z <= 0)
		{
			return false;
		}

		return RopeUpCandidates(from).Any(map.HasTile);
	}
}
