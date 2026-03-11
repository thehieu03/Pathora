namespace Domain.Specs.Api;

public sealed class LocalPostgresStartupBootstrapTests
{
    [Fact]
    public void Program_WhenBootstrappingDatabase_ShouldRunMigrationsBeforeSeed()
    {
        var programPath = Path.Combine(GetSolutionRoot(), "src", "Api", "Program.cs");
        var sourceCode = File.ReadAllText(programPath);

        var migrateIndex = sourceCode.IndexOf("MigrateAsync", StringComparison.Ordinal);
        var seedIndex = sourceCode.IndexOf("SeedIfNeededAsync", StringComparison.Ordinal);

        Assert.True(migrateIndex >= 0, "Expected Program.cs to call Database.MigrateAsync during startup bootstrap.");
        Assert.True(seedIndex > migrateIndex, "Expected Program.cs to run migrations before seed execution.");
    }

    private static string GetSolutionRoot()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var marker = Path.Combine(current.FullName, "LocalService.slnx");
            if (File.Exists(marker))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        throw new InvalidOperationException("Could not locate LocalService.slnx from test execution path.");
    }
}
