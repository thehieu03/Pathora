using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayActivityContextSeed
{
    public static void SeedData(DbSet<TourDayActivityEntity> tourdayactivityCollection)
    {
        if (tourdayactivityCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDayActivityEntity>("tour-day-activity.json");

        if (items is { Count: > 0 })
        {
            tourdayactivityCollection.AddRange(items);
        }
    }
}
