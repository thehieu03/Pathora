using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingTourGuideContextSeed
{
    public static void SeedData(DbSet<BookingTourGuideEntity> bookingTourGuideCollection)
    {
        if (bookingTourGuideCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingTourGuideEntity>("booking-tour-guide.json");

        if (items is { Count: > 0 })
        {
            bookingTourGuideCollection.AddRange(items);
        }
    }
}
