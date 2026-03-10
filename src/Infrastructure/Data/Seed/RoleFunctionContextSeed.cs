using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class RoleFunctionContextSeed
{
    public static void SeedData(DbSet<RoleFunctionEntity> rolefunctionCollection)
    {
        if (rolefunctionCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<RoleFunctionEntity>("role-function.json");

        if (items is { Count: > 0 })
        {
            rolefunctionCollection.AddRange(items);
        }
    }
}
