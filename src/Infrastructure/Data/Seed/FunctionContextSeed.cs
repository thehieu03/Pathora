using Domain.Constant;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class FunctionContextSeed
{
    public static void SeedData(DbSet<Function> functionCollection)
    {
        if (functionCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<Function>("function.json");

        if (items is { Count: > 0 })
        {
            functionCollection.AddRange(items);
        }
    }
}
