using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class DynamicPricingTierContextSeed
{
    public static void SeedData(DbSet<DynamicPricingTierEntity> dynamicpricingtierCollection)
    {
        if (dynamicpricingtierCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<DynamicPricingTierEntity>("dynamic-pricing-tier.json");

        if (items is { Count: > 0 })
        {
            dynamicpricingtierCollection.AddRange(items);
        }
    }
}
