using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class TourPlanRouteContextSeed
{
    public static void SeedData(DbSet<TourPlanRouteEntity> tourplanrouteCollection)
    {
        if (tourplanrouteCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<TourPlanRouteEntity>("tour-plan-route.json");

        if (items is { Count: > 0 })
        {
            tourplanrouteCollection.AddRange(items);
        }
    }
}
