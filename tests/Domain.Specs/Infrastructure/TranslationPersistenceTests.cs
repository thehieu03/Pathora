using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Domain.Specs.Infrastructure;

public sealed class TranslationPersistenceTests
{
    private static readonly Type[] TranslatableEntityTypes =
    [
        typeof(TourEntity),
        typeof(TourInstanceEntity),
        typeof(TourClassificationEntity),
        typeof(TourDayEntity),
        typeof(TourDayActivityEntity),
        typeof(TourPlanLocationEntity),
        typeof(TourPlanAccommodationEntity),
        typeof(TourPlanRouteEntity)
    ];

    [Fact]
    public void AppDbContext_Model_ShouldMapTranslationsColumnsAsJsonb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=localhost;Database=pathora_test;Username=postgres;Password=postgres")
            .Options;

        using var dbContext = new AppDbContext(options);

        foreach (var entityType in TranslatableEntityTypes)
        {
            var modelEntity = dbContext.Model.FindEntityType(entityType);
            Assert.NotNull(modelEntity);

            var translationsProperty = modelEntity!.FindProperty("Translations");
            Assert.NotNull(translationsProperty);
            Assert.Equal("jsonb", translationsProperty!.GetColumnType());
        }
    }

    [Fact]
    public void Migration_ShouldBackfillVietnameseTranslations_WithoutOverwritingExistingJson()
    {
        var migrationDirectory = Path.Combine(GetSolutionRoot(), "src", "Infrastructure", "Data", "Migrations");
        var migrationFiles = Directory.GetFiles(migrationDirectory, "*.cs")
            .Where(path =>
                !path.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase) &&
                !path.EndsWith("AppDbContextModelSnapshot.cs", StringComparison.OrdinalIgnoreCase))
            .ToList();

        var expectedTables = new[]
        {
            "Tours",
            "TourClassifications",
            "TourDays",
            "TourDayActivities",
            "TourPlanLocations",
            "TourPlanAccommodations",
            "TourPlanRoutes"
        };

        var migration = migrationFiles
            .Select(path => new { Path = path, Content = File.ReadAllText(path) })
            .FirstOrDefault(file =>
                expectedTables.All(table =>
                    file.Content.Contains($"table: \"{table}\"", StringComparison.Ordinal)) &&
                expectedTables.All(table =>
                    file.Content.Contains($"UPDATE \"{table}\"", StringComparison.Ordinal)) &&
                file.Content.Contains("name: \"Translations\"", StringComparison.Ordinal) &&
                file.Content.Contains("\"Translations\" IS NULL", StringComparison.Ordinal));

        Assert.NotNull(migration);
    }

    [Fact]
    public void Migration_ShouldBackfillTourInstanceTranslationsForViAndEn_WithoutOverwritingExistingJson()
    {
        var migrationDirectory = Path.Combine(GetSolutionRoot(), "src", "Infrastructure", "Data", "Migrations");
        var migrationFiles = Directory.GetFiles(migrationDirectory, "*.cs")
            .Where(path =>
                !path.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase) &&
                !path.EndsWith("AppDbContextModelSnapshot.cs", StringComparison.OrdinalIgnoreCase))
            .ToList();

        var migration = migrationFiles
            .Select(path => new { Path = path, Content = File.ReadAllText(path) })
            .FirstOrDefault(file =>
                file.Content.Contains("UPDATE \"TourInstances\"", StringComparison.Ordinal) &&
                file.Content.Contains("'{vi}'", StringComparison.Ordinal) &&
                file.Content.Contains("'{en}'", StringComparison.Ordinal) &&
                file.Content.Contains("\"NormalizedTranslations\"->'vi'", StringComparison.Ordinal) &&
                file.Content.Contains("\"NormalizedTranslations\"->'en'", StringComparison.Ordinal));

        Assert.NotNull(migration);
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
