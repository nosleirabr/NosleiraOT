namespace Ot74.Map.Core.Otbm;

/// <summary>Streams a whole document from a reader into a writer without altering a single byte.</summary>
/// <remarks>
/// This is the backbone of surgical editing: a compiler copies everything verbatim and only swaps
/// the nodes it actually needs to change.
/// </remarks>
public static class OtbmCopy
{
	public static void All(OtbmReader reader, OtbmWriter writer)
	{
		ArgumentNullException.ThrowIfNull(reader);
		ArgumentNullException.ThrowIfNull(writer);

		while (reader.Read())
		{
			switch (reader.State)
			{
				case OtbmReadState.NodeStart:
					writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);
					break;

				case OtbmReadState.NodeEnd:
					writer.WriteNodeEnd();
					break;
			}
		}

		writer.EnsureAllNodesClosed();
	}

	/// <summary>Copies an OTBM file to a new path, preserving the original identifier.</summary>
	public static void File(string sourcePath, string destinationPath)
	{
		using var reader = OtbmReader.Open(sourcePath);

		// The identifier is only known after the first Read, so the writer is created lazily.
		if (!reader.Read())
		{
			throw new InvalidDataException($"'{sourcePath}' contains no OTBM root node.");
		}

		using var writer = OtbmWriter.Create(destinationPath, reader.Identifier);
		writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);
		All(reader, writer);
	}
}
