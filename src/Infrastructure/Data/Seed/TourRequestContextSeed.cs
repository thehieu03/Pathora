using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourRequestContextSeed
{
    public static void SeedData(DbSet<TourRequestEntity> tourrequestCollection)
    {
        if (tourrequestCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourRequestEntity>("tour-request.json");

        if (items is { Count: > 0 })
        {
            tourrequestCollection.AddRange(items);
        }
    }
}
