using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class UserRoleContextSeed
{
    public static void SeedData(DbSet<UserRoleEntity> userroleCollection)
    {
        if (userroleCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<UserRoleEntity>("user-role.json");

        if (items is { Count: > 0 })
        {
            userroleCollection.AddRange(items);
        }
    }
}
