using System.Net.Sockets;

namespace Ot74.Gameplay.Tests.Protocol;

internal sealed class TibiaConnection : IDisposable
{
	readonly TcpClient _client = new() { NoDelay = true };
	NetworkStream _stream = null!;
	uint[]? _xtea;

	public async Task ConnectAsync(string host, int port, CancellationToken ct)
	{
		await _client.ConnectAsync(host, port, ct);
		_stream = _client.GetStream();
	}

	public void EnableXtea(uint[] key) => _xtea = key;

	public async Task SendAsync(byte[] payload, CancellationToken ct)
	{
		byte[] body;
		if (_xtea is null)
		{
			body = payload;
		}
		else
		{
			var inner = new byte[2 + payload.Length];
			inner[0] = (byte)payload.Length;
			inner[1] = (byte)(payload.Length >> 8);
			Buffer.BlockCopy(payload, 0, inner, 2, payload.Length);
			var padded = Pad8(inner);
			TfsXtea.Encrypt(padded, 0, padded.Length, _xtea);
			body = padded;
		}

		var packet = new byte[2 + body.Length];
		packet[0] = (byte)body.Length;
		packet[1] = (byte)(body.Length >> 8);
		Buffer.BlockCopy(body, 0, packet, 2, body.Length);
		await _stream.WriteAsync(packet, ct);
	}

	public async Task<byte[]> ReceiveAsync(CancellationToken ct)
	{
		var header = await ReadExactAsync(2, ct);
		var size = header[0] | (header[1] << 8);
		var body = await ReadExactAsync(size, ct);
		if (_xtea is null)
		{
			return body;
		}

		if ((body.Length & 7) != 0)
		{
			throw new InvalidDataException($"XTEA body length {body.Length} is not a multiple of 8.");
		}

		TfsXtea.Decrypt(body, 0, body.Length, _xtea);
		var inner = body[0] | (body[1] << 8);
		if (inner < 0 || inner > body.Length - 2)
		{
			throw new InvalidDataException($"XTEA inner length {inner} exceeds body {body.Length}.");
		}

		var payload = new byte[inner];
		Buffer.BlockCopy(body, 2, payload, 0, inner);
		return payload;
	}

	async Task<byte[]> ReadExactAsync(int count, CancellationToken ct)
	{
		var buffer = new byte[count];
		var read = 0;
		while (read < count)
		{
			var n = await _stream.ReadAsync(buffer.AsMemory(read, count - read), ct);
			if (n == 0)
			{
				throw new EndOfStreamException("TFS closed the connection.");
			}

			read += n;
		}

		return buffer;
	}

	static byte[] Pad8(byte[] data)
	{
		var pad = (8 - (data.Length % 8)) % 8;
		if (pad == 0)
		{
			return data;
		}

		var padded = new byte[data.Length + pad];
		Buffer.BlockCopy(data, 0, padded, 0, data.Length);
		return padded;
	}

	public void Dispose() => _client.Dispose();
}
