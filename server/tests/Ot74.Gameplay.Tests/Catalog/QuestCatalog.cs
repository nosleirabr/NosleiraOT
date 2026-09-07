using System.Globalization;
using System.Xml;

namespace Ot74.Gameplay.Tests.Catalog;

public sealed record QuestMission(
	string Name,
	int StorageId,
	int StartValue,
	int EndValue,
	IReadOnlyDictionary<int, string> States);

public sealed record QuestDefinition(
	string Name,
	int StartStorageId,
	int StartStorageValue,
	IReadOnlyList<QuestMission> Missions);

public static class QuestCatalog
{
	public static IReadOnlySet<int> QuestSystemActionIds { get; } = new HashSet<int> { 2000, 2001 };

	public static IReadOnlyList<QuestDefinition> Load(string questsXmlPath)
	{
		if (!File.Exists(questsXmlPath))
		{
			return Array.Empty<QuestDefinition>();
		}

		var list = new List<QuestDefinition>();
		var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore, IgnoreComments = true };
		using var reader = XmlReader.Create(questsXmlPath, settings);
		QuestMission? currentMission = null;
		var missionStates = new Dictionary<int, string>();
		var missions = new List<QuestMission>();
		var questName = "";
		var startStorageId = 0;
		var startStorageValue = 0;
		var missionName = "";
		var missionStorageId = 0;
		var missionStart = 0;
		var missionEnd = 0;

		void FlushMission()
		{
			if (currentMission is null)
			{
				return;
			}

			missions.Add(currentMission with { States = missionStates.ToDictionary() });
			missionStates.Clear();
			currentMission = null;
		}

		void FlushQuest()
		{
			FlushMission();
			if (string.IsNullOrWhiteSpace(questName))
			{
				return;
			}

			list.Add(new QuestDefinition(questName, startStorageId, startStorageValue, missions.ToList()));
			missions.Clear();
			questName = "";
		}

		while (reader.Read())
		{
			if (reader.NodeType != XmlNodeType.Element)
			{
				continue;
			}

			switch (reader.Name)
			{
				case "quest":
					FlushQuest();
					questName = reader.GetAttribute("name") ?? "";
					int.TryParse(reader.GetAttribute("startstorageid"), NumberStyles.Integer, CultureInfo.InvariantCulture, out startStorageId);
					int.TryParse(reader.GetAttribute("startstoragevalue"), NumberStyles.Integer, CultureInfo.InvariantCulture, out startStorageValue);
					break;
				case "mission":
					FlushMission();
					missionName = reader.GetAttribute("name") ?? "";
					int.TryParse(reader.GetAttribute("storageid"), NumberStyles.Integer, CultureInfo.InvariantCulture, out missionStorageId);
					int.TryParse(reader.GetAttribute("startvalue"), NumberStyles.Integer, CultureInfo.InvariantCulture, out missionStart);
					int.TryParse(reader.GetAttribute("endvalue"), NumberStyles.Integer, CultureInfo.InvariantCulture, out missionEnd);
					currentMission = new QuestMission(missionName, missionStorageId, missionStart, missionEnd, missionStates);
					break;
				case "missionstate":
					if (currentMission is null)
					{
						break;
					}

					if (int.TryParse(reader.GetAttribute("id"), NumberStyles.Integer, CultureInfo.InvariantCulture, out var stateId))
					{
						missionStates[stateId] = reader.GetAttribute("description") ?? "";
					}

					break;
			}
		}

		FlushQuest();
		return list;
	}

	public static bool IsQuestSystemScript(ActionHandler handler) =>
		handler.Script.Replace('\\', '/').Contains("quests/system", StringComparison.OrdinalIgnoreCase);
}
