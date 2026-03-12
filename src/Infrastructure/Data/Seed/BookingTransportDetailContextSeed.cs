using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingTransportDetailContextSeed
{
    public static void SeedData(DbSet<BookingTransportDetailEntity> bookingTransportDetailCollection)
    {
        if (bookingTransportDetailCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingTransportDetailEntity>("booking-transport-detail.json");

        if (items is { Count: > 0 })
        {
            bookingTransportDetailCollection.AddRange(items);
        }
    }
}
