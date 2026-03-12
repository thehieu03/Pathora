using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourPlanLocationContextSeed
{
    public static void SeedData(DbSet<TourPlanLocationEntity> tourplanlocationCollection)
    {
        if (tourplanlocationCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourPlanLocationEntity>("tour-plan-location.json");

        if (items is { Count: > 0 })
        {
            var validItems = items
                .Where(item => item.TourDayActivityId != Guid.Empty)
                .ToList();

            if (validItems.Count > 0)
            {
                tourplanlocationCollection.AddRange(validItems);
            }
        }
    }
}
