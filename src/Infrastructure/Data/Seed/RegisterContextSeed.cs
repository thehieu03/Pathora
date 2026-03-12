using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class RegisterContextSeed
{
    public static void SeedData(DbSet<RegisterEntity> registerCollection)
    {
        if (registerCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<RegisterEntity>("register.json");

        if (items is { Count: > 0 })
        {
            registerCollection.AddRange(items);
        }
    }
}
