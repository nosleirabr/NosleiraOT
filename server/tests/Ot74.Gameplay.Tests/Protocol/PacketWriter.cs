using System.Text;

namespace Ot74.Gameplay.Tests.Protocol;

internal sealed class PacketWriter
{
	readonly MemoryStream _stream = new();

	public void AddByte(byte value) => _stream.WriteByte(value);

	public void AddU16(ushort value)
	{
		_stream.WriteByte((byte)value);
		_stream.WriteByte((byte)(value >> 8));
	}

	public void AddU32(uint value)
	{
		_stream.WriteByte((byte)value);
		_stream.WriteByte((byte)(value >> 8));
		_stream.WriteByte((byte)(value >> 16));
		_stream.WriteByte((byte)(value >> 24));
	}

	public void AddString(string value)
	{
		var bytes = Encoding.Latin1.GetBytes(value);
		AddU16((ushort)bytes.Length);
		_stream.Write(bytes);
	}

	public void AddBytes(byte[] value) => _stream.Write(value);

	public void AddPosition(ushort x, ushort y, byte z)
	{
		AddU16(x);
		AddU16(y);
		AddByte(z);
	}

	public byte[] ToArray() => _stream.ToArray();
}
