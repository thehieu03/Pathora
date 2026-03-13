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

        if (hasFullSeedData)
        {
            return false;
        }

        SeedDataPreflightValidator.ValidateRequiredSeedFiles();

        // Use the consolidated BookingContextSeed which handles all entity seeding
        BookingContextSeed.SeedData(context);

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
