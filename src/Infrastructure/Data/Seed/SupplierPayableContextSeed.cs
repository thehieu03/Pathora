using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class SupplierPayableContextSeed
{
    public static void SeedData(DbSet<SupplierPayableEntity> supplierPayableCollection)
    {
        if (supplierPayableCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<SupplierPayableEntity>("supplier-payable.json");

        if (items is { Count: > 0 })
        {
            supplierPayableCollection.AddRange(items);
        }
    }
}
