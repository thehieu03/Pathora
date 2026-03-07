using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class OtpRepositoryTests
{
    [Fact]
    public async Task Upsert_WhenOtpExists_ShouldRotateCodeWithoutThrowingAndKeepSingleRow()
    {
        await using var context = CreateContext();
        var repository = new OtpRepository(context);
        var email = "user@example.com";

        await repository.Upsert(OtpEntity.Create(email, "111111", DateTimeOffset.UtcNow.AddMinutes(5)));

        var exception = await Record.ExceptionAsync(() =>
            repository.Upsert(OtpEntity.Create(email, "222222", DateTimeOffset.UtcNow.AddMinutes(10))));

        Assert.Null(exception);

        var rows = await context.Set<OtpEntity>().Where(o => o.Email == email).ToListAsync();
        Assert.Single(rows);
        Assert.Equal("222222", rows[0].Code);
    }

    [Fact]
    public async Task FindByEmail_WhenOtpExpired_ShouldReturnNull()
    {
        await using var context = CreateContext();
        var repository = new OtpRepository(context);
        var email = "expired@example.com";

        await context.Set<OtpEntity>().AddAsync(
            OtpEntity.Create(email, "999999", DateTimeOffset.UtcNow.AddMinutes(-1)));
        await context.SaveChangesAsync();

        var result = await repository.FindByEmail(email);

        Assert.False(result.IsError);
        Assert.Null(result.Value);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"otp-tests-{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(options);
    }
}
