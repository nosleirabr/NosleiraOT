namespace Ot74.Gameplay.Tests.Protocol;

internal sealed class GameSession : IDisposable
{
	readonly TibiaConnection _conn;

	GameSession(TibiaConnection conn) => _conn = conn;

	public static async Task<GameSession> EnterAsync(
		string host,
		int port,
		uint account,
		string password,
		string character,
		CancellationToken ct)
	{
		var xtea = LoginClient.NewXteaKey();
		var conn = new TibiaConnection();
		await conn.ConnectAsync(host, port, ct);

		var rsa = LoginClient.BuildGameRsa(xtea, account, character, password);
		var packet = new PacketWriter();
		packet.AddByte(0);
		packet.AddU16(2);
		packet.AddU16(LoginClient.ProtocolVersion);
		packet.AddBytes(rsa);
		await conn.SendAsync(packet.ToArray(), ct);
		conn.EnableXtea(xtea);

		var deadline = DateTime.UtcNow + TimeSpan.FromSeconds(30);
		while (DateTime.UtcNow < deadline)
		{
			using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
			timeout.CancelAfter(TimeSpan.FromSeconds(10));
			var payload = await conn.ReceiveAsync(timeout.Token);
			var reader = new PacketReader(payload);
			var accepted = false;
			while (reader.Remaining > 0)
			{
				var opcode = reader.GetByte();
				if (opcode == 0x14)
				{
					conn.Dispose();
					throw new InvalidOperationException("Game login refused: " + reader.GetString());
				}

				if (opcode == 0x0A)
				{
					_ = reader.GetU32();
					accepted = true;
					break;
				}

				break;
			}

			if (accepted)
			{
				await Task.Delay(400, ct);
				return new GameSession(conn);
			}
		}

		conn.Dispose();
		throw new TimeoutException("Timed out waiting for gameworld login (0x0A).");
	}

	public Task SayAsync(string text, CancellationToken ct)
	{
		var packet = new PacketWriter();
		packet.AddByte(0x96);
		packet.AddByte(1);
		packet.AddString(text);
		return _conn.SendAsync(packet.ToArray(), ct);
	}

	public async Task DrainAsync(TimeSpan quiet, CancellationToken ct)
	{
		while (true)
		{
			using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
			timeout.CancelAfter(quiet);
			try
			{
				_ = await _conn.ReceiveAsync(timeout.Token);
			}
			catch (OperationCanceledException) when (!ct.IsCancellationRequested)
			{
				return;
			}
		}
	}

	public Task UseItemAsync(ushort x, ushort y, byte z, ushort spriteId, byte stackPos, byte index, CancellationToken ct)
	{
		var packet = new PacketWriter();
		packet.AddByte(0x82);
		packet.AddPosition(x, y, z);
		packet.AddU16(spriteId);
		packet.AddByte(stackPos);
		packet.AddByte(index);
		return _conn.SendAsync(packet.ToArray(), ct);
	}

	public async Task<string?> WaitForTextMessageAsync(TimeSpan timeout, CancellationToken ct, params string[] contains)
	{
		var deadline = DateTime.UtcNow + timeout;
		while (DateTime.UtcNow < deadline)
		{
			using var wait = CancellationTokenSource.CreateLinkedTokenSource(ct);
			wait.CancelAfter(deadline - DateTime.UtcNow);
			byte[] payload;
			try
			{
				payload = await _conn.ReceiveAsync(wait.Token);
			}
			catch (OperationCanceledException) when (!ct.IsCancellationRequested)
			{
				return null;
			}

			var reader = new PacketReader(payload);
			while (reader.Remaining > 0)
			{
				var opcode = reader.GetByte();
				if (opcode == 0x14)
				{
					throw new InvalidOperationException("Server error: " + reader.GetString());
				}

				if (opcode != 0xB4)
				{
					break;
				}

				_ = reader.GetByte();
				var text = reader.GetString();
				if (contains.Length == 0 || contains.Any(text.Contains))
				{
					return text;
				}
			}
		}

		return null;
	}

	public Task<byte[]> ReceiveAsync(CancellationToken ct) => _conn.ReceiveAsync(ct);

	public void Dispose() => _conn.Dispose();
}
