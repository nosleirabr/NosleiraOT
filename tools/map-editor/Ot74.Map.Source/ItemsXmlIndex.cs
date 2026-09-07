using System.Text.RegularExpressions;

namespace Ot74.Map.Source;

/// <summary>Known server item ids from <c>items.xml</c>, including expanded ranges.</summary>
public sealed class ItemsXmlIndex
{
	static readonly Regex ItemTag = new(
		@"<item\s+([^>]+)>",
		RegexOptions.Compiled | RegexOptions.IgnoreCase);

	static readonly Regex IdAttr = new(@"\bid=""(\d+)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);
	static readonly Regex FromAttr = new(@"\bfromid=""(\d+)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);
	static readonly Regex ToAttr = new(@"\btoid=""(\d+)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);

	readonly HashSet<int> _ids;

	ItemsXmlIndex(HashSet<int> ids) => _ids = ids;

	public static ItemsXmlIndex Load(string itemsXmlPath)
	{
		var text = File.ReadAllText(itemsXmlPath);
		var ids = new HashSet<int>();
		foreach (Match match in ItemTag.Matches(text))
		{
			var attrs = match.Groups[1].Value;
			var id = IdAttr.Match(attrs);
			if (id.Success)
			{
				ids.Add(int.Parse(id.Groups[1].Value));
				continue;
			}

			var from = FromAttr.Match(attrs);
			var to = ToAttr.Match(attrs);
			if (!from.Success || !to.Success)
			{
				continue;
			}

			var start = int.Parse(from.Groups[1].Value);
			var end = int.Parse(to.Groups[1].Value);
			for (var value = start; value <= end; value++)
			{
				ids.Add(value);
			}
		}

		return new ItemsXmlIndex(ids);
	}

	public bool Contains(int id) => _ids.Contains(id);

	public int Count => _ids.Count;
}
