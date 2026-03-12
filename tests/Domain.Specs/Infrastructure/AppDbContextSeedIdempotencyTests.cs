using Infrastructure.Data;
using Infrastructure.Data.Seed;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class AppDbContextSeedIdempotencyTests
{
    [Fact]
    public async Task SeedIfNeededAsync_WhenCalledTwice_ShouldSeedOnlyOnce()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-idempotent-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);

        var firstRunSeeded = await AppDbContextSeed.SeedIfNeededAsync(dbContext);
        var toursAfterFirstRun = await dbContext.Tours.AsNoTracking().CountAsync();

        var secondRunSeeded = await AppDbContextSeed.SeedIfNeededAsync(dbContext);
        var toursAfterSecondRun = await dbContext.Tours.AsNoTracking().CountAsync();

        Assert.True(firstRunSeeded);
        Assert.False(secondRunSeeded);
        Assert.True(toursAfterFirstRun > 0);
        Assert.Equal(toursAfterFirstRun, toursAfterSecondRun);
    }

    [Fact]
    public async Task SeedIfNeededAsync_WhenTourDayTranslationsAreMissing_ShouldBackfillTranslations()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-tourday-translation-backfill-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);
        await AppDbContextSeed.SeedIfNeededAsync(dbContext);

        var dayId = Guid.Parse("019527d0-0001-7000-8000-000000000001");
        var day = await dbContext.TourDays.FirstAsync(x => x.Id == dayId);
        day.Translations.Clear();
        await dbContext.SaveChangesAsync();

        var backfilled = await AppDbContextSeed.SeedIfNeededAsync(dbContext);
        var refreshedDay = await dbContext.TourDays.AsNoTracking().FirstAsync(x => x.Id == dayId);

        Assert.True(backfilled);
        Assert.NotEmpty(refreshedDay.Translations);
        Assert.True(refreshedDay.Translations.ContainsKey("vi"));
        Assert.True(refreshedDay.Translations.ContainsKey("en"));
    }

    [Fact]
    public async Task SeedIfNeededAsync_WhenSeedingTourDays_ShouldIncludeViAndEnTranslationsForEachDay()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-tourday-translations-complete-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);
        await AppDbContextSeed.SeedIfNeededAsync(dbContext);

        var days = await dbContext.TourDays.AsNoTracking().ToListAsync();

        Assert.NotEmpty(days);
        Assert.DoesNotContain(days, day =>
            day.Translations.Count == 0
            || !day.Translations.ContainsKey("vi")
            || !day.Translations.ContainsKey("en"));
    }

    [Fact]
    public async Task SeedIfNeededAsync_WhenTourInstanceTranslationsAreMissing_ShouldBackfillTranslations()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-tourinstance-translation-backfill-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);
        await AppDbContextSeed.SeedIfNeededAsync(dbContext);

        var instanceId = Guid.Parse("019527e0-0000-7000-8000-000000000001");
        var instance = await dbContext.TourInstances.FirstAsync(x => x.Id == instanceId);
        instance.Translations.Clear();
        await dbContext.SaveChangesAsync();

        var backfilled = await AppDbContextSeed.SeedIfNeededAsync(dbContext);
        var refreshedInstance = await dbContext.TourInstances.AsNoTracking().FirstAsync(x => x.Id == instanceId);

        Assert.True(backfilled);
        Assert.NotEmpty(refreshedInstance.Translations);
        Assert.True(refreshedInstance.Translations.ContainsKey("vi"));
        Assert.True(refreshedInstance.Translations.ContainsKey("en"));
    }

    [Fact]
    public async Task SeedIfNeededAsync_WhenSeedingTourInstances_ShouldIncludeViAndEnTranslationsForEachInstance()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-tourinstance-translations-complete-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);
        await AppDbContextSeed.SeedIfNeededAsync(dbContext);

        var instances = await dbContext.TourInstances.AsNoTracking().ToListAsync();

        Assert.NotEmpty(instances);
        Assert.DoesNotContain(instances, instance =>
            instance.Translations.Count == 0
            || !instance.Translations.ContainsKey("vi")
            || !instance.Translations.ContainsKey("en"));
    }

    [Fact]
    public async Task SeedIfNeededAsync_WhenExtendedOperationalSeedsExist_ShouldPopulateOperationalTables()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"seed-operational-entities-{Guid.NewGuid():N}")
            .Options;

        await using var dbContext = new AppDbContext(options);
        await AppDbContextSeed.SeedIfNeededAsync(dbContext);

        Assert.NotEmpty(await dbContext.Suppliers.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.TourGuides.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.BookingActivityReservations.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.BookingParticipants.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.BookingTourGuides.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.BookingTransportDetails.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.BookingAccommodationDetails.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.Passports.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.VisaApplications.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.Visas.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.SupplierPayables.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.SupplierReceipts.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.TourDayActivityStatuses.AsNoTracking().ToListAsync());
        Assert.NotEmpty(await dbContext.TourDayActivityGuides.AsNoTracking().ToListAsync());
    }
}
