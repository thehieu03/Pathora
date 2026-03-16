namespace Domain.Specs.Infrastructure;

public sealed class HardcodedRuntimeGuardTests
{
    [Theory]
    [InlineData("src/Api/Controllers/AuthController.cs", "http://localhost:3000")]
    [InlineData("src/Infrastructure/CronJobs/PaymentProcessor.cs", "Bearer DEU74")]
    [InlineData("src/Infrastructure/CronJobs/PaymentProcessor.cs", "account_number=0378175727")]
    [InlineData("src/Api/Controllers/SepayWebhookController.cs", "[Route(\"api/webhook/sepay\")]")]
    [InlineData("src/Api/Controllers/SepayWebhookController.cs", "[HttpGet(\"health\")]")]
    public void ProtectedRuntimeFiles_ShouldNotContainBannedHardcodedPatterns(string relativePath, string bannedPattern)
    {
        var repositoryRoot = ResolveRepositoryRoot();
        var filePath = Path.Combine(repositoryRoot, relativePath.Replace('/', Path.DirectorySeparatorChar));

        Assert.True(File.Exists(filePath), $"Expected protected file to exist: {filePath}");

        var fileContent = File.ReadAllText(filePath);
        Assert.DoesNotContain(bannedPattern, fileContent, StringComparison.Ordinal);
    }

    private static string ResolveRepositoryRoot()
    {
        var current = AppContext.BaseDirectory;
        var directory = new DirectoryInfo(current);

        while (directory is not null)
        {
            var solutionFile = Path.Combine(directory.FullName, "LocalService.slnx");
            if (File.Exists(solutionFile))
            {
                return directory.FullName;
            }

            directory = directory.Parent;
        }

        throw new InvalidOperationException("Could not resolve repository root for hardcoded runtime guard tests.");
    }
}
