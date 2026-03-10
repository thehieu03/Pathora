using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class RoleContextSeed
{
    public static void SeedData(DbSet<RoleEntity> roleCollection)
    {
        if (roleCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<RoleEntity>("role.json");

        if (items is { Count: > 0 })
        {
            roleCollection.AddRange(items);
        }
    }
}
