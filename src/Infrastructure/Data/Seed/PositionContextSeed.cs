using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class PositionContextSeed
{
    public static void SeedData(DbSet<PositionEntity> positionCollection)
    {
        if (positionCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<PositionEntity>("position.json");

        if (items is { Count: > 0 })
        {
            positionCollection.AddRange(items);
        }
    }
}
