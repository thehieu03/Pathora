using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class AppDbContextSeed
{
    public static async Task<bool> SeedIfNeededAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        // Check if full seed data already exists by verifying late-batch tables.
        // This prevents partial-batch failures from being treated as "fully seeded".
        var hasFullSeedData = await context.Set<CustomerPaymentEntity>().AsNoTracking().AnyAsync(cancellationToken)
            && await context.Set<VisaEntity>().AsNoTracking().AnyAsync(cancellationToken)
            && await context.Set<TourDayActivityGuideEntity>().AsNoTracking().AnyAsync(cancellationToken);

        var hasBackfilledTourDayTranslations = TourDayContextSeed.BackfillTranslations(context);
        var hasBackfilledTourInstanceTranslations = TourInstanceContextSeed.BackfillTranslations(context);

        if (hasBackfilledTourDayTranslations || hasBackfilledTourInstanceTranslations)
        {
            await SaveChangesUtcAsync(context, cancellationToken);
        }

        if (hasFullSeedData)
        {
            return hasBackfilledTourDayTranslations || hasBackfilledTourInstanceTranslations;
        }

        SeedDataPreflightValidator.ValidateRequiredSeedFiles();

        // ── Batch 1: Core entities (no FK dependencies) ──
        RoleContextSeed.SeedData(context.Set<RoleEntity>());
        FunctionContextSeed.SeedData(context.Set<Domain.Constant.Function>());
        DepartmentContextSeed.SeedData(context.Set<DepartmentEntity>());
        PositionContextSeed.SeedData(context.Set<PositionEntity>());
        SupplierContextSeed.SeedData(context.Set<SupplierEntity>());
        UserContextSeed.SeedData(context.Set<UserEntity>());
        TourContextSeed.SeedData(context.Set<TourEntity>());
        TourGuideContextSeed.SeedData(context.Set<TourGuideEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 2: Entities depending on Batch 1 (Users, Roles, Tours) ──
        UserRoleContextSeed.SeedData(context.Set<UserRoleEntity>());

        var hasAnyFunctions = await context.Set<Domain.Constant.Function>().AsNoTracking().AnyAsync(cancellationToken);
        if (hasAnyFunctions)
        {
            RoleFunctionContextSeed.SeedData(context.Set<RoleFunctionEntity>());
        }

        TourClassificationContextSeed.SeedData(context.Set<TourClassificationEntity>());
        TourDayContextSeed.SeedData(context);
        TourInsuranceContextSeed.SeedData(context.Set<TourInsuranceEntity>());
        TourPlanAccommodationContextSeed.SeedData(context.Set<TourPlanAccommodationEntity>());
        TourPlanLocationContextSeed.SeedData(context.Set<TourPlanLocationEntity>());
        TourPlanRouteContextSeed.SeedData(context.Set<TourPlanRouteEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 3: TourDayActivities (depends on TourDays) + TourInstances (depends on Tours, Classifications) ──
        TourDayActivityContextSeed.SeedData(context.Set<TourDayActivityEntity>());
        TourInstanceContextSeed.SeedData(context.Set<TourInstanceEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 4: Tour requests (depends on TourInstances and Users) ──
        TourRequestContextSeed.SeedData(context);
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 5: Entities depending on TourInstances / TourRequests ──
        DynamicPricingTierContextSeed.SeedData(context.Set<DynamicPricingTierEntity>());
        BookingContextSeed.SeedData(context.Set<BookingEntity>());
        ReviewContextSeed.SeedData(context.Set<ReviewEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 6: Payment entities depending on Bookings ──
        CustomerDepositContextSeed.SeedData(context.Set<CustomerDepositEntity>());
        CustomerPaymentContextSeed.SeedData(context.Set<CustomerPaymentEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 7: Operational entities depending on Bookings/TourDays/TourGuides ──
        BookingActivityReservationContextSeed.SeedData(context.Set<BookingActivityReservationEntity>());
        BookingParticipantContextSeed.SeedData(context.Set<BookingParticipantEntity>());
        BookingTourGuideContextSeed.SeedData(context.Set<BookingTourGuideEntity>());
        TourDayActivityStatusContextSeed.SeedData(context.Set<TourDayActivityStatusEntity>());
        SupplierPayableContextSeed.SeedData(context.Set<SupplierPayableEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 8: Entities depending on operational reservations/participants/payables ──
        BookingTransportDetailContextSeed.SeedData(context.Set<BookingTransportDetailEntity>());
        BookingAccommodationDetailContextSeed.SeedData(context.Set<BookingAccommodationDetailEntity>());
        PassportContextSeed.SeedData(context.Set<PassportEntity>());
        SupplierReceiptContextSeed.SeedData(context.Set<SupplierReceiptEntity>());
        await SaveChangesUtcAsync(context, cancellationToken);

        // ── Batch 9: Visa and activity-guide entities depending on previous batches ──
        VisaApplicationContextSeed.SeedData(context.Set<VisaApplicationEntity>());
        VisaContextSeed.SeedData(context.Set<VisaEntity>());
        TourDayActivityGuideContextSeed.SeedData(context.Set<TourDayActivityGuideEntity>());
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
