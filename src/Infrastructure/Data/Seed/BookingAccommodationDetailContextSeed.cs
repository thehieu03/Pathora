using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingAccommodationDetailContextSeed
{
    public static void SeedData(DbSet<BookingAccommodationDetailEntity> bookingAccommodationDetailCollection)
    {
        if (bookingAccommodationDetailCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingAccommodationDetailEntity>("booking-accommodation-detail.json");

        if (items is { Count: > 0 })
        {
            bookingAccommodationDetailCollection.AddRange(items);
        }
    }
}
