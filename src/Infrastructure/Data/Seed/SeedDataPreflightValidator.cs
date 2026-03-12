using System.Text;

namespace Infrastructure.Data.Seed;

internal static class SeedDataPreflightValidator
{
    public static void ValidateRequiredSeedFiles(string? basePath = null)
    {
        var issues = new List<SeedPreflightIssue>();

        foreach (var definition in SeedFileManifest.Definitions)
        {
            var result = SeedDataLoader.ValidateSeedFile(definition.FileName, definition.RequiredFields, basePath);
            if (result.IsValid)
            {
                continue;
            }

            issues.AddRange(result.Issues.Select(issue =>
                new SeedPreflightIssue(
                    definition.ContextSeedClass,
                    result.FilePath,
                    issue.ItemIndex,
                    issue.Message)));
        }

        if (issues.Count == 0)
        {
            return;
        }

        throw new InvalidOperationException(BuildFailureMessage(issues));
    }

    private static string BuildFailureMessage(IReadOnlyList<SeedPreflightIssue> issues)
    {
        var builder = new StringBuilder();
        builder.AppendLine("Seed preflight validation failed. Please fix the following seed data issues:");

        foreach (var issue in issues)
        {
            var itemPart = issue.ItemIndex.HasValue ? $" [item index: {issue.ItemIndex}]" : string.Empty;
            builder.AppendLine($"- {issue.ContextSeedClass} -> {issue.FilePath}{itemPart}: {issue.Message}");
        }

        return builder.ToString();
    }
}

internal sealed record SeedPreflightIssue(
    string ContextSeedClass,
    string FilePath,
    int? ItemIndex,
    string Message);
