using Xunit;

namespace Ot74.Gameplay.Tests.Protocol;

public sealed class L4FactAttribute : FactAttribute
{
	public L4FactAttribute()
	{
		if (!string.Equals(Environment.GetEnvironmentVariable("OT74_L4"), "1", StringComparison.Ordinal))
		{
			Skip = "Set OT74_L4=1 to run protocol tests against docker compose TFS (realmap load is slow).";
		}
	}
}
