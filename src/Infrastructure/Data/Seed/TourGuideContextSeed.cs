using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourGuideContextSeed
{
    public static void SeedData(DbSet<TourGuideEntity> tourGuideCollection)
    {
        if (tourGuideCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourGuideEntity>("tour-guide.json");

        if (items is { Count: > 0 })
        {
            tourGuideCollection.AddRange(items);
        }
    }
}
