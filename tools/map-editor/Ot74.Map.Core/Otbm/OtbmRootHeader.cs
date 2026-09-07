using System.Buffers.Binary;

namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Properties of the root node, mirroring <c>OTBM_root_header</c> in <c>server/src/iomap.h</c>.
/// </summary>
/// <param name="Version">OTBM structure version. TFS 1.2 accepts 1 and 2 only.</param>
/// <param name="Width">Map width in tiles.</param>
/// <param name="Height">Map height in tiles.</param>
/// <param name="MajorVersionItems">Major version of the items.otb the map was saved against.</param>
/// <param name="MinorVersionItems">Client version of the items.otb, e.g. 1 for 7.40.</param>
public readonly record struct OtbmRootHeader(
	uint Version,
	ushort Width,
	ushort Height,
	uint MajorVersionItems,
	uint MinorVersionItems)
{
	/// <summary>Size of the header inside the root node properties.</summary>
	public const int SizeInBytes = 16;

	/// <summary>Lowest OTBM version TFS 1.2 can load (<c>IOMap::loadMap</c>).</summary>
	public const uint MinSupportedVersion = 1;

	/// <summary>Highest OTBM version TFS 1.2 can load (<c>IOMap::loadMap</c>).</summary>
	public const uint MaxSupportedVersion = 2;

	/// <summary>items.otb minor version for client 7.40, as required by this server.</summary>
	public const uint ClientVersion740 = 1;

	public static OtbmRootHeader Parse(ReadOnlySpan<byte> properties)
	{
		if (properties.Length < SizeInBytes)
		{
			throw new InvalidDataException(
				$"OTBM root node has {properties.Length} property bytes, expected at least {SizeInBytes}.");
		}

		return new OtbmRootHeader(
			BinaryPrimitives.ReadUInt32LittleEndian(properties),
			BinaryPrimitives.ReadUInt16LittleEndian(properties[4..]),
			BinaryPrimitives.ReadUInt16LittleEndian(properties[6..]),
			BinaryPrimitives.ReadUInt32LittleEndian(properties[8..]),
			BinaryPrimitives.ReadUInt32LittleEndian(properties[12..]));
	}

	public void WriteTo(Span<byte> destination)
	{
		if (destination.Length < SizeInBytes)
		{
			throw new ArgumentException(
				$"Destination needs at least {SizeInBytes} bytes.", nameof(destination));
		}

		BinaryPrimitives.WriteUInt32LittleEndian(destination, Version);
		BinaryPrimitives.WriteUInt16LittleEndian(destination[4..], Width);
		BinaryPrimitives.WriteUInt16LittleEndian(destination[6..], Height);
		BinaryPrimitives.WriteUInt32LittleEndian(destination[8..], MajorVersionItems);
		BinaryPrimitives.WriteUInt32LittleEndian(destination[12..], MinorVersionItems);
	}

	public byte[] ToBytes()
	{
		var bytes = new byte[SizeInBytes];
		WriteTo(bytes);
		return bytes;
	}

	/// <summary>
	/// Mirrors the acceptance rules of <c>IOMap::loadMap</c> so the compiler never emits a map the
	/// server would refuse to load.
	/// </summary>
	public void EnsureLoadableByServer()
	{
		if (Version is < MinSupportedVersion or > MaxSupportedVersion)
		{
			throw new InvalidDataException(
				$"OTBM version {Version} is outside the range TFS 1.2 accepts ({MinSupportedVersion}-{MaxSupportedVersion}).");
		}

		if (MinorVersionItems < ClientVersion740)
		{
			throw new InvalidDataException(
				$"items.otb minor version {MinorVersionItems} is below client 7.40 ({ClientVersion740}).");
		}
	}
}
