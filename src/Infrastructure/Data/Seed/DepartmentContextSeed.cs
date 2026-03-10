using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class DepartmentContextSeed
{
    public static void SeedData(DbSet<DepartmentEntity> departmentCollection)
    {
        if (departmentCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<DepartmentEntity>("department.json");

        if (items is { Count: > 0 })
        {
            departmentCollection.AddRange(items);
        }
    }
}
