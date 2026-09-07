using Ot74.Map.Core.Otbm;

namespace Ot74.Map.Source;

public sealed class ValidationIssue
{
	public required string Path { get; init; }
	public required string Message { get; init; }
	public override string ToString() => $"{Path}: {Message}";
}

/// <summary>Schema and collision checks that run before a build is allowed to write OTBM.</summary>
public static class SourceValidator
{
	public static List<ValidationIssue> Validate(IReadOnlyList<RegionDocument> regions, ItemsXmlIndex? items = null)
	{
		var issues = new List<ValidationIssue>();
		var occupied = new Dictionary<string, string>();
		var uniqueIds = new Dictionary<int, string>();
		var actionIds = new Dictionary<(int X, int Y, int Z, int Aid), string>();

		foreach (var region in regions)
		{
			if (string.IsNullOrWhiteSpace(region.Name))
			{
				issues.Add(new ValidationIssue { Path = "(region)", Message = "Region is missing a name." });
			}

			if (region.Width <= 0 || region.Height <= 0)
			{
				issues.Add(new ValidationIssue { Path = region.Name, Message = "Region size must be positive." });
			}

			foreach (var tile in region.Tiles)
			{
				ValidateTile(region, tile, items, occupied, uniqueIds, actionIds, issues);
			}
		}

		return issues;
	}

	static void ValidateTile(
		RegionDocument region,
		TileDocument tile,
		ItemsXmlIndex? items,
		Dictionary<string, string> occupied,
		Dictionary<int, string> uniqueIds,
		Dictionary<(int, int, int, int), string> actionIds,
		List<ValidationIssue> issues)
	{
		var pos = tile.Position;
		if (!pos.IsInside(region.OriginPos, region.Width, region.Height))
		{
			issues.Add(new ValidationIssue
			{
				Path = region.Name,
				Message = $"Tile {pos} is outside region {region.OriginPos} size {region.Width}x{region.Height}."
			});
		}

		var key = pos.ToString();
		if (occupied.TryGetValue(key, out var other))
		{
			issues.Add(new ValidationIssue
			{
				Path = region.Name,
				Message = $"Tile {pos} is also defined in '{other}'."
			});
		}
		else
		{
			occupied[key] = region.Name;
		}

		foreach (var item in WalkItems(tile.Items))
		{
			if (items is not null && !items.Contains(item.Id))
			{
				issues.Add(new ValidationIssue
				{
					Path = region.Name,
					Message = $"Item id {item.Id} at {pos} is not in items.xml."
				});
			}

			if (item.Uid is { } uid and > 0)
			{
				if (uniqueIds.TryGetValue(uid, out var taken))
				{
					issues.Add(new ValidationIssue
					{
						Path = region.Name,
						Message = $"uniqueId {uid} at {pos} collides with '{taken}'."
					});
				}
				else
				{
					uniqueIds[uid] = $"{region.Name} {pos}";
				}
			}

			if (item.Aid is { } aid and > 0)
			{
				actionIds.TryAdd((pos.X, pos.Y, pos.Z, aid), region.Name);
			}
		}
	}

	static IEnumerable<ItemDocument> WalkItems(IEnumerable<ItemDocument> items)
	{
		foreach (var item in items)
		{
			yield return item;
			foreach (var child in WalkItems(item.Contents))
			{
				yield return child;
			}
		}
	}
}
