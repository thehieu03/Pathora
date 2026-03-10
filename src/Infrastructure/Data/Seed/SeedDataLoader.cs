using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.Data.Seed;

internal static class SeedDataLoader
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public static List<T>? LoadData<T>(string fileName)
    {
        var basePath = Path.GetDirectoryName(typeof(SeedDataLoader).Assembly.Location) ?? string.Empty;
        var seedFilePath = Path.Combine(basePath, "Data", "Seed", "Seeddata", fileName);

        if (!File.Exists(seedFilePath))
        {
            return null;
        }

        var json = File.ReadAllText(seedFilePath);
        json = json.Trim();

        if (json.StartsWith("["))
        {
            return JsonSerializer.Deserialize<List<T>>(json, JsonOptions);
        }
        else
        {
            using var document = JsonDocument.Parse(json);
            var dataElement = document.RootElement.GetProperty("data");
            return JsonSerializer.Deserialize<List<T>>(dataElement.GetRawText(), JsonOptions);
        }
    }
}
