using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class PassportContextSeed
{
    public static void SeedData(DbSet<PassportEntity> passportCollection)
    {
        if (passportCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<PassportEntity>("passport.json");

        if (items is { Count: > 0 })
        {
            passportCollection.AddRange(items);
        }
    }
}
