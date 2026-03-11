using Domain.Entities;
using Domain.Entities.Translations;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourInstanceContextSeed
{
    public static void SeedData(DbSet<TourInstanceEntity> tourinstanceCollection)
    {
        if (tourinstanceCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourInstanceEntity>("tour-instance.json");

        if (items is { Count: > 0 })
        {
            foreach (var item in items)
            {
                item.Translations = BuildTranslations(item);
            }

            tourinstanceCollection.AddRange(items);
        }
    }

    public static bool BackfillTranslations(AppDbContext context)
    {
        var instances = context.TourInstances.ToList();
        var changed = false;

        foreach (var instance in instances)
        {
            var translations = BuildTranslations(instance);
            if (AreEquivalent(instance.Translations, translations))
            {
                continue;
            }

            instance.Translations = translations;
            changed = true;
        }

        return changed;
    }

    private static Dictionary<string, TourInstanceTranslationData> BuildTranslations(TourInstanceEntity instance)
    {
        var translations = instance.Translations is { Count: > 0 }
            ? new Dictionary<string, TourInstanceTranslationData>(instance.Translations, StringComparer.OrdinalIgnoreCase)
            : new Dictionary<string, TourInstanceTranslationData>(StringComparer.OrdinalIgnoreCase);

        translations.TryAdd("vi", CreateTranslationPayload(instance));
        translations.TryAdd("en", CreateTranslationPayload(instance));

        return translations;
    }

    private static TourInstanceTranslationData CreateTranslationPayload(TourInstanceEntity instance)
    {
        return new TourInstanceTranslationData
        {
            Title = instance.Title,
            Location = instance.Location,
            IncludedServices = [.. instance.IncludedServices],
            CancellationReason = instance.CancellationReason
        };
    }

    private static bool AreEquivalent(
        Dictionary<string, TourInstanceTranslationData> left,
        Dictionary<string, TourInstanceTranslationData> right)
    {
        if (left.Count != right.Count)
        {
            return false;
        }

        foreach (var (key, value) in right)
        {
            if (!left.TryGetValue(key, out var current))
            {
                return false;
            }

            if (!IsEquivalent(current, value))
            {
                return false;
            }
        }

        return true;
    }

    private static bool IsEquivalent(TourInstanceTranslationData left, TourInstanceTranslationData right)
    {
        if (!string.Equals(left.Title, right.Title, StringComparison.Ordinal))
        {
            return false;
        }

        if (!string.Equals(left.Location, right.Location, StringComparison.Ordinal))
        {
            return false;
        }

        if (!string.Equals(left.CancellationReason, right.CancellationReason, StringComparison.Ordinal))
        {
            return false;
        }

        if (left.IncludedServices.Count != right.IncludedServices.Count)
        {
            return false;
        }

        for (var i = 0; i < left.IncludedServices.Count; i++)
        {
            if (!string.Equals(left.IncludedServices[i], right.IncludedServices[i], StringComparison.Ordinal))
            {
                return false;
            }
        }

        return true;
    }
}
