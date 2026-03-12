using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class VisaApplicationContextSeed
{
    public static void SeedData(DbSet<VisaApplicationEntity> visaApplicationCollection)
    {
        if (visaApplicationCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<VisaApplicationEntity>("visa-application.json");

        if (items is { Count: > 0 })
        {
            visaApplicationCollection.AddRange(items);
        }
    }
}
