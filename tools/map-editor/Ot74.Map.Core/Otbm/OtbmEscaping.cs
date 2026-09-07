namespace Ot74.Map.Core.Otbm;

/// <summary>
/// Converts node properties between the on-disk (escaped) form and the logical (raw) form.
/// </summary>
/// <remarks>
/// The reader deliberately keeps properties escaped exactly as they were read, so that untouched
/// nodes can be written back byte for byte. Escaping only happens when a caller supplies new data.
/// </remarks>
public static class OtbmEscaping
{
	/// <summary>Removes escape bytes, returning the logical property payload.</summary>
	public static byte[] Unescape(ReadOnlySpan<byte> escaped)
	{
		var result = new byte[UnescapedLength(escaped)];
		var written = 0;

		for (var i = 0; i < escaped.Length; i++)
		{
			if (escaped[i] == OtbmSpecialBytes.Escape)
			{
				i++;
				if (i >= escaped.Length)
				{
					throw new InvalidDataException("OTBM properties end with a dangling escape byte.");
				}
			}

			result[written++] = escaped[i];
		}

		return result;
	}

	/// <summary>Adds escape bytes so the payload can be stored between node markers.</summary>
	public static byte[] Escape(ReadOnlySpan<byte> raw)
	{
		var result = new byte[EscapedLength(raw)];
		var written = 0;

		foreach (var value in raw)
		{
			if (OtbmSpecialBytes.IsControl(value))
			{
				result[written++] = OtbmSpecialBytes.Escape;
			}

			result[written++] = value;
		}

		return result;
	}

	/// <summary>Byte count the payload occupies once escaped.</summary>
	public static int EscapedLength(ReadOnlySpan<byte> raw)
	{
		var length = raw.Length;
		foreach (var value in raw)
		{
			if (OtbmSpecialBytes.IsControl(value))
			{
				length++;
			}
		}

		return length;
	}

	/// <summary>Byte count the payload occupies once unescaped.</summary>
	public static int UnescapedLength(ReadOnlySpan<byte> escaped)
	{
		var length = 0;
		for (var i = 0; i < escaped.Length; i++)
		{
			if (escaped[i] == OtbmSpecialBytes.Escape)
			{
				i++;
			}

			length++;
		}

		return length;
	}
}
