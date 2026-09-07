using Ot74.Map.Core.Otbm;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

/// <summary>
/// Small hand-built documents that pin down the container rules without needing the 60 MB baseline.
/// </summary>
public sealed class OtbmSyntheticTests
{
	static byte[] BuildDocument(Action<OtbmWriter> build)
	{
		using var buffer = new MemoryStream();
		using (var writer = new OtbmWriter(buffer, OtbmSpecialBytes.MapIdentifier, leaveOpen: true))
		{
			build(writer);
			writer.EnsureAllNodesClosed();
		}

		return buffer.ToArray();
	}

	static byte[] RoundTrip(byte[] document)
	{
		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input, leaveOpen: true);
		using var output = new MemoryStream();

		if (!reader.Read())
		{
			throw new InvalidDataException("Document has no root node.");
		}

		using (var writer = new OtbmWriter(output, reader.Identifier, leaveOpen: true))
		{
			writer.WriteNodeStartRaw(reader.NodeType, reader.RawProps);
			OtbmCopy.All(reader, writer);
		}

		return output.ToArray();
	}

	[Fact]
	public void Empty_node_round_trips()
	{
		var document = BuildDocument(writer =>
		{
			writer.WriteNodeStart(OtbmNodeType.RootV1, ReadOnlySpan<byte>.Empty);
			writer.WriteNodeEnd();
		});

		Assert.Equal(document, RoundTrip(document));
	}

	[Fact]
	public void Properties_containing_control_bytes_survive_a_round_trip()
	{
		// The three control bytes are exactly the payload most likely to corrupt a naive writer.
		var payload = new byte[]
		{
			0x00, OtbmSpecialBytes.Escape, 0x01, OtbmSpecialBytes.NodeStart, 0x02, OtbmSpecialBytes.NodeEnd, 0x03
		};

		var document = BuildDocument(writer =>
		{
			writer.WriteNodeStart(OtbmNodeType.RootV1, payload);
			writer.WriteNodeEnd();
		});

		Assert.Equal(document, RoundTrip(document));

		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);
		Assert.True(reader.Read());
		Assert.Equal(payload, reader.ReadProps());
	}

	[Fact]
	public void Nested_nodes_report_depth_and_round_trip()
	{
		var document = BuildDocument(writer =>
		{
			writer.WriteNodeStart(OtbmNodeType.RootV1, new byte[] { 1 });
			writer.WriteNodeStart(OtbmNodeType.MapData, new byte[] { 2 });
			writer.WriteNodeStart(OtbmNodeType.TileArea, new byte[] { 3 });
			writer.WriteNodeEnd();
			writer.WriteNodeStart(OtbmNodeType.TileArea, new byte[] { 4 });
			writer.WriteNodeEnd();
			writer.WriteNodeEnd();
			writer.WriteNodeEnd();
		});

		Assert.Equal(document, RoundTrip(document));

		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);
		var deepest = 0;
		while (reader.Read())
		{
			if (reader.State == OtbmReadState.NodeStart)
			{
				deepest = Math.Max(deepest, reader.Depth);
			}
		}

		Assert.Equal(3, deepest);
		Assert.Equal(OtbmReadState.EndOfFile, reader.State);
	}

	[Fact]
	public void Root_header_parses_and_writes_symmetrically()
	{
		var header = new OtbmRootHeader(
			Version: 2,
			Width: 65000,
			Height: 65000,
			MajorVersionItems: 3,
			MinorVersionItems: OtbmRootHeader.ClientVersion740);

		Assert.Equal(header, OtbmRootHeader.Parse(header.ToBytes()));
	}

	[Fact]
	public void Root_header_rejects_versions_the_server_cannot_load()
	{
		var tooNew = new OtbmRootHeader(Version: 3, Width: 10, Height: 10, MajorVersionItems: 3, MinorVersionItems: 1);
		Assert.Throws<InvalidDataException>(tooNew.EnsureLoadableByServer);
	}

	[Fact]
	public void Unknown_identifier_is_rejected()
	{
		var document = new byte[] { (byte)'N', (byte)'O', (byte)'P', (byte)'E', OtbmSpecialBytes.NodeStart, 1, OtbmSpecialBytes.NodeEnd };
		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);

		Assert.Throws<InvalidDataException>(() => reader.Read());
	}

	[Fact]
	public void Wildcard_identifier_is_accepted()
	{
		var document = new byte[] { 0, 0, 0, 0, OtbmSpecialBytes.NodeStart, 1, OtbmSpecialBytes.NodeEnd };
		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);

		Assert.True(reader.Read());
		Assert.Equal((byte)OtbmNodeType.RootV1, reader.NodeType);
	}

	[Fact]
	public void Unclosed_node_is_rejected()
	{
		var document = new byte[] { (byte)'O', (byte)'T', (byte)'B', (byte)'M', OtbmSpecialBytes.NodeStart, 1 };
		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);

		Assert.Throws<InvalidDataException>(() =>
		{
			while (reader.Read())
			{
			}
		});
	}

	[Fact]
	public void Truncated_file_is_rejected()
	{
		var document = new byte[] { (byte)'O', (byte)'T' };
		using var input = new MemoryStream(document);
		using var reader = new OtbmReader(input);

		Assert.Throws<InvalidDataException>(() => reader.Read());
	}
}
