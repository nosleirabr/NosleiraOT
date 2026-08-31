using Ot74.Gameplay.Tests.Protocol;
using Xunit;

namespace Ot74.Gameplay.Tests;

public sealed class ProtocolCryptoTests
{
	[Fact]
	public void Xtea_roundtrip_matches_tfs_delta()
	{
		var key = new uint[] { 1, 2, 3, 4 };
		var data = new byte[16];
		for (var i = 0; i < data.Length; i++)
		{
			data[i] = (byte)(i + 10);
		}

		var copy = (byte[])data.Clone();
		TfsXtea.Encrypt(copy, 0, copy.Length, key);
		Assert.NotEqual(data, copy);
		TfsXtea.Decrypt(copy, 0, copy.Length, key);
		Assert.Equal(data, copy);
	}

	[Fact]
	public void Rsa_roundtrip_keeps_leading_zero()
	{
		var plain = new byte[128];
		plain[1] = 0x11;
		plain[2] = 0x22;
		plain[50] = 0xAB;
		var cipher = TfsRsa.Encrypt(plain);
		Assert.NotEqual(plain, cipher);
		var back = TfsRsa.Decrypt(cipher);
		Assert.Equal(plain, back);
	}
}
