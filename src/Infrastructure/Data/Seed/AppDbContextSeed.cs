using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class AppDbContextSeed
{
    public static async Task<bool> SeedIfNeededAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        // Check if full seed data already exists by verifying Tours table
        // (DbUp only seeds admin user/role, NOT tours — so Tours is the reliable indicator)
        var hasFullSeedData = await context.Tours.AsNoTracking().AnyAsync(cancellationToken);

        if (hasFullSeedData)
        {
            return false;
        }

        // ── Batch 1: Core entities (no FK dependencies) ──
        RoleContextSeed.SeedData(context.Roles);
        DepartmentContextSeed.SeedData(context.Departments);
        PositionContextSeed.SeedData(context.Positions);
        UserContextSeed.SeedData(context.Users);
        TourContextSeed.SeedData(context.Tours);
        await context.SaveChangesAsync(cancellationToken);

        // ── Batch 2: Entities depending on Batch 1 (Users, Roles, Tours) ──
        UserRoleContextSeed.SeedData(context.UserRoles);
        RoleFunctionContextSeed.SeedData(context.RoleFunctions);
        TourClassificationContextSeed.SeedData(context.TourClassifications);
        TourDayContextSeed.SeedData(context.TourDays);
        TourInsuranceContextSeed.SeedData(context.TourInsurances);
        TourPlanAccommodationContextSeed.SeedData(context.TourPlanAccommodations);
        TourPlanLocationContextSeed.SeedData(context.TourPlanLocations);
        TourPlanRouteContextSeed.SeedData(context.TourPlanRoutes);
        TourRequestContextSeed.SeedData(context.TourRequests);
        await context.SaveChangesAsync(cancellationToken);

        // ── Batch 3: TourDayActivities (depends on TourDays) + TourInstances (depends on Tours, Classifications) ──
        TourDayActivityContextSeed.SeedData(context.TourDayActivities);
        TourInstanceContextSeed.SeedData(context.TourInstances);
        await context.SaveChangesAsync(cancellationToken);

        // ── Batch 4: Entities depending on TourInstances ──
        DynamicPricingTierContextSeed.SeedData(context.TourInstancePricingTiers);
        BookingContextSeed.SeedData(context.Bookings);
        ReviewContextSeed.SeedData(context.Reviews);
        await context.SaveChangesAsync(cancellationToken);

        // ── Batch 5: Entities depending on Bookings ──
        CustomerDepositContextSeed.SeedData(context.CustomerDeposits);
        CustomerPaymentContextSeed.SeedData(context.CustomerPayments);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
