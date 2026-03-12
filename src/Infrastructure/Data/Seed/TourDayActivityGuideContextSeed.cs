using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourDayActivityGuideContextSeed
{
    public static void SeedData(DbSet<TourDayActivityGuideEntity> tourDayActivityGuideCollection)
    {
        if (tourDayActivityGuideCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourDayActivityGuideEntity>("tour-day-activity-guide.json");

        if (items is { Count: > 0 })
        {
            tourDayActivityGuideCollection.AddRange(items);
        }
    }
}
