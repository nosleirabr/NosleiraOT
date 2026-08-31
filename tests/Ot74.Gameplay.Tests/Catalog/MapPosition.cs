namespace Ot74.Gameplay.Tests.Catalog;

public readonly record struct MapPosition(int X, int Y, int Z)
{
	public bool IsZero => X == 0 && Y == 0 && Z == 0;

	public ulong Pack() => ((ulong)(uint)X << 32) | ((ulong)(uint)Y << 16) | (uint)Z;

	public override string ToString() => $"{X},{Y},{Z}";
}

public sealed record MapTeleport(MapPosition From, MapPosition Dest, int ItemId, int ActionId);

public sealed record MapPlacedItem(MapPosition Position, int ItemId, int ActionId, int UniqueId);

public sealed record QuestChest(MapPosition Position, int ItemId, int ActionId, int UniqueId, bool HasContents);

[Flags]
public enum FloorChangeKind : byte
{
	None = 0,
	Down = 1,
	North = 2,
	South = 4,
	East = 8,
	West = 16,
	SouthAlt = 32,
	EastAlt = 64,
}

public sealed record FloorChangeItem(MapPosition Position, int ItemId, FloorChangeKind Kind);

public sealed record TravelHarbour(string Name, MapPosition Position);

public sealed record TravelRoute(
	string NpcFile,
	string Keyword,
	string HarbourName,
	MapPosition Destination,
	bool Premium,
	int Cost);

public sealed record NpcDefinition(
	string FileName,
	string Name,
	string Script,
	int LookType,
	int LookTypeEx,
	IReadOnlyList<int> ShopItemIds);

public sealed record SpawnedNpc(string Name, MapPosition Position);

public sealed record ActionHandler(string Script, string Function, bool ScriptExists);

public sealed class ActionRegistry
{
	public Dictionary<int, ActionHandler> UniqueIds { get; } = new();
	public Dictionary<int, ActionHandler> ActionIds { get; } = new();

	public bool TryResolve(int uniqueId, int actionId, out ActionHandler handler)
	{
		if (uniqueId > 0 && UniqueIds.TryGetValue(uniqueId, out handler!))
		{
			return true;
		}

		if (actionId > 0 && ActionIds.TryGetValue(actionId, out handler!))
		{
			return true;
		}

		handler = null!;
		return false;
	}
}
