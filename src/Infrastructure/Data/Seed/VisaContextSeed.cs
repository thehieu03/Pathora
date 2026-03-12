using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class VisaContextSeed
{
    public static void SeedData(DbSet<VisaEntity> visaCollection)
    {
        if (visaCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<VisaEntity>("visa.json");

        if (items is { Count: > 0 })
        {
            visaCollection.AddRange(items);
        }
    }
}
