using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class SupplierContextSeed
{
    public static void SeedData(DbSet<SupplierEntity> supplierCollection)
    {
        if (supplierCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<SupplierEntity>("supplier.json");

        if (items is { Count: > 0 })
        {
            supplierCollection.AddRange(items);
        }
    }
}
