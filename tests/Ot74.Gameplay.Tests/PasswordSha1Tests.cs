using System.Security.Cryptography;
using System.Text;
using Xunit;

namespace Ot74.Gameplay.Tests;

public sealed class PasswordSha1Tests
{
	[Fact]
	public void Sha1_empty_string_matches_known_vector()
	{
		Assert.Equal("da39a3ee5e6b4b0d3255bfef95601890afd80709", Sha1Hex(""));
	}

	[Fact]
	public void Config_uses_sha1_password_type()
	{
		var config = File.ReadAllText(Path.Combine(RepoPaths.Data, "..", "config.lua"));
		Assert.Contains("passwordType = \"sha1\"", config, StringComparison.Ordinal);
	}

	[Fact]
	public void Admin123_hashes_to_40_hex_chars()
	{
		var hash = Sha1Hex("admin123");
		Assert.Equal(40, hash.Length);
	}

	static string Sha1Hex(string value)
	{
		var bytes = SHA1.HashData(Encoding.UTF8.GetBytes(value));
		return Convert.ToHexString(bytes).ToLowerInvariant();
	}
}
