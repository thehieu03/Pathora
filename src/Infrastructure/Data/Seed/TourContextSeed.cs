using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourContextSeed
{
    public static void SeedData(DbSet<TourEntity> tourCollection)
    {
        if (tourCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourEntity>("tour.json");

        if (items is { Count: > 0 })
        {
            tourCollection.AddRange(items);
        }
    }
}
