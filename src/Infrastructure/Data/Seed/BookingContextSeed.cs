using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class BookingContextSeed
{
    public static void SeedData(DbSet<BookingEntity> bookingCollection)
    {
        if (bookingCollection.Any())
        {
            return;
        }

        var items = SeedDataLoader.LoadData<BookingEntity>("booking.json");

        if (items is { Count: > 0 })
        {
            bookingCollection.AddRange(items);
        }
    }

    public static void SeedData(AppDbContext context)
    {
        SeedRoles(context);
        SeedUsers(context);
        SeedUserRoles(context);
        SeedTours(context);
        SeedTourClassifications(context);
        SeedTourInstances(context);
        SeedBookings(context);
        SeedReviews(context);
    }

    private static void SeedRoles(AppDbContext context)
    {
        if (context.Roles.Any()) return;

        var data = SeedDataLoader.LoadData<RoleEntity>("role.json");
        if (data is { Count: > 0 })
        {
            context.Roles.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedUsers(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var data = SeedDataLoader.LoadData<UserEntity>("user.json");
        if (data is { Count: > 0 })
        {
            context.Users.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedUserRoles(AppDbContext context)
    {
        if (context.UserRoles.Any()) return;

        var data = SeedDataLoader.LoadData<UserRoleEntity>("user-role.json");
        if (data is { Count: > 0 })
        {
            context.UserRoles.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedTours(AppDbContext context)
    {
        if (context.Tours.Any()) return;

        var data = SeedDataLoader.LoadData<TourEntity>("tour.json");
        if (data is { Count: > 0 })
        {
            foreach (var tour in data)
            {
                if (tour.Thumbnail == null)
                {
                    tour.Thumbnail = new ImageEntity();
                }
            }
            context.Tours.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedTourClassifications(AppDbContext context)
    {
        if (context.TourClassifications.Any()) return;

        var data = SeedDataLoader.LoadData<TourClassificationEntity>("tour-classification.json");
        if (data is { Count: > 0 })
        {
            context.TourClassifications.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedTourInstances(AppDbContext context)
    {
        if (context.TourInstances.Any()) return;

        var data = SeedDataLoader.LoadData<TourInstanceEntity>("tour-instance.json");
        if (data is { Count: > 0 })
        {
            foreach (var instance in data)
            {
                if (instance.Thumbnail == null)
                {
                    instance.Thumbnail = new ImageEntity();
                }
            }
            context.TourInstances.AddRange(data);
            context.SaveChanges();
        }
    }

    private static void SeedBookings(AppDbContext context)
    {
        if (context.Bookings.Any()) return;

        var data = SeedDataLoader.LoadData<BookingEntity>("booking.json");
        if (data is { Count: > 0 })
        {
            context.Bookings.AddRange(data);
            context.SaveChanges();
        }
    }
    private static void SeedReviews(AppDbContext context)
    {
        if (context.Reviews.Any()) return;

        var data = SeedDataLoader.LoadData<ReviewEntity>("review.json");
        if (data is { Count: > 0 })
        {
            context.Reviews.AddRange(data);
            context.SaveChanges();
        }
    }
}
