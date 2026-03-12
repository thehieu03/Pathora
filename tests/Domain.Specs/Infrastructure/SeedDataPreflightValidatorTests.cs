using System.Text.RegularExpressions;

using Infrastructure.Data.Seed;

namespace Domain.Specs.Infrastructure;

public sealed class SeedDataPreflightValidatorTests
{
    [Fact]
    public void SeedFileManifest_ShouldCoverAllContextSeedClassesThatLoadJsonData()
    {
        var repoRoot = ResolveRepositoryRoot();
        var seedSourceDir = Path.Combine(repoRoot, "src", "Infrastructure", "Data", "Seed");
        var contextSeedFiles = Directory.GetFiles(seedSourceDir, "*ContextSeed.cs", SearchOption.TopDirectoryOnly);

        var loadDataPattern = new Regex("LoadData<", RegexOptions.Compiled);

        var expectedContextSeeds = contextSeedFiles
            .Where(filePath => loadDataPattern.IsMatch(File.ReadAllText(filePath)))
            .Select(filePath => Path.GetFileNameWithoutExtension(filePath))
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        var mappedContextSeeds = SeedFileManifest.Definitions
            .Select(x => x.ContextSeedClass)
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        Assert.Equal(expectedContextSeeds, mappedContextSeeds);
    }

    [Fact]
    public void ValidateSeedFile_WhenFileIsMissing_ShouldReturnMissingFileIssue()
    {
        var tempRoot = CreateTempSeedRoot();

        var result = SeedDataLoader.ValidateSeedFile("missing.json", ["Id"], tempRoot);

        Assert.False(result.IsValid);
        Assert.Contains(result.Issues, issue => issue.Message.Contains("Missing seed file", StringComparison.Ordinal));
    }

    [Fact]
    public void ValidateSeedFile_WhenJsonIsMalformed_ShouldReturnMalformedJsonIssue()
    {
        var tempRoot = CreateTempSeedRoot();
        var malformedFile = SeedDataLoader.ResolveSeedFilePath("malformed.json", tempRoot);
        File.WriteAllText(malformedFile, "{\"data\": [ { \"Id\": \"1\" } ");

        var result = SeedDataLoader.ValidateSeedFile("malformed.json", ["Id"], tempRoot);

        Assert.False(result.IsValid);
        Assert.Contains(result.Issues, issue => issue.Message.Contains("Malformed JSON", StringComparison.Ordinal));
    }

    [Fact]
    public void ValidateSeedFile_WhenRequiredFieldIsMissing_ShouldReturnFieldIssue()
    {
        var tempRoot = CreateTempSeedRoot();
        var dataFile = SeedDataLoader.ResolveSeedFilePath("sample.json", tempRoot);
        File.WriteAllText(dataFile, "[{\"Name\":\"Sample\"}]");

        var result = SeedDataLoader.ValidateSeedFile("sample.json", ["Id"], tempRoot);

        Assert.False(result.IsValid);
        Assert.Contains(result.Issues, issue =>
            issue.ItemIndex == 0
            && issue.Message.Contains("Missing required field 'Id'", StringComparison.Ordinal));
    }

    [Fact]
    public void ValidateRequiredSeedFiles_WhenUsingCurrentSeedData_ShouldNotThrow()
    {
        var exception = Record.Exception(() => SeedDataPreflightValidator.ValidateRequiredSeedFiles());
        Assert.Null(exception);
    }

    private static string CreateTempSeedRoot()
    {
        var root = Path.Combine(Path.GetTempPath(), $"seed-preflight-{Guid.NewGuid():N}");
        Directory.CreateDirectory(Path.Combine(root, "Data", "Seed", "Seeddata"));
        return root;
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

        throw new InvalidOperationException("Could not resolve repository root for seed manifest coverage test.");
    }
}
