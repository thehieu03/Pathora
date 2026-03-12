using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class SupplierReceiptContextSeed
{
    public static void SeedData(DbSet<SupplierReceiptEntity> supplierReceiptCollection)
    {
        if (supplierReceiptCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<SupplierReceiptEntity>("supplier-receipt.json");

        if (items is { Count: > 0 })
        {
            supplierReceiptCollection.AddRange(items);
        }
    }
}
