using System.Text;

namespace Infrastructure.Data.Seed;

internal static class SeedDataPreflightValidator
{
    public static void ValidateRequiredSeedFiles(
        IReadOnlyCollection<SeedFileDefinition>? definitions = null,
        string? basePath = null)
    {
        var seedDefinitions = definitions ?? SeedFileManifest.Definitions;
        var issues = new List<SeedPreflightIssue>();

        foreach (var definition in seedDefinitions)
        {
            var result = SeedDataLoader.ValidateSeedFile(
                definition.FileName,
                definition.EffectiveRequiredFieldPaths,
                basePath);

            if (result.IsValid)
            {
                continue;
            }

            issues.AddRange(result.Issues.Select(issue =>
                new SeedPreflightIssue(
                    definition.ContextSeedClass,
                    result.FileName,
                    result.FilePath,
                    issue.ItemIndex,
                    issue.ItemKey,
                    issue.FieldPath,
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
            var itemKeyPart = string.IsNullOrWhiteSpace(issue.ItemKey) ? string.Empty : $" [item key: {issue.ItemKey}]";
            var fieldPathPart = string.IsNullOrWhiteSpace(issue.FieldPath) ? string.Empty : $" [field path: {issue.FieldPath}]";
            builder.AppendLine($"- {issue.ContextSeedClass} -> {issue.FileName} ({issue.FilePath}){itemPart}{itemKeyPart}{fieldPathPart}: {issue.Message}");
        }

        return builder.ToString();
    }
}

internal sealed record SeedPreflightIssue(
    string ContextSeedClass,
    string FileName,
    string FilePath,
    int? ItemIndex,
    string? ItemKey,
    string? FieldPath,
    string Message);
