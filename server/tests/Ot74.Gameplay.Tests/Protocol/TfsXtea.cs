namespace Ot74.Gameplay.Tests.Protocol;

/// <summary>TFS 1.2 XTEA (protocol.cpp). Delta is 0x61C88647, 32 rounds.</summary>
internal static class TfsXtea
{
	const uint Delta = 0x61C88647;

	public static void Encrypt(byte[] buffer, int offset, int length, uint[] key)
	{
		if ((length & 7) != 0)
		{
			throw new ArgumentException("XTEA length must be a multiple of 8.");
		}

		for (var pos = 0; pos < length; pos += 8)
		{
			var v0 = ReadU32(buffer, offset + pos);
			var v1 = ReadU32(buffer, offset + pos + 4);
			uint sum = 0;
			for (var i = 0; i < 32; i++)
			{
				v0 += (((v1 << 4) ^ (v1 >> 5)) + v1) ^ (sum + key[sum & 3]);
				sum -= Delta;
				v1 += (((v0 << 4) ^ (v0 >> 5)) + v0) ^ (sum + key[(sum >> 11) & 3]);
			}

			WriteU32(buffer, offset + pos, v0);
			WriteU32(buffer, offset + pos + 4, v1);
		}
	}

	public static void Decrypt(byte[] buffer, int offset, int length, uint[] key)
	{
		if ((length & 7) != 0)
		{
			throw new ArgumentException("XTEA length must be a multiple of 8.");
		}

		for (var pos = 0; pos < length; pos += 8)
		{
			var v0 = ReadU32(buffer, offset + pos);
			var v1 = ReadU32(buffer, offset + pos + 4);
			var sum = 0xC6EF3720u;
			for (var i = 0; i < 32; i++)
			{
				v1 -= (((v0 << 4) ^ (v0 >> 5)) + v0) ^ (sum + key[(sum >> 11) & 3]);
				sum += Delta;
				v0 -= (((v1 << 4) ^ (v1 >> 5)) + v1) ^ (sum + key[sum & 3]);
			}

			WriteU32(buffer, offset + pos, v0);
			WriteU32(buffer, offset + pos + 4, v1);
		}
	}

	static uint ReadU32(byte[] buffer, int offset) =>
		(uint)(buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24));

	static void WriteU32(byte[] buffer, int offset, uint value)
	{
		buffer[offset] = (byte)value;
		buffer[offset + 1] = (byte)(value >> 8);
		buffer[offset + 2] = (byte)(value >> 16);
		buffer[offset + 3] = (byte)(value >> 24);
	}
}
