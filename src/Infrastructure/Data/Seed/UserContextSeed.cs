using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class UserContextSeed
{
    public static void SeedData(DbSet<UserEntity> userCollection)
    {
        if (userCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<UserEntity>("user.json");

        if (items is { Count: > 0 })
        {
            userCollection.AddRange(items);
        }
    }
}
