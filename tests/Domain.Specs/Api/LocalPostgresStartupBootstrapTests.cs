namespace Domain.Specs.Api;

public sealed class LocalPostgresStartupBootstrapTests
{
    [Fact]
    public void Program_WhenStartingApi_ShouldNotRunAutoMigrationOrSeed()
    {
        var programPath = Path.Combine(GetSolutionRoot(), "src", "Api", "Program.cs");
        var sourceCode = File.ReadAllText(programPath);

        Assert.DoesNotContain("await dbContext.Database.MigrateAsync();", sourceCode, StringComparison.Ordinal);
        Assert.DoesNotContain("await AppDbContextSeed.SeedIfNeededAsync(dbContext);", sourceCode, StringComparison.Ordinal);
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
