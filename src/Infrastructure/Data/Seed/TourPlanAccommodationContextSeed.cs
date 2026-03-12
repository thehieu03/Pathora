using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourPlanAccommodationContextSeed
{
    public static void SeedData(DbSet<TourPlanAccommodationEntity> tourplanaccommodationCollection)
    {
        if (tourplanaccommodationCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourPlanAccommodationEntity>("tour-plan-accommodation.json");

        if (items is { Count: > 0 })
        {
            tourplanaccommodationCollection.AddRange(items);
        }
    }
}
