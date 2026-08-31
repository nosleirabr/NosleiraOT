using Ot74.Gameplay.Tests.Catalog;
using Ot74.Gameplay.Tests.Protocol;
using Xunit;

namespace Ot74.Gameplay.Tests;

[Collection("WorldCatalog")]
public sealed class RuntimeContractTests
{
	readonly WorldCatalog _catalog;

	public RuntimeContractTests(WorldCatalogFixture fixture) => _catalog = fixture.Catalog;

	[L4Fact]
	public async Task Probe_login_returns_character_list()
	{
		await L4Host.EnsureReadyAsync();
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));
		var chars = await LoginClient.LoginAsync(
			L4Host.LoginHost, L4Host.LoginPort, TestAccounts.ProbeAccount, TestAccounts.Password, cts.Token);
		Assert.Contains(chars, c => c.Name == TestAccounts.ProbeName);
	}

	[L4Fact]
	public async Task Probe_enters_gameworld()
	{
		await L4Host.EnsureReadyAsync();
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));
		using var session = await GameSession.EnterAsync(
			L4Host.LoginHost, L4Host.GamePort, TestAccounts.ProbeAccount, TestAccounts.Password, TestAccounts.ProbeName, cts.Token);
		Assert.NotNull(session);
	}

	[L4Fact]
	public async Task God_can_gotopos_a_harbour()
	{
		var harbour = _catalog.Harbours.FirstOrDefault(h => h.Name == "thais") ?? _catalog.Harbours[0];
		await L4Host.EnsureReadyAsync();
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));
		using var god = await GameSession.EnterAsync(
			L4Host.LoginHost, L4Host.GamePort, TestAccounts.GodAccount, TestAccounts.Password, TestAccounts.GodName, cts.Token);
		await god.DrainAsync(TimeSpan.FromMilliseconds(800), cts.Token);
		await god.SayAsync($"/gotopos {harbour.Position.X},{harbour.Position.Y},{harbour.Position.Z}", cts.Token);
		using var wait = CancellationTokenSource.CreateLinkedTokenSource(cts.Token);
		wait.CancelAfter(TimeSpan.FromSeconds(8));
		try
		{
			_ = await god.ReceiveAsync(wait.Token);
		}
		catch (OperationCanceledException)
		{
			Assert.Fail("God disconnected or went silent after /gotopos — TFS likely rejected the talkaction.");
		}
	}

	[L4Fact]
	public async Task God_can_open_quest_chest_via_system_lua()
	{
		var candidates = _catalog.Map.QuestChests
			.Where(c => QuestCatalog.QuestSystemActionIds.Contains(c.ActionId) && c.UniqueId > 0)
			.OrderBy(c => c.UniqueId)
			.Take(15)
			.ToList();
		Assert.NotEmpty(candidates);

		await L4Host.EnsureReadyAsync();
		await TestAccounts.EnsureAsync(CancellationToken.None);
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));

		using var god = await GameSession.EnterAsync(
			L4Host.LoginHost, L4Host.GamePort, TestAccounts.GodAccount, TestAccounts.Password, TestAccounts.GodName, cts.Token);
		await god.DrainAsync(TimeSpan.FromMilliseconds(800), cts.Token);

		string? loot = null;
		string? handled = null;
		QuestChest? used = null;
		foreach (var chest in candidates)
		{
			await TestAccounts.ClearPlayerStorageAsync(TestAccounts.GodName, chest.UniqueId, cts.Token);
			await god.SayAsync($"/gotopos {chest.Position.X},{chest.Position.Y},{chest.Position.Z}", cts.Token);
			await god.DrainAsync(TimeSpan.FromMilliseconds(400), cts.Token);

			await god.UseItemAsync(
				(ushort)chest.Position.X,
				(ushort)chest.Position.Y,
				(byte)chest.Position.Z,
				(ushort)_catalog.Items.ClientIdOf(chest.ItemId),
				stackPos: 1,
				index: 0,
				cts.Token);

			var message = await god.WaitForTextMessageAsync(TimeSpan.FromSeconds(4), cts.Token,
				"You have found", "is empty", "cannot use", "not possible");
			if (string.IsNullOrWhiteSpace(message))
			{
				continue;
			}

			used = chest;
			if (message.Contains("You have found", StringComparison.OrdinalIgnoreCase))
			{
				loot = message;
				break;
			}

			if (message.Contains("is empty", StringComparison.OrdinalIgnoreCase))
			{
				handled = message;
			}
		}

		Assert.NotNull(used);
		Assert.False(string.IsNullOrWhiteSpace(loot ?? handled),
			$"Tried {candidates.Count} quest chests; no quests/system.lua text reply (expected loot or 'empty').");
		if (loot is null)
		{
			// Script ran but OTBM chest had no reward item — still proves L4 use + actionid 2000 path.
			Assert.Contains("empty", handled!, StringComparison.OrdinalIgnoreCase);
		}
	}

	/// <summary>
	/// Amostra YAML: Black Knight key sob a árvore (uid 10016 → actionId 5010).
	/// Use-with na porta fica WARN se o protocolo não automatizar (só confirma loot da chave).
	/// </summary>
	[L4Fact]
	public async Task God_can_loot_black_knight_key_5010_from_yaml_tree()
	{
		const int keyUid = 10016;
		var tree = _catalog.Map.QuestChests.FirstOrDefault(c => c.UniqueId == keyUid);
		Assert.True(tree is not null,
			"uid 10016 (Black Knight key under tree) missing on PreferBakedOtbm — rebuild maps/build/world.otbm.");

		await L4Host.EnsureReadyAsync();
		await TestAccounts.EnsureAsync(CancellationToken.None);
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));

		using var god = await GameSession.EnterAsync(
			L4Host.LoginHost, L4Host.GamePort, TestAccounts.GodAccount, TestAccounts.Password, TestAccounts.GodName, cts.Token);
		await god.DrainAsync(TimeSpan.FromMilliseconds(800), cts.Token);
		await TestAccounts.ClearPlayerStorageAsync(TestAccounts.GodName, keyUid, cts.Token);
		await god.SayAsync($"/gotopos {tree!.Position.X},{tree.Position.Y},{tree.Position.Z}", cts.Token);
		await god.DrainAsync(TimeSpan.FromMilliseconds(400), cts.Token);

		await god.UseItemAsync(
			(ushort)tree.Position.X,
			(ushort)tree.Position.Y,
			(byte)tree.Position.Z,
			(ushort)_catalog.Items.ClientIdOf(tree.ItemId),
			stackPos: 1,
			index: 0,
			cts.Token);

		var message = await god.WaitForTextMessageAsync(TimeSpan.FromSeconds(6), cts.Token,
			"You have found", "is empty", "cannot use", "not possible");
		Assert.False(string.IsNullOrWhiteSpace(message),
			"No text reply after using Black Knight tree/chest (uid 10016).");
		Assert.True(
			message!.Contains("You have found", StringComparison.OrdinalIgnoreCase)
			|| message.Contains("is empty", StringComparison.OrdinalIgnoreCase),
			$"Expected loot or empty from uid 10016, got: {message}");
	}

	[L4Fact]
	public async Task God_can_open_yaml_sample_quest_chests()
	{
		// Amostra prioritária (Mintwallin / crowns se contentor / Small Ruby / Banshee / Post)
		int[] sampleUids = [10029, 10058, 10017, 10019, 10061, 10016, 10014];
		var chests = _catalog.Map.QuestChests
			.Where(c => sampleUids.Contains(c.UniqueId) && QuestCatalog.QuestSystemActionIds.Contains(c.ActionId))
			.OrderBy(c => c.UniqueId)
			.ToList();
		Assert.True(chests.Count > 0,
			"Nenhum uid de amostra YAML no OTBM baked — rebuild or check PreferBakedOtbm.");

		await L4Host.EnsureReadyAsync();
		await TestAccounts.EnsureAsync(CancellationToken.None);
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(3));

		using var god = await GameSession.EnterAsync(
			L4Host.LoginHost, L4Host.GamePort, TestAccounts.GodAccount, TestAccounts.Password, TestAccounts.GodName, cts.Token);
		await god.DrainAsync(TimeSpan.FromMilliseconds(800), cts.Token);

		var ok = 0;
		var notes = new List<string>();
		foreach (var chest in chests)
		{
			await TestAccounts.ClearPlayerStorageAsync(TestAccounts.GodName, chest.UniqueId, cts.Token);
			await god.SayAsync($"/gotopos {chest.Position.X},{chest.Position.Y},{chest.Position.Z}", cts.Token);
			await god.DrainAsync(TimeSpan.FromMilliseconds(500), cts.Token);

			string? message = null;
			for (byte stackPos = 1; stackPos <= 3 && message is null; stackPos++)
			{
				await god.UseItemAsync(
					(ushort)chest.Position.X,
					(ushort)chest.Position.Y,
					(byte)chest.Position.Z,
					(ushort)_catalog.Items.ClientIdOf(chest.ItemId),
					stackPos,
					index: 0,
					cts.Token);
				message = await god.WaitForTextMessageAsync(TimeSpan.FromSeconds(3), cts.Token,
					"You have found", "is empty");
			}

			if (string.IsNullOrWhiteSpace(message))
			{
				notes.Add($"uid {chest.UniqueId} @ {chest.Position}: silence (TFS pode precisar restart após bake)");
				continue;
			}

			ok++;
			notes.Add($"uid {chest.UniqueId}: {message}");
		}

		Assert.True(ok > 0,
			"YAML sample chests produced no system.lua reply (restart tfs after bake if silence):\n"
			+ string.Join("\n", notes));
	}
}
