using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

public sealed class ImportReport
{
	public int MappedExact { get; set; }
	public int Unmapped { get; set; }
	public List<int> UnmappedIds { get; } = new();
	public string Fidelity { get; set; } = "non-74";
}

/// <summary>
/// Reverse-engineers a region of any OTBM into YAML. Without a sprite table, ids are kept
/// as-is and checked against the destination items.xml when provided.
/// </summary>
public static class MapImporter
{
	public static (RegionDocument Region, ImportReport Report) Import(
		string otbmPath,
		MapPos origin,
		int width,
		int height,
		string name,
		ItemsXmlIndex? destItems = null,
		bool requireMapped = true)
	{
		var extracted = RegionExtractor.Extract(otbmPath, name, origin, width, height);
		extracted.Fidelity = "non-74";
		var report = new ImportReport();
		foreach (var tile in extracted.Tiles)
		{
			CheckItems(tile.Items, destItems, report);
		}

		if (requireMapped && report.Unmapped > 0)
		{
			throw new InvalidDataException(
				$"Import left {report.Unmapped} unmapped item id(s). First: {string.Join(", ", report.UnmappedIds.Take(8))}");
		}

		return (extracted, report);
	}

	static void CheckItems(List<ItemDocument> items, ItemsXmlIndex? destItems, ImportReport report)
	{
		foreach (var item in items)
		{
			if (destItems is null || destItems.Contains(item.Id))
			{
				report.MappedExact++;
			}
			else
			{
				report.Unmapped++;
				report.UnmappedIds.Add(item.Id);
			}

			CheckItems(item.Contents, destItems, report);
		}
	}
}
