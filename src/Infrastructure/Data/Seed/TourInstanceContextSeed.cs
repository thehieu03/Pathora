using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourInstanceContextSeed
{
    public static void SeedData(DbSet<TourInstanceEntity> tourinstanceCollection)
    {
        if (tourinstanceCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourInstanceEntity>("tour-instance.json");

        if (items is { Count: > 0 })
        {
            tourinstanceCollection.AddRange(items);
        }
    }
}
