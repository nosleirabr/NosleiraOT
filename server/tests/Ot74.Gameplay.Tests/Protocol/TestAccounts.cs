using System.Security.Cryptography;
using System.Text;
using MySqlConnector;

namespace Ot74.Gameplay.Tests.Protocol;

internal static class TestAccounts
{
	public const uint GodAccount = 900001;
	public const uint ProbeAccount = 900002;
	public const string Password = "l4test";
	public const string GodName = "L4God";
	public const string ProbeName = "L4Probe";

	public static async Task EnsureAsync(CancellationToken ct)
	{
		var cs = Environment.GetEnvironmentVariable("OT74_MYSQL")
			?? "Server=127.0.0.1;Port=3306;User ID=ot74;Password=ot74;Database=ot74";
		var hash = Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(Password))).ToLowerInvariant();

		await using var conn = new MySqlConnection(cs);
		await conn.OpenAsync(ct);

		await ExecAsync(conn, $"""
			INSERT INTO accounts (name, password, type, premdays, lastday)
			VALUES ('{GodAccount}', '{hash}', 1, 65535, 0)
			ON DUPLICATE KEY UPDATE password = VALUES(password), premdays = VALUES(premdays)
			""", ct);
		await ExecAsync(conn, $"""
			INSERT INTO accounts (name, password, type, premdays, lastday)
			VALUES ('{ProbeAccount}', '{hash}', 1, 0, 0)
			ON DUPLICATE KEY UPDATE password = VALUES(password), premdays = VALUES(premdays)
			""", ct);

		var godId = await ScalarAsync(conn, $"SELECT id FROM accounts WHERE name = '{GodAccount}'", ct);
		var probeId = await ScalarAsync(conn, $"SELECT id FROM accounts WHERE name = '{ProbeAccount}'", ct);

		await UpsertPlayerAsync(conn, GodName, godId, groupId: 3, premTown: true, ct);
		await UpsertPlayerAsync(conn, ProbeName, probeId, groupId: 1, premTown: true, ct);
	}

	static async Task UpsertPlayerAsync(MySqlConnection conn, string name, int accountId, int groupId, bool premTown, CancellationToken ct)
	{
		var exists = await ScalarAsync(conn, $"SELECT COUNT(*) FROM players WHERE name = '{name}'", ct);
		if (exists > 0)
		{
			await ExecAsync(conn, $"""
				UPDATE players SET account_id = {accountId}, group_id = {groupId},
				level = 8, health = 185, healthmax = 185, experience = 4200,
				looktype = 128, maglevel = 0, mana = 35, manamax = 35,
				soul = 100, town_id = 2, posx = 32369, posy = 32241, posz = 7,
				cap = 470, sex = 1, conditions = '', blessings = 0
				WHERE name = '{name}'
				""", ct);
			return;
		}

		await ExecAsync(conn, $"""
			INSERT INTO players
			(name, group_id, account_id, level, vocation, health, healthmax, experience,
			 lookbody, lookfeet, lookhead, looklegs, looktype, lookaddons,
			 maglevel, mana, manamax, manaspent, soul, town_id, posx, posy, posz,
			 conditions, cap, sex, blessings, comment)
			VALUES
			('{name}', {groupId}, {accountId}, 8, 0, 185, 185, 4200,
			 68, 76, 78, 39, 128, 0,
			 0, 35, 35, 0, 100, 2, 32369, 32241, 7,
			 '', 470, 1, 0, '')
			""", ct);
		_ = premTown;
	}

	static async Task ExecAsync(MySqlConnection conn, string sql, CancellationToken ct)
	{
		await using var cmd = new MySqlCommand(sql, conn);
		await cmd.ExecuteNonQueryAsync(ct);
	}

	static async Task<int> ScalarAsync(MySqlConnection conn, string sql, CancellationToken ct)
	{
		await using var cmd = new MySqlCommand(sql, conn);
		var value = await cmd.ExecuteScalarAsync(ct);
		return Convert.ToInt32(value);
	}

	public static async Task ClearPlayerStorageAsync(string playerName, int storageKey, CancellationToken ct)
	{
		var cs = Environment.GetEnvironmentVariable("OT74_MYSQL")
			?? "Server=127.0.0.1;Port=3306;User ID=ot74;Password=ot74;Database=ot74";
		await using var conn = new MySqlConnection(cs);
		await conn.OpenAsync(ct);
		var playerId = await ScalarAsync(conn, $"SELECT id FROM players WHERE name = '{playerName}'", ct);
		await ExecAsync(conn, $"DELETE FROM player_storage WHERE player_id = {playerId} AND `key` = {storageKey}", ct);
	}
}
