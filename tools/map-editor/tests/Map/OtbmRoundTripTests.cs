using Ot74.Map.Core.Otbm;
using Xunit;

namespace Ot74.Gameplay.Tests.Map;

/// <summary>
/// The gate for the whole toolchain: reading and rewriting the real baseline map has to reproduce
/// it byte for byte. Anything less means a compiler would silently drop attributes that the map
/// editor writes and TFS 1.2 ignores.
/// </summary>
public sealed class OtbmRoundTripTests
{
	[Fact]
	public void Baseline_map_round_trips_byte_for_byte()
	{
		var source = RepoPaths.RequireOtbm();
		var destination = Path.Combine(Path.GetTempPath(), $"ot74-roundtrip-{Guid.NewGuid():N}.otbm");

		try
		{
			OtbmCopy.File(source, destination);
			AssertFilesAreIdentical(source, destination);
		}
		finally
		{
			File.Delete(destination);
		}
	}

	[Fact]
	public void Baseline_map_header_is_loadable_by_the_server()
	{
		using var reader = OtbmReader.Open(RepoPaths.RequireOtbm());

		Assert.True(reader.Read());

		// TFS 1.2 never inspects the root type byte. This realmap writes 0, not OTBM_ROOTV1.
		Assert.True(reader.NodeType is 0 or (byte)OtbmNodeType.RootV1, $"Unexpected root type {reader.NodeType}.");

		var header = OtbmRootHeader.Parse(reader.ReadProps());
		header.EnsureLoadableByServer();

		Assert.Equal((uint)1, header.Version);
		Assert.Equal((ushort)65000, header.Width);
		Assert.Equal((ushort)65000, header.Height);
		Assert.Equal(OtbmRootHeader.ClientVersion740, header.MinorVersionItems);
	}

	[Fact]
	public void Baseline_map_contains_the_expected_node_kinds()
	{
		using var reader = OtbmReader.Open(RepoPaths.RequireOtbm());

		var counts = new Dictionary<byte, long>();
		while (reader.Read())
		{
			if (reader.State != OtbmReadState.NodeStart)
			{
				continue;
			}

			counts.TryGetValue(reader.NodeType, out var current);
			counts[reader.NodeType] = current + 1;
		}

		Assert.Equal(OtbmReadState.EndOfFile, reader.State);
		Assert.True(Count(counts, OtbmNodeType.TileArea) > 0, "No tile areas found.");
		Assert.True(Count(counts, OtbmNodeType.Tile) > 1000, "Too few tiles to be the realmap.");
		Assert.True(Count(counts, OtbmNodeType.Item) > 1000, "Too few items to be the realmap.");
	}

	static long Count(IReadOnlyDictionary<byte, long> counts, OtbmNodeType type) =>
		counts.TryGetValue((byte)type, out var value) ? value : 0;

	static void AssertFilesAreIdentical(string expectedPath, string actualPath)
	{
		var expectedLength = new FileInfo(expectedPath).Length;
		var actualLength = new FileInfo(actualPath).Length;
		Assert.True(
			expectedLength == actualLength,
			$"Size differs: original {expectedLength} bytes, rewritten {actualLength} bytes.");

		const int chunkSize = 1024 * 1024;
		using var expected = new FileStream(expectedPath, FileMode.Open, FileAccess.Read, FileShare.Read, chunkSize, FileOptions.SequentialScan);
		using var actual = new FileStream(actualPath, FileMode.Open, FileAccess.Read, FileShare.Read, chunkSize, FileOptions.SequentialScan);

		var expectedChunk = new byte[chunkSize];
		var actualChunk = new byte[chunkSize];
		long offset = 0;

		while (true)
		{
			var expectedRead = expected.ReadAtLeast(expectedChunk, chunkSize, throwOnEndOfStream: false);
			var actualRead = actual.ReadAtLeast(actualChunk, chunkSize, throwOnEndOfStream: false);
			Assert.Equal(expectedRead, actualRead);

			if (expectedRead == 0)
			{
				return;
			}

			var difference = expectedChunk.AsSpan(0, expectedRead).CommonPrefixLength(actualChunk.AsSpan(0, actualRead));
			if (difference != expectedRead)
			{
				Assert.Fail(
					$"First difference at byte {offset + difference}: " +
					$"original 0x{expectedChunk[difference]:X2}, rewritten 0x{actualChunk[difference]:X2}.");
			}

			offset += expectedRead;
		}
	}
}
