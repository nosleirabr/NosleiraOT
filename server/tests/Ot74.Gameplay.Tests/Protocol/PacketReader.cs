using System.Text;

namespace Ot74.Gameplay.Tests.Protocol;

internal sealed class PacketReader
{
	readonly byte[] _data;
	int _offset;

	public PacketReader(byte[] data) => _data = data;

	public int Remaining => _data.Length - _offset;

	public byte GetByte() => _data[_offset++];

	public ushort GetU16()
	{
		var value = (ushort)(_data[_offset] | (_data[_offset + 1] << 8));
		_offset += 2;
		return value;
	}

	public uint GetU32()
	{
		var value = (uint)(_data[_offset] | (_data[_offset + 1] << 8) | (_data[_offset + 2] << 16) | (_data[_offset + 3] << 24));
		_offset += 4;
		return value;
	}

	public string GetString()
	{
		var length = GetU16();
		var text = Encoding.Latin1.GetString(_data, _offset, length);
		_offset += length;
		return text;
	}

	public void Skip(int count) => _offset += count;
}
