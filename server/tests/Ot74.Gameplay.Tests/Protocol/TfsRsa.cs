using System.Numerics;

namespace Ot74.Gameplay.Tests.Protocol;

/// <summary>TFS 1.2 RSA from otserv.cpp (e = 65537).</summary>
internal static class TfsRsa
{
	const string P = "14299623962416399520070177382898895550795403345466153217470516082934737582776038882967213386204600674145392845853859217990626450972452084065728686565928113";
	const string Q = "7630979195970404721891201847792002125535401292779123937207447574596692788513647179235335529307251350570728407373705564708871762033017096809910315212884101";

	static readonly BigInteger Modulus = BigInteger.Parse(P) * BigInteger.Parse(Q);
	static readonly BigInteger PublicExp = 65537;
	static readonly BigInteger PrivateExp = ModInverse(PublicExp, (BigInteger.Parse(P) - 1) * (BigInteger.Parse(Q) - 1));

	public static byte[] Encrypt(byte[] plain128)
	{
		if (plain128.Length != 128)
		{
			throw new ArgumentException("RSA block must be 128 bytes.", nameof(plain128));
		}

		if (plain128[0] != 0)
		{
			throw new ArgumentException("TFS RSA plaintext must start with 0.");
		}

		var m = new BigInteger(plain128, isUnsigned: true, isBigEndian: true);
		var c = BigInteger.ModPow(m, PublicExp, Modulus);
		return ToFixed(c);
	}

	public static byte[] Decrypt(byte[] cipher128)
	{
		var c = new BigInteger(cipher128, isUnsigned: true, isBigEndian: true);
		var m = BigInteger.ModPow(c, PrivateExp, Modulus);
		return ToFixed(m);
	}

	static BigInteger ModInverse(BigInteger a, BigInteger m)
	{
		BigInteger t = 0, newT = 1;
		BigInteger r = m, newR = a;
		while (newR != 0)
		{
			var q = r / newR;
			(t, newT) = (newT, t - q * newT);
			(r, newR) = (newR, r - q * newR);
		}

		if (r > 1)
		{
			throw new InvalidOperationException("RSA exponent is not invertible.");
		}

		if (t < 0)
		{
			t += m;
		}

		return t;
	}

	static byte[] ToFixed(BigInteger value)
	{
		var bytes = value.ToByteArray(isUnsigned: true, isBigEndian: true);
		if (bytes.Length == 128)
		{
			return bytes;
		}

		var padded = new byte[128];
		Buffer.BlockCopy(bytes, 0, padded, 128 - bytes.Length, bytes.Length);
		return padded;
	}
}
