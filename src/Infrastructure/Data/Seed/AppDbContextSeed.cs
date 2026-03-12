using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class AppDbContextSeed
{
    public static async Task<bool> SeedIfNeededAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        // Check if full seed data already exists by verifying a late-batch table.
        // This prevents partial-batch failures from being treated as "fully seeded".
        //var hasFullSeedData = await context.CustomerPayments.AsNoTracking().AnyAsync(cancellationToken);

        var hasBackfilledTourDayTranslations = TourDayContextSeed.BackfillTranslations(context);
        var hasBackfilledTourInstanceTranslations = TourInstanceContextSeed.BackfillTranslations(context);

        if (hasBackfilledTourDayTranslations || hasBackfilledTourInstanceTranslations)
        {
            await SaveChangesUtcAsync(context, cancellationToken);
        }

        //if (hasFullSeedData)
        //{
        //    return hasBackfilledTourDayTranslations || hasBackfilledTourInstanceTranslations;
        //}

        // ── Batch 1: Core entities (no FK dependencies) ──
        RoleContextSeed.SeedData(context.Roles);
        FunctionContextSeed.SeedData(context.Functions);
        DepartmentContextSeed.SeedData(context.Departments);
        PositionContextSeed.SeedData(context.Positions);
        UserContextSeed.SeedData(context.Users);
        TourContextSeed.SeedData(context.Tours);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 2: Entities depending on Batch 1 (Users, Roles, Tours) ──
        UserRoleContextSeed.SeedData(context.UserRoles);

        var hasAnyFunctions = await context.Functions.AsNoTracking().AnyAsync(cancellationToken);
        if (hasAnyFunctions)
        {
            RoleFunctionContextSeed.SeedData(context.RoleFunctions);
        }

        TourClassificationContextSeed.SeedData(context.TourClassifications);
        TourDayContextSeed.SeedData(context);
        TourInsuranceContextSeed.SeedData(context.TourInsurances);
        TourPlanAccommodationContextSeed.SeedData(context.TourPlanAccommodations);
        TourPlanLocationContextSeed.SeedData(context.TourPlanLocations);
        TourPlanRouteContextSeed.SeedData(context.TourPlanRoutes);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 3: TourDayActivities (depends on TourDays) + TourInstances (depends on Tours, Classifications) ──
        TourDayActivityContextSeed.SeedData(context.TourDayActivities);
        TourInstanceContextSeed.SeedData(context.TourInstances);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 4: Tour requests (depends on TourInstances and Users) ──
        TourRequestContextSeed.SeedData(context);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 5: Entities depending on TourInstances / TourRequests ──
        DynamicPricingTierContextSeed.SeedData(context.TourInstancePricingTiers);
        BookingContextSeed.SeedData(context.Bookings);
        ReviewContextSeed.SeedData(context.Reviews);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 6: Entities depending on Bookings ──

        await SaveChangesUtcAsync(context, cancellationToken);

        return true;
    }

    private static async Task SaveChangesUtcAsync(AppDbContext context, CancellationToken cancellationToken)
    {
        NormalizeDateTimeOffsetValuesToUtc(context);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static void NormalizeDateTimeOffsetValuesToUtc(AppDbContext context)
    {
        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.State is not EntityState.Added and not EntityState.Modified)
            {
                continue;
            }

            foreach (var property in entry.Properties)
            {
                if (property.Metadata.ClrType == typeof(DateTimeOffset) && property.CurrentValue is DateTimeOffset value)
                {
                    property.CurrentValue = value.ToUniversalTime();
                }

                if (property.Metadata.ClrType == typeof(DateTimeOffset?) && property.CurrentValue is DateTimeOffset nullableValue)
                {
                    property.CurrentValue = nullableValue.ToUniversalTime();
                }
            }
        }
    }
}
