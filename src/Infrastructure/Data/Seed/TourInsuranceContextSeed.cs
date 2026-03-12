using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourInsuranceContextSeed
{
    public static void SeedData(DbSet<TourInsuranceEntity> tourinsuranceCollection)
    {
        if (tourinsuranceCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourInsuranceEntity>("tour-insurance.json");

        if (items is { Count: > 0 })
        {
            tourinsuranceCollection.AddRange(items);
        }
    }
}
