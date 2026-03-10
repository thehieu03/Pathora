using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class RefreshTokenContextSeed
{
    public static void SeedData(DbSet<RefreshTokenEntity> refreshtokenCollection)
    {
        if (refreshtokenCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<RefreshTokenEntity>("refresh-token.json");

        if (items is { Count: > 0 })
        {
            refreshtokenCollection.AddRange(items);
        }
    }
}
