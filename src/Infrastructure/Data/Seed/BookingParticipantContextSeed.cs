using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingParticipantContextSeed
{
    public static void SeedData(DbSet<BookingParticipantEntity> bookingParticipantCollection)
    {
        if (bookingParticipantCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingParticipantEntity>("booking-participant.json");

        if (items is { Count: > 0 })
        {
            bookingParticipantCollection.AddRange(items);
        }
    }
}
