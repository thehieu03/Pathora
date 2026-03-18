using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Domain.Entities.Translations;
using Infrastructure.Data;

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

    public static bool SeedData(AppDbContext context)
    {
        var hasChanges = false;

        hasChanges |= SeedRoles(context);
        hasChanges |= SeedUsers(context);
        hasChanges |= SeedUserRoles(context);
        hasChanges |= SeedTours(context);
        hasChanges |= SeedTourClassifications(context);
        hasChanges |= SeedTourDays(context);
        hasChanges |= SeedTourInstances(context);
        hasChanges |= SeedSuppliers(context);
        hasChanges |= SeedTourGuides(context);
        hasChanges |= SeedBookings(context);
        hasChanges |= SeedBookingActivityReservations(context);
        hasChanges |= SeedBookingTransportDetails(context);
        hasChanges |= SeedBookingAccommodationDetails(context);
        hasChanges |= SeedBookingParticipants(context);
        hasChanges |= SeedPassports(context);
        hasChanges |= SeedVisaApplications(context);
        hasChanges |= SeedVisas(context);
        hasChanges |= SeedBookingTourGuides(context);
        hasChanges |= SeedSupplierPayables(context);
        hasChanges |= SeedSupplierReceipts(context);
        hasChanges |= SeedTourDayActivityStatuses(context);
        hasChanges |= SeedTourDayActivityGuides(context);
        hasChanges |= SeedCustomerDeposits(context);
        hasChanges |= SeedCustomerPayments(context);
        hasChanges |= SeedReviews(context);
        hasChanges |= SeedPricingPolicies(context);
        hasChanges |= SeedTaxConfigs(context);

        hasChanges |= BackfillTourDayTranslations(context);
        hasChanges |= BackfillTourInstanceTranslations(context);

        return hasChanges;
    }

    private static bool SeedRoles(AppDbContext context)
    {
        if (context.Roles.Any()) return false;

        var data = SeedDataLoader.LoadData<RoleEntity>("role.json");
        if (data is { Count: > 0 })
        {
            context.Roles.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedUsers(AppDbContext context)
    {
        if (context.Users.Any()) return false;

        var data = SeedDataLoader.LoadData<UserEntity>("user.json");
        if (data is { Count: > 0 })
        {
            context.Users.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedUserRoles(AppDbContext context)
    {
        if (context.UserRoles.Any()) return false;

        var data = SeedDataLoader.LoadData<UserRoleEntity>("user-role.json");
        if (data is { Count: > 0 })
        {
            context.UserRoles.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTours(AppDbContext context)
    {
        if (context.Tours.Any()) return false;

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
            return true;
        }

        return false;
    }

    private static bool SeedTourClassifications(AppDbContext context)
    {
        if (context.TourClassifications.Any()) return false;

        var data = SeedDataLoader.LoadData<TourClassificationEntity>("tour-classification.json");
        if (data is { Count: > 0 })
        {
            context.TourClassifications.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTourDays(AppDbContext context)
    {
        if (context.TourDays.Any()) return false;

        var data = SeedDataLoader.LoadData<TourDayEntity>("tour-day.json");
        if (data is { Count: > 0 })
        {
            var dayToTourMap = LoadTourDayToTourMap();
            var classificationByTour = context.TourClassifications
                .AsNoTracking()
                .ToList()
                .GroupBy(x => x.TourId)
                .ToDictionary(g => g.Key, g => g.OrderBy(x => x.Id).First().Id);

            foreach (var day in data)
            {
                if (day.ClassificationId is not null && day.ClassificationId != Guid.Empty)
                {
                    continue;
                }

                if (dayToTourMap.TryGetValue(day.Id, out var tourId)
                    && classificationByTour.TryGetValue(tourId, out var classificationId))
                {
                    day.ClassificationId = classificationId;
                }
            }

            context.TourDays.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static Dictionary<Guid, Guid> LoadTourDayToTourMap()
    {
        var mapping = new Dictionary<Guid, Guid>();
        var filePath = SeedDataLoader.ResolveSeedFilePath("tour-day.json");

        if (!File.Exists(filePath))
        {
            return mapping;
        }

        using var jsonDocument = JsonDocument.Parse(File.ReadAllText(filePath));
        var root = jsonDocument.RootElement;
        if (root.ValueKind != JsonValueKind.Array)
        {
            return mapping;
        }

        foreach (var item in root.EnumerateArray())
        {
            if (!item.TryGetProperty("Id", out var idProperty)
                || !item.TryGetProperty("TourId", out var tourIdProperty))
            {
                continue;
            }

            if (Guid.TryParse(idProperty.GetString(), out var dayId)
                && Guid.TryParse(tourIdProperty.GetString(), out var tourId))
            {
                mapping[dayId] = tourId;
            }
        }

        return mapping;
    }

    private static bool SeedTourInstances(AppDbContext context)
    {
        if (context.TourInstances.Any()) return false;

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
            return true;
        }

        return false;
    }

    private static bool SeedSuppliers(AppDbContext context)
    {
        if (context.Suppliers.Any()) return false;

        var data = SeedDataLoader.LoadData<SupplierEntity>("supplier.json");
        if (data is { Count: > 0 })
        {
            context.Suppliers.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTourGuides(AppDbContext context)
    {
        if (context.TourGuides.Any()) return false;

        var data = SeedDataLoader.LoadData<TourGuideEntity>("tour-guide.json");
        if (data is { Count: > 0 })
        {
            context.TourGuides.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookings(AppDbContext context)
    {
        if (context.Bookings.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingEntity>("booking.json");
        if (data is { Count: > 0 })
        {
            context.Bookings.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookingActivityReservations(AppDbContext context)
    {
        if (context.BookingActivityReservations.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingActivityReservationEntity>("booking-activity-reservation.json");
        if (data is { Count: > 0 })
        {
            context.BookingActivityReservations.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookingTransportDetails(AppDbContext context)
    {
        if (context.BookingTransportDetails.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingTransportDetailEntity>("booking-transport-detail.json");
        if (data is { Count: > 0 })
        {
            context.BookingTransportDetails.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookingAccommodationDetails(AppDbContext context)
    {
        if (context.BookingAccommodationDetails.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingAccommodationDetailEntity>("booking-accommodation-detail.json");
        if (data is { Count: > 0 })
        {
            context.BookingAccommodationDetails.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookingParticipants(AppDbContext context)
    {
        if (context.BookingParticipants.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingParticipantEntity>("booking-participant.json");
        if (data is { Count: > 0 })
        {
            context.BookingParticipants.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedPassports(AppDbContext context)
    {
        if (context.Passports.Any()) return false;

        var data = SeedDataLoader.LoadData<PassportEntity>("passport.json");
        if (data is { Count: > 0 })
        {
            context.Passports.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedVisaApplications(AppDbContext context)
    {
        if (context.VisaApplications.Any()) return false;

        var data = SeedDataLoader.LoadData<VisaApplicationEntity>("visa-application.json");
        if (data is { Count: > 0 })
        {
            context.VisaApplications.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedVisas(AppDbContext context)
    {
        if (context.Visas.Any()) return false;

        var data = SeedDataLoader.LoadData<VisaEntity>("visa.json");
        if (data is { Count: > 0 })
        {
            context.Visas.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedBookingTourGuides(AppDbContext context)
    {
        if (context.BookingTourGuides.Any()) return false;

        var data = SeedDataLoader.LoadData<BookingTourGuideEntity>("booking-tour-guide.json");
        if (data is { Count: > 0 })
        {
            context.BookingTourGuides.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedSupplierPayables(AppDbContext context)
    {
        if (context.SupplierPayables.Any()) return false;

        var data = SeedDataLoader.LoadData<SupplierPayableEntity>("supplier-payable.json");
        if (data is { Count: > 0 })
        {
            context.SupplierPayables.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedSupplierReceipts(AppDbContext context)
    {
        if (context.SupplierReceipts.Any()) return false;

        var data = SeedDataLoader.LoadData<SupplierReceiptEntity>("supplier-receipt.json");
        if (data is { Count: > 0 })
        {
            context.SupplierReceipts.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTourDayActivityStatuses(AppDbContext context)
    {
        if (context.TourDayActivityStatuses.Any()) return false;

        var data = SeedDataLoader.LoadData<TourDayActivityStatusEntity>("tour-day-activity-status.json");
        if (data is { Count: > 0 })
        {
            context.TourDayActivityStatuses.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTourDayActivityGuides(AppDbContext context)
    {
        if (context.TourDayActivityGuides.Any()) return false;

        var data = SeedDataLoader.LoadData<TourDayActivityGuideEntity>("tour-day-activity-guide.json");
        if (data is { Count: > 0 })
        {
            context.TourDayActivityGuides.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedCustomerDeposits(AppDbContext context)
    {
        if (context.CustomerDeposits.Any()) return false;

        var data = SeedDataLoader.LoadData<CustomerDepositEntity>("customer-deposit.json");
        if (data is { Count: > 0 })
        {
            context.CustomerDeposits.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedCustomerPayments(AppDbContext context)
    {
        if (context.CustomerPayments.Any()) return false;

        var data = SeedDataLoader.LoadData<CustomerPaymentEntity>("customer-payment.json");
        if (data is { Count: > 0 })
        {
            context.CustomerPayments.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedReviews(AppDbContext context)
    {
        if (context.Reviews.Any()) return false;

        var data = SeedDataLoader.LoadData<ReviewEntity>("review.json");
        if (data is { Count: > 0 })
        {
            context.Reviews.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool BackfillTourDayTranslations(AppDbContext context)
    {
        var existingTourDays = context.TourDays.ToList();
        if (existingTourDays.Count == 0)
        {
            return false;
        }

        var seedTourDays = SeedDataLoader.LoadData<TourDayEntity>("tour-day.json");
        if (seedTourDays is not { Count: > 0 })
        {
            return false;
        }

        var seedById = seedTourDays.ToDictionary(x => x.Id);
        var hasChanges = false;

        foreach (var day in existingTourDays)
        {
            if (!seedById.TryGetValue(day.Id, out var seedDay))
            {
                continue;
            }

            day.Translations ??= [];

            hasChanges |= EnsureTourDayTranslation(day, seedDay, "vi");
            hasChanges |= EnsureTourDayTranslation(day, seedDay, "en");
        }

        if (hasChanges)
        {
            context.SaveChanges();
        }

        return hasChanges;
    }

    private static bool BackfillTourInstanceTranslations(AppDbContext context)
    {
        var existingInstances = context.TourInstances.ToList();
        if (existingInstances.Count == 0)
        {
            return false;
        }

        var seedInstances = SeedDataLoader.LoadData<TourInstanceEntity>("tour-instance.json");
        if (seedInstances is not { Count: > 0 })
        {
            return false;
        }

        var seedById = seedInstances.ToDictionary(x => x.Id);
        var hasChanges = false;

        foreach (var instance in existingInstances)
        {
            if (!seedById.TryGetValue(instance.Id, out var seedInstance))
            {
                continue;
            }

            instance.Translations ??= [];

            hasChanges |= EnsureTourInstanceTranslation(instance, seedInstance, "vi");
            hasChanges |= EnsureTourInstanceTranslation(instance, seedInstance, "en");
        }

        if (hasChanges)
        {
            context.SaveChanges();
        }

        return hasChanges;
    }

    private static bool EnsureTourDayTranslation(TourDayEntity target, TourDayEntity seeded, string language)
    {
        if (target.Translations.ContainsKey(language))
        {
            return false;
        }

        var translation = BuildTourDayTranslation(seeded, language)
            ?? BuildTourDayTranslation(seeded, language == "vi" ? "en" : "vi")
            ?? new TourDayTranslationData
            {
                Title = target.Title,
                Description = target.Description
            };

        target.Translations[language] = translation;
        return true;
    }

    private static bool EnsureTourInstanceTranslation(TourInstanceEntity target, TourInstanceEntity seeded, string language)
    {
        if (target.Translations.ContainsKey(language))
        {
            return false;
        }

        var translation = BuildTourInstanceTranslation(seeded, language)
            ?? BuildTourInstanceTranslation(seeded, language == "vi" ? "en" : "vi")
            ?? new TourInstanceTranslationData
            {
                Title = target.Title,
                Location = target.Location,
                IncludedServices = [.. target.IncludedServices],
                CancellationReason = target.CancellationReason
            };

        target.Translations[language] = translation;
        return true;
    }

    private static TourDayTranslationData? BuildTourDayTranslation(TourDayEntity source, string language)
    {
        if (source.Translations.TryGetValue(language, out var translation))
        {
            return new TourDayTranslationData
            {
                Title = translation.Title,
                Description = translation.Description
            };
        }

        return null;
    }

    private static TourInstanceTranslationData? BuildTourInstanceTranslation(TourInstanceEntity source, string language)
    {
        if (source.Translations.TryGetValue(language, out var translation))
        {
            return new TourInstanceTranslationData
            {
                Title = translation.Title,
                Location = translation.Location,
                IncludedServices = [.. translation.IncludedServices],
                CancellationReason = translation.CancellationReason
            };
        }

        return null;
    }

    private static bool SeedPricingPolicies(AppDbContext context)
    {
        if (context.PricingPolicies.Any()) return false;

        var data = SeedDataLoader.LoadData<PricingPolicy>("pricing-policy.json");
        if (data is { Count: > 0 })
        {
            context.PricingPolicies.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }

    private static bool SeedTaxConfigs(AppDbContext context)
    {
        if (context.TaxConfigs.Any()) return false;

        var data = SeedDataLoader.LoadData<TaxConfigEntity>("tax-config.json");
        if (data is { Count: > 0 })
        {
            context.TaxConfigs.AddRange(data);
            context.SaveChanges();
            return true;
        }

        return false;
    }
}
