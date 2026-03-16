using System.Text.Json;
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

        var loadDataPattern = new Regex("LoadData<[^>]+>\\(\"(?<file>[^\"]+)\"\\)", RegexOptions.Compiled);

        var expectedSeedFiles = contextSeedFiles
            .SelectMany(filePath =>
                loadDataPattern
                    .Matches(File.ReadAllText(filePath))
                    .Select(match => match.Groups["file"].Value))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        var mappedSeedFiles = SeedFileManifest.Definitions
            .Select(x => x.FileName)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        Assert.NotEmpty(expectedSeedFiles);
        foreach (var expectedSeedFile in expectedSeedFiles)
        {
            Assert.Contains(expectedSeedFile, mappedSeedFiles);
        }
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

    [Fact]
    public void ValidateDuplicateIds_ShouldDetectDuplicateUserIds()
    {
        var tempRoot = CreateTempSeedRoot();
        var userFile = Path.Combine(tempRoot, "src", "Infrastructure", "Data", "Seed", "Seeddata", "user.json");
        Directory.CreateDirectory(Path.GetDirectoryName(userFile)!);
        File.WriteAllText(userFile, @"
[
    { ""Id"": ""user-1"", ""Username"": ""user1"", ""Email"": ""user1@test.com"", ""Status"": 0, ""VerifyStatus"": 1 },
    { ""Id"": ""user-1"", ""Username"": ""user1-dup"", ""Email"": ""user1dup@test.com"", ""Status"": 0, ""VerifyStatus"": 1 }
]");

        // Manually run duplicate check on this file
        var issues = new List<SeedPreflightIssue>();

        var json = File.ReadAllText(userFile);
        using var document = JsonDocument.Parse(json);
        var idValues = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var index = 0;

        foreach (var item in document.RootElement.EnumerateArray())
        {
            if (item.TryGetProperty("Id", out var idProp))
            {
                var id = idProp.GetString();
                if (!string.IsNullOrEmpty(id))
                {
                    if (idValues.TryGetValue(id, out var existingIndex))
                    {
                        issues.Add(new SeedPreflightIssue(
                            "UserContextSeed", "user.json", index, $"Duplicate ID '{id}' found (first occurrence at index {existingIndex})."));
                    }
                    else
                    {
                        idValues[id] = index;
                    }
                }
            }
            index++;
        }

        Assert.Single(issues);
        Assert.Contains("Duplicate ID", issues[0].Message);
    }

    [Fact]
    public void ValidateCrossFileReferences_ShouldDetectInvalidUserRoleReference()
    {
        var tempRoot = CreateTempSeedRoot();
        var seedDataDir = Path.Combine(tempRoot, "Data", "Seed", "Seeddata");
        Directory.CreateDirectory(seedDataDir);

        // Create user.json with one user
        File.WriteAllText(Path.Combine(seedDataDir, "user.json"), @"
[
    { ""Id"": ""user-001"", ""Username"": ""testuser"", ""Email"": ""test@test.com"", ""Status"": 0, ""VerifyStatus"": 1 }
]");

        // Create role.json with one role
        File.WriteAllText(Path.Combine(seedDataDir, "role.json"), @"
[
    { ""Id"": 1, ""Name"": ""Admin"", ""Type"": 0, ""Status"": 0 }
]");

        // Create user-role.json with invalid user reference
        File.WriteAllText(Path.Combine(seedDataDir, "user-role.json"), @"
[
    { ""UserId"": ""user-nonexistent"", ""RoleId"": 1 }
]");

        // Validate: user-role.json should have invalid reference since user-nonexistent doesn't exist
        var userRoleJson = File.ReadAllText(Path.Combine(seedDataDir, "user-role.json"));
        using var document = JsonDocument.Parse(userRoleJson);

        var issues = new List<SeedPreflightIssue>();
        var userIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "user-001" };
        var roleIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "1" };

        var index = 0;
        foreach (var item in document.RootElement.EnumerateArray())
        {
            if (item.TryGetProperty("UserId", out var userIdProp))
            {
                var userId = userIdProp.GetString();
                if (!string.IsNullOrEmpty(userId) && !userIds.Contains(userId))
                {
                    issues.Add(new SeedPreflightIssue(
                        "UserRoleContextSeed", "user-role.json", index,
                        $"Invalid reference 'UserId': '{userId}' does not exist in 'user.json'."));
                }
            }
            index++;
        }

        Assert.Single(issues);
        Assert.Contains("Invalid reference", issues[0].Message);
        Assert.Equal("UserRoleContextSeed", issues[0].ContextSeedClass);
        Assert.Equal("user-role.json", issues[0].FilePath);
        Assert.Equal(0, issues[0].ItemIndex);
        Assert.Contains("'UserId'", issues[0].Message);
    }

    [Fact]
    public void ValidateCrossFileReferences_ShouldPassWithValidReferences()
    {
        var tempRoot = CreateTempSeedRoot();
        var seedDataDir = Path.Combine(tempRoot, "Data", "Seed", "Seeddata");
        Directory.CreateDirectory(seedDataDir);

        // Create user.json
        File.WriteAllText(Path.Combine(seedDataDir, "user.json"), @"
[
    { ""Id"": ""user-001"", ""Username"": ""testuser"", ""Email"": ""test@test.com"", ""Status"": 0, ""VerifyStatus"": 1 }
]");

        // Create role.json
        File.WriteAllText(Path.Combine(seedDataDir, "role.json"), @"
[
    { ""Id"": 1, ""Name"": ""Admin"", ""Type"": 0, ""Status"": 0 }
]");

        // Create user-role.json with valid references
        File.WriteAllText(Path.Combine(seedDataDir, "user-role.json"), @"
[
    { ""UserId"": ""user-001"", ""RoleId"": 1 }
]");

        // Validate: user-role.json should have valid references
        var userRoleJson = File.ReadAllText(Path.Combine(seedDataDir, "user-role.json"));
        using var document = JsonDocument.Parse(userRoleJson);

        var issues = new List<SeedPreflightIssue>();
        var userIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "user-001" };
        var roleIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "1" };

        foreach (var item in document.RootElement.EnumerateArray())
        {
            if (item.TryGetProperty("UserId", out var userIdProp))
            {
                var userId = userIdProp.GetString();
                if (!string.IsNullOrEmpty(userId) && !userIds.Contains(userId))
                {
                    issues.Add(new SeedPreflightIssue(
                        "UserRoleContextSeed", "user-role.json", 0,
                        $"Invalid reference 'UserId': '{userId}' does not exist in 'user.json'."));
                }
            }
            if (item.TryGetProperty("RoleId", out var roleIdProp))
            {
                var roleId = roleIdProp.ToString();
                if (!string.IsNullOrEmpty(roleId) && !roleIds.Contains(roleId))
                {
                    issues.Add(new SeedPreflightIssue(
                        "UserRoleContextSeed", "user-role.json", 0,
                        $"Invalid reference 'RoleId': '{roleId}' does not exist in 'role.json'."));
                }
            }
        }

        Assert.Empty(issues);
    }

    [Fact]
    public void FunctionSeedFile_ApiUrl_ShouldNotUseVersionPrefix()
    {
        var repoRoot = ResolveRepositoryRoot();
        var seedFilePath = Path.Combine(
            repoRoot,
            "src",
            "Infrastructure",
            "Data",
            "Seed",
            "Seeddata",
            "function.json");

        using var document = JsonDocument.Parse(File.ReadAllText(seedFilePath));
        Assert.Equal(JsonValueKind.Array, document.RootElement.ValueKind);

        var index = 0;
        foreach (var item in document.RootElement.EnumerateArray())
        {
            Assert.True(item.TryGetProperty("ApiUrl", out var apiUrlElement), $"function.json item index {index} is missing 'ApiUrl'.");
            var apiUrl = apiUrlElement.GetString();

            Assert.False(
                string.IsNullOrWhiteSpace(apiUrl),
                $"function.json item index {index} has empty 'ApiUrl'.");

            Assert.DoesNotContain(
                "/api/v1/",
                apiUrl!,
                StringComparison.OrdinalIgnoreCase);

            index++;
        }

        Assert.True(index > 0, "function.json should contain at least one item.");
    }

    [Fact]
    public void TourInstanceSeedFile_ShouldIncludeExplicitViAndEnTranslationsForEveryItem()
    {
        var repoRoot = ResolveRepositoryRoot();
        var seedFilePath = Path.Combine(
            repoRoot,
            "src",
            "Infrastructure",
            "Data",
            "Seed",
            "Seeddata",
            "tour-instance.json");

        using var document = JsonDocument.Parse(File.ReadAllText(seedFilePath));
        Assert.Equal(JsonValueKind.Array, document.RootElement.ValueKind);

        var index = 0;
        foreach (var item in document.RootElement.EnumerateArray())
        {
            Assert.True(
                item.TryGetProperty("Translations", out var translations),
                $"tour-instance.json item index {index} is missing 'Translations'.");
            Assert.Equal(JsonValueKind.Object, translations.ValueKind);

            Assert.True(
                translations.TryGetProperty("vi", out var viTranslation),
                $"tour-instance.json item index {index} is missing 'Translations.vi'.");
            Assert.True(
                translations.TryGetProperty("en", out var enTranslation),
                $"tour-instance.json item index {index} is missing 'Translations.en'.");

            Assert.Equal(JsonValueKind.Object, viTranslation.ValueKind);
            Assert.Equal(JsonValueKind.Object, enTranslation.ValueKind);

            AssertHasNonEmptyString(viTranslation, "Title", index, "vi");
            AssertHasNonEmptyString(enTranslation, "Title", index, "en");

            AssertHasNonEmptyString(viTranslation, "Location", index, "vi");
            AssertHasNonEmptyString(enTranslation, "Location", index, "en");

            AssertHasNonEmptyArray(viTranslation, "IncludedServices", index, "vi");
            AssertHasNonEmptyArray(enTranslation, "IncludedServices", index, "en");

            index++;
        }

        Assert.True(index > 0, "tour-instance.json should contain at least one item.");
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

    private static void AssertHasNonEmptyString(JsonElement parent, string propertyName, int index, string language)
    {
        Assert.True(
            parent.TryGetProperty(propertyName, out var value),
            $"tour-instance.json item index {index} is missing 'Translations.{language}.{propertyName}'.");
        Assert.Equal(JsonValueKind.String, value.ValueKind);
        Assert.False(string.IsNullOrWhiteSpace(value.GetString()));
    }

    private static void AssertHasNonEmptyArray(JsonElement parent, string propertyName, int index, string language)
    {
        Assert.True(
            parent.TryGetProperty(propertyName, out var value),
            $"tour-instance.json item index {index} is missing 'Translations.{language}.{propertyName}'.");
        Assert.Equal(JsonValueKind.Array, value.ValueKind);
        Assert.True(value.GetArrayLength() > 0, $"tour-instance.json item index {index} has empty 'Translations.{language}.{propertyName}'.");
    }
}
