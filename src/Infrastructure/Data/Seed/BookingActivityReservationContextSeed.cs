using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingActivityReservationContextSeed
{
    public static void SeedData(DbSet<BookingActivityReservationEntity> bookingActivityReservationCollection)
    {
        if (bookingActivityReservationCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingActivityReservationEntity>("booking-activity-reservation.json");

        if (items is { Count: > 0 })
        {
            bookingActivityReservationCollection.AddRange(items);
        }
    }
}
