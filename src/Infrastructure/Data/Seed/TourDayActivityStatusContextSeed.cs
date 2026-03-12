using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayActivityStatusContextSeed
{
    public static void SeedData(DbSet<TourDayActivityStatusEntity> tourDayActivityStatusCollection)
    {
        if (tourDayActivityStatusCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDayActivityStatusEntity>("tour-day-activity-status.json");

        if (items is { Count: > 0 })
        {
            tourDayActivityStatusCollection.AddRange(items);
        }
    }
}
