using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class OtpContextSeed
{
    public static void SeedData(DbSet<OtpEntity> otpCollection)
    {
        if (otpCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<OtpEntity>("otp.json");

        if (items is { Count: > 0 })
        {
            otpCollection.AddRange(items);
        }
    }
}
