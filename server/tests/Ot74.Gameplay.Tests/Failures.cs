namespace Ot74.Gameplay.Tests;

internal static class Failures
{
	public static string Format(string title, IReadOnlyCollection<string> items, int take = 40)
	{
		if (items.Count == 0)
		{
			return title;
		}

		var shown = items.Take(take);
		var more = items.Count > take ? $" ... +{items.Count - take} more" : "";
		return $"{title} ({items.Count}): {string.Join("; ", shown)}{more}";
	}
}
