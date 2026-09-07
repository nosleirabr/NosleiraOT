namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Control bytes of the OTBM container, mirroring TFS 1.2 <c>FileLoader::SPECIAL_BYTES</c>
/// in <c>server/src/fileloader.h</c>.
/// </summary>
public static class OtbmSpecialBytes
{
	/// <summary>The byte that follows is literal data, not a control byte.</summary>
	public const byte Escape = 0xFD;

	/// <summary>Opens a node. The next byte is the node type.</summary>
	public const byte NodeStart = 0xFE;

	/// <summary>Closes the current node.</summary>
	public const byte NodeEnd = 0xFF;

	/// <summary>Number of bytes in the file identifier that precedes the root node.</summary>
	public const int IdentifierLength = 4;

	/// <summary>Identifier written by map editors and expected by <c>IOMap::loadMap</c>.</summary>
	public static ReadOnlySpan<byte> MapIdentifier => "OTBM"u8;

	/// <summary>
	/// TFS also accepts an all-zero identifier as a wildcard (see <c>FileLoader::openFile</c>),
	/// which is what several editors actually write.
	/// </summary>
	public static ReadOnlySpan<byte> WildcardIdentifier => new byte[] { 0, 0, 0, 0 };

	/// <summary>True when the byte cannot appear unescaped inside node properties.</summary>
	public static bool IsControl(byte value) => value is Escape or NodeStart or NodeEnd;
}
