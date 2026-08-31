using System.Net.Sockets;

namespace Ot74.Gameplay.Tests.Protocol;

internal static class L4Host
{
	public static string LoginHost { get; } = Env("OT74_L4_HOST", "127.0.0.1");
	public static int LoginPort { get; } = EnvInt("OT74_L4_LOGIN_PORT", 7171);
	public static int GamePort { get; } = EnvInt("OT74_L4_GAME_PORT", 7172);

	static readonly object Gate = new();
	static Task? _ready;

	public static Task EnsureReadyAsync()
	{
		lock (Gate)
		{
			if (_ready is null || _ready.IsFaulted || _ready.IsCanceled)
			{
				_ready = WaitCoreAsync();
			}

			return _ready;
		}
	}

	static async Task WaitCoreAsync()
	{
		using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(15));
		var ct = cts.Token;
		Exception? last = null;

		while (!ct.IsCancellationRequested)
		{
			try
			{
				using var tcp = new TcpClient();
				using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
				timeout.CancelAfter(TimeSpan.FromSeconds(3));
				await tcp.ConnectAsync(LoginHost, LoginPort, timeout.Token);
				last = null;
				break;
			}
			catch (Exception ex) when (ex is SocketException or OperationCanceledException)
			{
				last = ex;
				await Task.Delay(2000, ct);
			}
		}

		if (last is not null && ct.IsCancellationRequested)
		{
			throw new TimeoutException(
				$"TFS login port {LoginHost}:{LoginPort} did not accept TCP within 15 minutes. " +
				$"Start the stack with `docker compose up -d` and wait for realmap load. Last error: {last.Message}");
		}

		await TestAccounts.EnsureAsync(ct);

		last = null;
		while (!ct.IsCancellationRequested)
		{
			try
			{
				var chars = await LoginClient.LoginAsync(LoginHost, LoginPort, TestAccounts.ProbeAccount, TestAccounts.Password, ct);
				if (chars.Any(c => c.Name == TestAccounts.ProbeName))
				{
					return;
				}

				last = new InvalidOperationException("Character list did not include L4Probe (account 900002).");
			}
			catch (Exception ex) when (ex is not OperationCanceledException)
			{
				last = ex;
			}

			await Task.Delay(3000, ct);
		}

		throw new TimeoutException(
			$"TFS at {LoginHost}:{LoginPort} did not return a 7.72 character list within 15 minutes. " +
			$"Realmap boot can take several minutes after the port opens. Last error: {last?.Message}");
	}

	static string Env(string key, string fallback) =>
		Environment.GetEnvironmentVariable(key) is { Length: > 0 } value ? value : fallback;

	static int EnvInt(string key, int fallback) =>
		int.TryParse(Environment.GetEnvironmentVariable(key), out var n) ? n : fallback;
}
