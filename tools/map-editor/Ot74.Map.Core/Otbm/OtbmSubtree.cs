namespace Ot74.Map.Core.Otbm;

/// <summary>Helpers for copying or skipping a node that the reader has already opened.</summary>
public static class OtbmSubtree
{
	/// <summary>
	/// Writes the current node and every descendant, leaving the reader just after that subtree.
	/// Caller must be on <see cref="OtbmReadState.NodeStart"/>.
	/// </summary>
	public static void Copy(OtbmReader reader, OtbmWriter writer)
	{
		EnsureOnNodeStart(reader);
		var startedAt = reader.Depth;
		writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);

		while (reader.Read())
		{
			switch (reader.State)
			{
				case OtbmReadState.NodeStart:
					writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);
					break;
				case OtbmReadState.NodeEnd:
					writer.WriteNodeEnd();
					if (reader.Depth < startedAt)
					{
						return;
					}

					break;
			}
		}

		throw new InvalidDataException("OTBM ended before a copied subtree was closed.");
	}

	/// <summary>
	/// Advances past the current node and its descendants without writing anything.
	/// </summary>
	public static void Skip(OtbmReader reader)
	{
		EnsureOnNodeStart(reader);
		var startedAt = reader.Depth;
		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeEnd && reader.Depth < startedAt)
			{
				return;
			}
		}

		throw new InvalidDataException("OTBM ended before a skipped subtree was closed.");
	}

	static void EnsureOnNodeStart(OtbmReader reader)
	{
		if (reader.State != OtbmReadState.NodeStart)
		{
			throw new InvalidOperationException("Reader must be positioned on a node start.");
		}
	}
}
