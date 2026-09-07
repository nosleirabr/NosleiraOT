namespace Ot74.Gameplay.Tests.Protocol;

internal sealed record CharacterListEntry(string Name, string World, uint Ip, ushort Port);

internal static class LoginClient
{
	public const ushort ProtocolVersion = 772;

	public static async Task<IReadOnlyList<CharacterListEntry>> LoginAsync(
		string host,
		int port,
		uint account,
		string password,
		CancellationToken ct)
	{
		var xtea = NewXteaKey();
		using var conn = new TibiaConnection();
		await conn.ConnectAsync(host, port, ct);

		var rsa = BuildLoginRsa(xtea, account, password);
		var packet = new PacketWriter();
		packet.AddByte(0x01);
		packet.AddU16(2); // Windows
		packet.AddU16(ProtocolVersion);
		packet.AddBytes(new byte[12]);
		packet.AddBytes(rsa);
		await conn.SendAsync(packet.ToArray(), ct);
		conn.EnableXtea(xtea);

		var payload = await conn.ReceiveAsync(ct);
		var reader = new PacketReader(payload);
		var characters = new List<CharacterListEntry>();
		while (reader.Remaining > 0)
		{
			var opcode = reader.GetByte();
			if (opcode == 0x0A)
			{
				throw new InvalidOperationException("Login refused: " + reader.GetString());
			}

			if (opcode == 0x14)
			{
				_ = reader.GetString();
				continue;
			}

			if (opcode == 0x64)
			{
				var count = reader.GetByte();
				for (var i = 0; i < count; i++)
				{
					var name = reader.GetString();
					var world = reader.GetString();
					var ip = reader.GetU32();
					var gamePort = reader.GetU16();
					characters.Add(new CharacterListEntry(name, world, ip, gamePort));
				}

				if (reader.Remaining >= 2)
				{
					_ = reader.GetU16();
				}

				break;
			}

			throw new InvalidDataException($"Unexpected login opcode 0x{opcode:X2}.");
		}

		return characters;
	}

	public static uint[] NewXteaKey()
	{
		var key = new uint[4];
		key[0] = (uint)Random.Shared.Next();
		key[1] = (uint)Random.Shared.Next();
		key[2] = (uint)Random.Shared.Next();
		key[3] = (uint)Random.Shared.Next();
		return key;
	}

	public static byte[] BuildLoginRsa(uint[] xtea, uint account, string password)
	{
		var inner = new PacketWriter();
		inner.AddByte(0);
		inner.AddU32(xtea[0]);
		inner.AddU32(xtea[1]);
		inner.AddU32(xtea[2]);
		inner.AddU32(xtea[3]);
		inner.AddU32(account);
		inner.AddString(password);
		return PadRsa(inner.ToArray());
	}

	public static byte[] BuildGameRsa(uint[] xtea, uint account, string character, string password)
	{
		var inner = new PacketWriter();
		inner.AddByte(0);
		inner.AddU32(xtea[0]);
		inner.AddU32(xtea[1]);
		inner.AddU32(xtea[2]);
		inner.AddU32(xtea[3]);
		inner.AddByte(0); // not gamemaster
		inner.AddU32(account);
		inner.AddString(character);
		inner.AddString(password);
		return PadRsa(inner.ToArray());
	}

	static byte[] PadRsa(byte[] inner)
	{
		if (inner.Length > 128)
		{
			throw new InvalidOperationException("RSA plaintext exceeds 128 bytes.");
		}

		var block = new byte[128];
		Buffer.BlockCopy(inner, 0, block, 0, inner.Length);
		return TfsRsa.Encrypt(block);
	}
}
