using System.Buffers.Binary;

namespace Ot74.Gameplay.Tests.Catalog;

public sealed class OtbmMap
{
	public int Width { get; set; }
	public int Height { get; set; }
	public HashSet<ulong> Tiles { get; } = new();
	public List<MapTeleport> Teleports { get; } = new();
	public List<MapPlacedItem> Mailboxes { get; } = new();
	public List<MapPlacedItem> LevelDoors { get; } = new();
	public List<MapPlacedItem> QuestDoors { get; } = new();
	public List<MapPlacedItem> Holes { get; } = new();
	public List<FloorChangeItem> FloorChanges { get; } = new();
	public List<MapPlacedItem> RopeSpots { get; } = new();
	public List<MapPlacedItem> UseUpItems { get; } = new();
	public List<MapPlacedItem> UseDownItems { get; } = new();
	public List<MapPlacedItem> Levers { get; } = new(); public List<MapPlacedItem> Chests { get; } = new(); public List<MapPlacedItem> MagicWalls { get; } = new();
	public List<QuestChest> QuestChests { get; } = new();

	Dictionary<ulong, FloorChangeKind>? _flags;

	public bool HasTile(MapPosition pos) => Tiles.Contains(pos.Pack());

	public FloorChangeKind FlagsAt(MapPosition pos)
	{
		_flags ??= FloorChanges
			.GroupBy(f => f.Position.Pack())
			.ToDictionary(g => g.Key, g => g.Aggregate(FloorChangeKind.None, (acc, x) => acc | x.Kind));
		return _flags.TryGetValue(pos.Pack(), out var flags) ? flags : FloorChangeKind.None;
	}
}

/// <summary>
/// Binary OTBM walker matching TFS 1.2 FileLoader + IOMap (NODE_START=0xFE, NODE_END=0xFF, ESCAPE=0xFD).
/// </summary>
public static class OtbmParser
{
	const byte Escape = 0xFD;
	const byte NodeStart = 0xFE;
	const byte NodeEnd = 0xFF;

	const byte OtbmMapData = 2;
	const byte OtbmTileArea = 4;
	const byte OtbmTile = 5;
	const byte OtbmItem = 6;
	const byte OtbmHouseTile = 14;

	const byte AttrTileFlags = 3;
	const byte AttrActionId = 4;
	const byte AttrUniqueId = 5;
	const byte AttrText = 6;
	const byte AttrDesc = 7;
	const byte AttrTeleDest = 8;
	const byte AttrItem = 9;
	const byte AttrDepotId = 10;
	const byte AttrRuneCharges = 12;
	const byte AttrHouseDoorId = 14;
	const byte AttrCount = 15;
	const byte AttrDuration = 16;
	const byte AttrDecayingState = 17;
	const byte AttrWrittenDate = 18;
	const byte AttrWrittenBy = 19;
	const byte AttrSleeperGuid = 20;
	const byte AttrSleepStart = 21;
	const byte AttrCharges = 22;
	const byte AttrContainerItems = 23;
	const byte AttrName = 24;
	const byte AttrArticle = 25;
	const byte AttrPluralName = 26;
	const byte AttrWeight = 27;
	const byte AttrAttack = 28;
	const byte AttrDefense = 29;
	const byte AttrExtraDefense = 30;
	const byte AttrArmor = 31;
	const byte AttrHitChance = 32;
	const byte AttrShootRange = 33;

	public static OtbmMap Load(
		string path,
		ItemCatalog items,
		ISet<int> levelDoorIds,
		ISet<int> questDoorIds,
		ISet<int> ropeSpotIds,
		ISet<int> useUpIds,
		ISet<int> useDownIds)
	{
		var data = File.ReadAllBytes(path);
		if (data.Length < 6)
		{
			throw new InvalidDataException("OTBM file is too small.");
		}

		var cursor = new Cursor(data);
		cursor.Skip(4);
		if (cursor.ReadRaw() != NodeStart)
		{
			throw new InvalidDataException("OTBM missing root node.");
		}

		var map = new OtbmMap();
		var ctx = new ParseCtx(items, levelDoorIds, questDoorIds, ropeSpotIds, useUpIds, useDownIds);
		ParseNode(cursor, map, ctx, context: NodeContext.Root, areaX: 0, areaY: 0, areaZ: 0, tile: default);
		return map;
	}

	readonly record struct ParseCtx(
		ItemCatalog Items,
		ISet<int> LevelDoorIds,
		ISet<int> QuestDoorIds,
		ISet<int> RopeSpotIds,
		ISet<int> UseUpIds,
		ISet<int> UseDownIds);

	enum NodeContext
	{
		Root,
		MapData,
		TileArea,
		Tile,
		Other
	}

	static void ParseNode(
		Cursor cursor,
		OtbmMap map,
		ParseCtx ctx,
		NodeContext context,
		int areaX,
		int areaY,
		int areaZ,
		MapPosition tile)
	{
		var type = cursor.ReadRaw();
		var props = cursor.ReadProps();

		var nextContext = NodeContext.Other;
		var nextAreaX = areaX;
		var nextAreaY = areaY;
		var nextAreaZ = areaZ;
		var nextTile = tile;

		if (context == NodeContext.Root)
		{
			if (props.Length >= 16)
			{
				map.Width = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(4, 2));
				map.Height = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(6, 2));
			}

			nextContext = NodeContext.MapData;
		}
		else if (type == OtbmMapData)
		{
			nextContext = NodeContext.MapData;
		}
		else if (type == OtbmTileArea)
		{
			nextAreaX = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(0, 2));
			nextAreaY = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(2, 2));
			nextAreaZ = props[4];
			nextContext = NodeContext.TileArea;
		}
		else if (type is OtbmTile or OtbmHouseTile)
		{
			var offset = 0;
			var x = nextAreaX + props[offset++];
			var y = nextAreaY + props[offset++];
			if (type == OtbmHouseTile)
			{
				offset += 4;
			}

			nextTile = new MapPosition(x, y, nextAreaZ);
			map.Tiles.Add(nextTile.Pack());
			ReadTileAttributes(props.AsSpan(offset), nextTile, map, ctx);
			nextContext = NodeContext.Tile;
		}
		else if (type == OtbmItem && context == NodeContext.Tile)
		{
			ReadItemNode(props, tile, map, ctx);
			nextContext = NodeContext.Tile;
			nextTile = tile;
		}

		while (cursor.Peek() == NodeStart)
		{
			cursor.ReadRaw();
			ParseNode(cursor, map, ctx, nextContext, nextAreaX, nextAreaY, nextAreaZ, nextTile);
		}

		if (cursor.ReadRaw() != NodeEnd)
		{
			throw new InvalidDataException("OTBM node not closed.");
		}
	}

	static void ReadTileAttributes(
		ReadOnlySpan<byte> props,
		MapPosition tile,
		OtbmMap map,
		ParseCtx ctx)
	{
		var offset = 0;
		while (offset < props.Length)
		{
			var attr = props[offset++];
			if (attr == AttrTileFlags)
			{
				if (offset + 4 > props.Length)
				{
					return;
				}

				offset += 4;
			}
			else if (attr == AttrItem)
			{
				if (offset + 2 > props.Length)
				{
					return;
				}

				var itemId = BinaryPrimitives.ReadUInt16LittleEndian(props[offset..]);
				offset += 2;
				ClassifyItem(tile, itemId, actionId: 0, uniqueId: 0, dest: null, map, ctx);
			}
			else
			{
				return;
			}
		}
	}

	static void ReadItemNode(
		byte[] props,
		MapPosition tile,
		OtbmMap map,
		ParseCtx ctx)
	{
		if (props.Length < 2)
		{
			return;
		}

		var offset = 0;
		var itemId = ReadU16(props, ref offset);
		ushort actionId = 0;
		ushort uniqueId = 0;
		MapPosition? dest = null;
		var hasContents = false;

		while (offset < props.Length)
		{
			var attr = props[offset++];
			if (attr == 0)
			{
				break;
			}

			switch (attr)
			{
				case AttrCount:
				case AttrRuneCharges:
				case AttrHouseDoorId:
				case AttrDecayingState:
				case AttrHitChance:
				case AttrShootRange:
					offset += 1;
					break;
				case AttrActionId:
					actionId = ReadU16(props, ref offset);
					break;
				case AttrUniqueId:
					uniqueId = ReadU16(props, ref offset);
					break;
				case AttrDepotId:
				case AttrCharges:
					offset += 2;
					break;
				case AttrDuration:
				case AttrWrittenDate:
				case AttrSleeperGuid:
				case AttrSleepStart:
				case AttrWeight:
				case AttrAttack:
				case AttrDefense:
				case AttrExtraDefense:
				case AttrArmor:
				case AttrTileFlags:
					offset += 4;
					break;
				case AttrTeleDest:
					if (offset + 5 > props.Length)
					{
						return;
					}

					var dx = ReadU16(props, ref offset);
					var dy = ReadU16(props, ref offset);
					var dz = props[offset++];
					dest = new MapPosition(dx, dy, dz);
					break;
				case AttrText:
				case AttrDesc:
				case AttrWrittenBy:
				case AttrName:
				case AttrArticle:
				case AttrPluralName:
					if (!SkipString(props, ref offset))
					{
						return;
					}

					break;
				case AttrContainerItems:
					hasContents = true;
					break;
				default:
					return;
			}
		}

		ClassifyItem(tile, itemId, actionId, uniqueId, dest, map, ctx, hasContents);
	}

	static void ClassifyItem(
		MapPosition tile,
		int itemId,
		int actionId,
		int uniqueId,
		MapPosition? dest,
		OtbmMap map,
		ParseCtx ctx,
		bool hasContents = false)
	{
		var items = ctx.Items;
		if (dest.HasValue || items.IsTeleport(itemId))
		{
			map.Teleports.Add(new MapTeleport(tile, dest ?? default, itemId, actionId));
		}

		if (items.IsMailbox(itemId))
		{
			map.Mailboxes.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		var floor = items.FloorChangeOf(itemId);
		if (floor != FloorChangeKind.None)
		{
			map.FloorChanges.Add(new FloorChangeItem(tile, itemId, floor));
			if (floor.HasFlag(FloorChangeKind.Down))
			{
				map.Holes.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
			}
		}

		if (ctx.LevelDoorIds.Contains(itemId) && actionId > 0)
		{
			map.LevelDoors.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (ctx.QuestDoorIds.Contains(itemId) && actionId > 0)
		{
			map.QuestDoors.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (ctx.RopeSpotIds.Contains(itemId))
		{
			map.RopeSpots.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (ctx.UseUpIds.Contains(itemId))
		{
			map.UseUpItems.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (ctx.UseDownIds.Contains(itemId))
		{
			map.UseDownItems.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (items.IsLever(itemId))
		{
			map.Levers.Add(new MapPlacedItem(tile, itemId, actionId, uniqueId));
		}

		if (items.IsContainer(itemId) && (actionId is 2000 or 2001 || uniqueId > 0))
		{
			map.QuestChests.Add(new QuestChest(tile, itemId, actionId, uniqueId, hasContents));
		}
	}

	static ushort ReadU16(byte[] props, ref int offset)
	{
		var value = BinaryPrimitives.ReadUInt16LittleEndian(props.AsSpan(offset, 2));
		offset += 2;
		return value;
	}

	static bool SkipString(byte[] props, ref int offset)
	{
		if (offset + 2 > props.Length)
		{
			return false;
		}

		var len = ReadU16(props, ref offset);
		if (offset + len > props.Length)
		{
			return false;
		}

		offset += len;
		return true;
	}

	sealed class Cursor
	{
		readonly byte[] _data;
		int _pos;

		public Cursor(byte[] data) => _data = data;

		public byte Peek() => _pos < _data.Length ? _data[_pos] : (byte)0;

		public byte ReadRaw() => _data[_pos++];

		public void Skip(int n) => _pos += n;

		public byte[] ReadProps()
		{
			var start = _pos;
			var unescaped = new List<byte>(64);
			while (_pos < _data.Length)
			{
				var b = _data[_pos];
				if (b is NodeStart or NodeEnd)
				{
					break;
				}

				_pos++;
				if (b == Escape)
				{
					unescaped.Add(_data[_pos++]);
				}
				else
				{
					unescaped.Add(b);
				}
			}

			_ = start;
			return unescaped.ToArray();
		}
	}
}
