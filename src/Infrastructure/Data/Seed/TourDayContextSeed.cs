using Domain.Entities;
using Domain.Entities.Translations;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayContextSeed
{
    public static void SeedData(AppDbContext context)
    {
        if (context.TourDays.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDaySeedModel>("tour-day.json");

        if (items is not { Count: > 0 })
        {
            return;
        }

        var classifications = context.TourClassifications.Local.Count > 0
            ? context.TourClassifications.Local.ToList()
            : context.TourClassifications.AsNoTracking().ToList();

        var classificationIdByTourId = classifications
            .OrderBy(classification => classification.AdultPrice)
            .ThenBy(classification => classification.Id)
            .GroupBy(classification => classification.TourId)
            .ToDictionary(group => group.Key, group => group.First().Id);

        var entities = new List<TourDayEntity>(items.Count);

        foreach (var item in items)
        {
            if (!classificationIdByTourId.TryGetValue(item.TourId, out var classificationId))
            {
                throw new InvalidOperationException(
                    $"Could not map tour-day seed '{item.Id}' because tour '{item.TourId}' has no classification seed.");
            }

            entities.Add(new TourDayEntity
            {
                Id = item.Id,
                ClassificationId = classificationId,
                DayNumber = item.DayNumber,
                Title = item.Title,
                Description = item.Description,
                Translations = ToCaseInsensitiveDictionary(item.Translations),
                CreatedBy = item.CreatedBy,
                CreatedOnUtc = item.CreatedOnUtc,
                LastModifiedBy = item.LastModifiedBy,
                LastModifiedOnUtc = item.LastModifiedOnUtc
            });
        }

        context.TourDays.AddRange(entities);
    }

    public static bool BackfillTranslations(AppDbContext context)
    {
        var items = SeedDataLoader.LoadData<TourDaySeedModel>("tour-day.json");
        if (items is not { Count: > 0 })
        {
            return false;
        }

        var translationByDayId = items
            .Where(item => item.Translations is { Count: > 0 })
            .ToDictionary(item => item.Id, item => ToCaseInsensitiveDictionary(item.Translations));

        if (translationByDayId.Count == 0)
        {
            return false;
        }

        var targetIds = translationByDayId.Keys.ToHashSet();
        var persistedDays = context.TourDays
            .Where(day => targetIds.Contains(day.Id))
            .ToList();

        var changed = false;

        foreach (var day in persistedDays)
        {
            if (day.Translations.Count > 0)
            {
                continue;
            }

            if (!translationByDayId.TryGetValue(day.Id, out var translations) || translations.Count == 0)
            {
                continue;
            }

            day.Translations = new Dictionary<string, TourDayTranslationData>(translations, StringComparer.OrdinalIgnoreCase);
            changed = true;
        }

        return changed;
    }

    private static Dictionary<string, TourDayTranslationData> ToCaseInsensitiveDictionary(
        Dictionary<string, TourDayTranslationData>? translations)
    {
        return translations is { Count: > 0 }
            ? new Dictionary<string, TourDayTranslationData>(translations, StringComparer.OrdinalIgnoreCase)
            : new Dictionary<string, TourDayTranslationData>(StringComparer.OrdinalIgnoreCase);
    }

    private sealed class TourDaySeedModel
    {
        public Guid Id { get; set; }
        public Guid TourId { get; set; }
        public int DayNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Dictionary<string, TourDayTranslationData>? Translations { get; set; }
        public string? CreatedBy { get; set; }
        public DateTimeOffset CreatedOnUtc { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTimeOffset? LastModifiedOnUtc { get; set; }
    }
}
