using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

/// <summary>Walks an OTBM and collects every tile inside a bounding box.</summary>
public static class RegionExtractor
{
	public static RegionDocument Extract(string otbmPath, string name, MapPos origin, int width, int height)
	{
		var tiles = new List<OtbmPlacedTile>();
		using var reader = OtbmReader.Open(otbmPath);
		TileAreaBase? area = null;

		while (reader.Read())
		{
			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			if (reader.NodeType == (byte)OtbmNodeType.TileArea)
			{
				area = TileAreaBase.Parse(reader.ReadProps());
				continue;
			}

			if (area is not { } current)
			{
				continue;
			}

			if (reader.NodeType is not ((byte)OtbmNodeType.Tile or (byte)OtbmNodeType.HouseTile))
			{
				continue;
			}

			var tile = ReadTileTree(reader, current);
			if (tile.Position.IsInside(origin, width, height))
			{
				tiles.Add(tile);
			}
		}

		var document = new RegionDocument
		{
			Name = name,
			Origin = [origin.X, origin.Y, origin.Z],
			Size = [width, height]
		};

		foreach (var tile in tiles.OrderBy(t => t.Position.Y).ThenBy(t => t.Position.X))
		{
			document.Tiles.Add(RegionMapper.ToDocument(tile));
		}

		return document;
	}

	internal static OtbmPlacedTile ReadTileTree(OtbmReader reader, TileAreaBase area)
	{
		var tile = OtbmTileCodec.ReadTile(reader.NodeType, reader.RawProps, area);
		var startedAt = reader.Depth;
		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeStart && reader.NodeType == (byte)OtbmNodeType.Item)
			{
				tile.Items.Add(ReadItemTree(reader));
			}
			else if (reader.State == OtbmReadState.NodeEnd && reader.Depth < startedAt)
			{
				return tile;
			}
		}

		throw new InvalidDataException($"Tile at {tile.Position} was not closed.");
	}

	internal static OtbmPlacedItem ReadItemTree(OtbmReader reader)
	{
		var item = OtbmTileCodec.ReadItem(reader.RawProps);
		var startedAt = reader.Depth;
		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeStart && reader.NodeType == (byte)OtbmNodeType.Item)
			{
				item.Contents.Add(ReadItemTree(reader));
			}
			else if (reader.State == OtbmReadState.NodeEnd && reader.Depth < startedAt)
			{
				return item;
			}
		}

		throw new InvalidDataException($"Item {item.Id} was not closed.");
	}
}
