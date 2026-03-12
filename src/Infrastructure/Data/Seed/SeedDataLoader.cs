using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.Data.Seed;

internal static class SeedDataLoader
{
    private const string SeedDirectoryName = "Seeddata";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public static List<T>? LoadData<T>(string fileName)
    {
        var seedFilePath = ResolveSeedFilePath(fileName);

        if (!File.Exists(seedFilePath))
        {
            return null;
        }

        return DeserializeSeedList<T>(seedFilePath);
    }

    public static SeedFileValidationResult ValidateSeedFile(
        string fileName,
        IReadOnlyCollection<string> requiredFieldPaths,
        string? basePath = null)
    {
        var seedFilePath = ResolveSeedFilePath(fileName, basePath);
        var issues = new List<SeedFileValidationIssue>();

        if (!File.Exists(seedFilePath))
        {
            issues.Add(new SeedFileValidationIssue(null, null, null, $"Missing seed file: {seedFilePath}"));
            return new SeedFileValidationResult(fileName, seedFilePath, issues);
        }

        var rawJson = ReadFileSafely(seedFilePath, issues);
        if (rawJson is null)
        {
            return new SeedFileValidationResult(fileName, seedFilePath, issues);
        }

        ValidateJsonShapeAndRequiredFields(rawJson, requiredFieldPaths, issues);
        return new SeedFileValidationResult(fileName, seedFilePath, issues);
    }

    public static string ResolveSeedFilePath(string fileName, string? basePath = null)
    {
        var runtimeBasePath = basePath ?? Path.GetDirectoryName(typeof(SeedDataLoader).Assembly.Location) ?? string.Empty;
        return Path.Combine(runtimeBasePath, "Data", "Seed", SeedDirectoryName, fileName);
    }

    private static List<T> DeserializeSeedList<T>(string seedFilePath)
    {
        var rawJson = File.ReadAllText(seedFilePath).Trim();

        if (string.IsNullOrWhiteSpace(rawJson))
        {
            throw new InvalidOperationException($"Seed file is empty: {seedFilePath}");
        }

        try
        {
            if (rawJson.StartsWith("[", StringComparison.Ordinal))
            {
                return JsonSerializer.Deserialize<List<T>>(rawJson, JsonOptions)
                    ?? throw new InvalidOperationException($"Unable to deserialize seed array from: {seedFilePath}");
            }

            using var document = JsonDocument.Parse(rawJson);
            if (document.RootElement.ValueKind != JsonValueKind.Object
                || !document.RootElement.TryGetProperty("data", out var dataElement)
                || dataElement.ValueKind != JsonValueKind.Array)
            {
                throw new InvalidOperationException($"Seed file must be either a JSON array or an object containing an array property named 'data': {seedFilePath}");
            }

            return JsonSerializer.Deserialize<List<T>>(dataElement.GetRawText(), JsonOptions)
                ?? throw new InvalidOperationException($"Unable to deserialize seed data array from: {seedFilePath}");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException($"Invalid JSON format in seed file '{seedFilePath}': {ex.Message}", ex);
        }
    }

    private static string? ReadFileSafely(string filePath, List<SeedFileValidationIssue> issues)
    {
        try
        {
            return File.ReadAllText(filePath).Trim();
        }
        catch (Exception ex)
        {
            issues.Add(new SeedFileValidationIssue(null, null, null, $"Unable to read seed file '{filePath}': {ex.Message}"));
            return null;
        }
    }

    private static void ValidateJsonShapeAndRequiredFields(
        string rawJson,
        IReadOnlyCollection<string> requiredFieldPaths,
        List<SeedFileValidationIssue> issues)
    {
        if (string.IsNullOrWhiteSpace(rawJson))
        {
            issues.Add(new SeedFileValidationIssue(null, null, null, "Seed JSON is empty."));
            return;
        }

        try
        {
            using var document = JsonDocument.Parse(rawJson);
            if (!TryGetArrayRoot(document.RootElement, out var arrayRoot, out var shapeError))
            {
                issues.Add(new SeedFileValidationIssue(null, null, null, shapeError));
                return;
            }

            var index = 0;
            foreach (var item in arrayRoot.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.Object)
                {
                    issues.Add(new SeedFileValidationIssue(index, null, null, "Each seed item must be a JSON object."));
                    index++;
                    continue;
                }

                var itemKey = TryGetPropertyIgnoreCase(item, "Id", out var idValue)
                    ? GetElementDisplayValue(idValue)
                    : null;

                foreach (var fieldPath in requiredFieldPaths)
                {
                    if (!TryGetValueByPath(item, fieldPath, out var fieldValue))
                    {
                        issues.Add(new SeedFileValidationIssue(index, itemKey, fieldPath, $"Missing required field path '{fieldPath}'."));
                        continue;
                    }

                    if (fieldValue.ValueKind == JsonValueKind.Null)
                    {
                        issues.Add(new SeedFileValidationIssue(index, itemKey, fieldPath, $"Required field path '{fieldPath}' must not be null."));
                        continue;
                    }

                    if (fieldValue.ValueKind == JsonValueKind.String && string.IsNullOrWhiteSpace(fieldValue.GetString()))
                    {
                        issues.Add(new SeedFileValidationIssue(index, itemKey, fieldPath, $"Required field path '{fieldPath}' must not be empty."));
                    }
                }

                index++;
            }
        }
        catch (JsonException ex)
        {
            issues.Add(new SeedFileValidationIssue(null, null, null, $"Malformed JSON: {ex.Message}"));
        }
    }

    private static bool TryGetArrayRoot(JsonElement root, out JsonElement arrayRoot, out string error)
    {
        if (root.ValueKind == JsonValueKind.Array)
        {
            arrayRoot = root;
            error = string.Empty;
            return true;
        }

        if (root.ValueKind == JsonValueKind.Object
            && root.TryGetProperty("data", out var dataElement)
            && dataElement.ValueKind == JsonValueKind.Array)
        {
            arrayRoot = dataElement;
            error = string.Empty;
            return true;
        }

        arrayRoot = default;
        error = "Unsupported JSON root shape. Expected either an array [] or an object with a 'data' array property.";
        return false;
    }

    private static bool TryGetValueByPath(JsonElement root, string fieldPath, out JsonElement value)
    {
        value = root;
        if (string.IsNullOrWhiteSpace(fieldPath))
        {
            return false;
        }

        var segments = fieldPath.Split('.', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0)
        {
            return false;
        }

        foreach (var segment in segments)
        {
            if (!TryGetPropertyIgnoreCase(value, segment, out value))
            {
                return false;
            }
        }

        return true;
    }

    private static bool TryGetPropertyIgnoreCase(JsonElement element, string propertyName, out JsonElement value)
    {
        if (element.ValueKind == JsonValueKind.Object)
        {
            foreach (var property in element.EnumerateObject())
            {
                if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase))
                {
                    value = property.Value;
                    return true;
                }
            }
        }

        value = default;
        return false;
    }

    private static string? GetElementDisplayValue(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False => element.GetRawText(),
            _ => null
        };
    }
}

internal sealed record SeedFileValidationIssue(int? ItemIndex, string? ItemKey, string? FieldPath, string Message);

internal sealed record SeedFileValidationResult(
    string FileName,
    string FilePath,
    IReadOnlyList<SeedFileValidationIssue> Issues)
{
    public bool IsValid => Issues.Count == 0;
}
