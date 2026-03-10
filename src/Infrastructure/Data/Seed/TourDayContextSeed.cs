using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayContextSeed
{
    public static void SeedData(DbSet<TourDayEntity> tourdayCollection)
    {
        if (tourdayCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDayEntity>("tour-day.json");

        if (items is { Count: > 0 })
        {
            tourdayCollection.AddRange(items);
        }
    }
}
