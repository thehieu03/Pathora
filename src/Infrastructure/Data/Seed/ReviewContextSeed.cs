using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class ReviewContextSeed
{
    public static void SeedData(DbSet<ReviewEntity> reviewCollection)
    {
        if (reviewCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<ReviewEntity>("review.json");

        if (items is { Count: > 0 })
        {
            reviewCollection.AddRange(items);
        }
    }
}
