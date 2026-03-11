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
}
