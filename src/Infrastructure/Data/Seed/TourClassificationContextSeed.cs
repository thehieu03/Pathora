using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourClassificationContextSeed
{
    public static void SeedData(DbSet<TourClassificationEntity> tourclassificationCollection)
    {
        if (tourclassificationCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourClassificationEntity>("tour-classification.json");

        if (items is { Count: > 0 })
        {
            tourclassificationCollection.AddRange(items);
        }
    }
}
