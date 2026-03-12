using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class AdminDashboardRepositoryTests
{
    [Fact]
    public async Task GetDashboard_WhenDataExists_ShouldReturnPopulatedDashboardData()
    {
        await using var context = CreateContext();
        await SeedDashboardData(context);

        var repository = new AdminDashboardRepository(context);

        var result = await repository.GetDashboard();

        Assert.Equal(2, result.Stats.TotalBookings);
        Assert.Equal(1, result.Stats.ActiveTours);
        Assert.Equal(1, result.Stats.TotalCustomers);

        Assert.Equal(12, result.RevenueOverTime.Count);
        Assert.Equal(12, result.BookingTrend.Count);
        Assert.Equal(6, result.CustomerGrowth.Count);

        Assert.NotEmpty(result.TopTours);
        Assert.NotEmpty(result.TopDestinations);
        Assert.NotEmpty(result.Alerts);

        Assert.Equal(3, result.VisaSummary.TotalApplications);
        Assert.Equal(1, result.VisaSummary.Approved);
        Assert.Equal(1, result.VisaSummary.Rejected);

        var pendingStatus = result.VisaStatuses.FirstOrDefault(x => x.Label == "Pending");
        Assert.NotNull(pendingStatus);
        Assert.Equal(1, pendingStatus!.Count);
    }

    [Fact]
    public async Task GetDashboard_WhenNoData_ShouldReturnStableEmptyShape()
    {
        await using var context = CreateContext();
        var repository = new AdminDashboardRepository(context);

        var result = await repository.GetDashboard();

        Assert.Equal(0m, result.Stats.TotalRevenue);
        Assert.Equal(0, result.Stats.TotalBookings);
        Assert.Equal(0, result.Stats.TotalCustomers);

        Assert.Equal(12, result.RevenueOverTime.Count);
        Assert.Equal(12, result.BookingTrend.Count);
        Assert.Equal(6, result.CustomerGrowth.Count);

        Assert.Empty(result.TopTours);
        Assert.Empty(result.TopDestinations);
        Assert.NotEmpty(result.CustomerNationalities);

        Assert.Equal(0, result.VisaSummary.TotalApplications);
        Assert.Equal(4, result.VisaStatuses.Count);
    }

    private static async Task SeedDashboardData(AppDbContext context)
    {
        var now = DateTimeOffset.UtcNow;

        var user = new UserEntity
        {
            Id = Guid.CreateVersion7(),
            Username = "dashboard.user",
            FullName = "Dashboard User",
            Email = "dashboard@example.com",
            Status = UserStatus.Active,
            VerifyStatus = VerifyStatus.Verified,
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddMonths(-2),
            LastModifiedOnUtc = now.AddMonths(-2)
        };

        var tour = new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = "TOUR-SEED-001",
            TourName = "Japan Sakura Tour",
            ShortDescription = "Seeded tour",
            LongDescription = "Seeded long description",
            Status = TourStatus.Active,
            TourScope = TourScope.International,
            CustomerSegment = CustomerSegment.Group,
            Thumbnail = new ImageEntity(),
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddMonths(-3),
            LastModifiedOnUtc = now.AddMonths(-3)
        };

        var classification = new TourClassificationEntity
        {
            Id = Guid.CreateVersion7(),
            TourId = tour.Id,
            Tour = tour,
            Name = "Premium",
            AdultPrice = 1200m,
            ChildPrice = 900m,
            InfantPrice = 400m,
            Description = "Premium package",
            NumberOfDay = 5,
            NumberOfNight = 4,
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddMonths(-3),
            LastModifiedOnUtc = now.AddMonths(-3)
        };

        var tourInstance = new TourInstanceEntity
        {
            Id = Guid.CreateVersion7(),
            TourId = tour.Id,
            Tour = tour,
            ClassificationId = classification.Id,
            Classification = classification,
            TourInstanceCode = "TI-SEED-001",
            Title = "Japan Sakura Tour - March",
            TourName = tour.TourName,
            TourCode = tour.TourCode,
            ClassificationName = classification.Name,
            InstanceType = TourType.Public,
            Status = TourInstanceStatus.Confirmed,
            StartDate = now.AddDays(20),
            EndDate = now.AddDays(25),
            DurationDays = 6,
            MinParticipation = 5,
            MaxParticipation = 20,
            CurrentParticipation = 18,
            AdultPrice = 1200m,
            ChildPrice = 900m,
            InfantPrice = 400m,
            Location = "Tokyo, Japan",
            Thumbnail = new ImageEntity(),
            IncludedServices = [],
            Images = [],
            IsDeleted = false,
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddMonths(-2),
            LastModifiedOnUtc = now.AddMonths(-2)
        };

        var confirmedBooking = new BookingEntity
        {
            Id = Guid.CreateVersion7(),
            TourInstanceId = tourInstance.Id,
            TourInstance = tourInstance,
            UserId = user.Id,
            User = user,
            CustomerName = "Dashboard User",
            CustomerPhone = "0900000001",
            NumberAdult = 2,
            NumberChild = 0,
            NumberInfant = 0,
            TotalPrice = 2400m,
            PaymentMethod = PaymentMethod.BankTransfer,
            IsFullPay = true,
            Status = BookingStatus.Confirmed,
            BookingDate = now.AddDays(-10),
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddDays(-10),
            LastModifiedOnUtc = now.AddDays(-10)
        };

        var cancelledBooking = new BookingEntity
        {
            Id = Guid.CreateVersion7(),
            TourInstanceId = tourInstance.Id,
            TourInstance = tourInstance,
            CustomerName = "Cancelled Customer",
            CustomerPhone = "0900000002",
            NumberAdult = 1,
            NumberChild = 0,
            NumberInfant = 0,
            TotalPrice = 900m,
            PaymentMethod = PaymentMethod.Cash,
            IsFullPay = false,
            Status = BookingStatus.Cancelled,
            BookingDate = now.AddDays(-6),
            CancelledAt = now.AddDays(-5),
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddDays(-6),
            LastModifiedOnUtc = now.AddDays(-5)
        };

        //var payment = new CustomerPaymentEntity
        //{
        //    Id = Guid.CreateVersion7(),
        //    BookingId = confirmedBooking.Id,
        //    Booking = confirmedBooking,
        //    Amount = 2400m,
        //    PaymentMethod = PaymentMethod.BankTransfer,
        //    PaidAt = now.AddDays(-9),
        //    CreatedBy = "seed",
        //    LastModifiedBy = "seed",
        //    CreatedOnUtc = now.AddDays(-9),
        //    LastModifiedOnUtc = now.AddDays(-9)
        //};

        var pendingRequest = new TourRequestEntity
        {
            Id = Guid.CreateVersion7(),
            UserId = user.Id,
            User = user,
            CustomerName = "Dashboard User",
            CustomerPhone = "0900000001",
            CustomerEmail = "dashboard@example.com",
            Destination = "Japan",
            DepartureDate = now.AddDays(15),
            NumberAdult = 2,
            Status = TourRequestStatus.Pending,
            TourInstanceId = tourInstance.Id,
            TourInstance = tourInstance,
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddDays(-7),
            LastModifiedOnUtc = now.AddDays(-7)
        };

        var approvedRequest = new TourRequestEntity
        {
            Id = Guid.CreateVersion7(),
            CustomerName = "Approved Customer",
            CustomerPhone = "0900000003",
            Destination = "Korea",
            DepartureDate = now.AddDays(30),
            NumberAdult = 1,
            Status = TourRequestStatus.Approved,
            ReviewedAt = now.AddDays(-3),
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddDays(-10),
            LastModifiedOnUtc = now.AddDays(-3)
        };

        var rejectedRequest = new TourRequestEntity
        {
            Id = Guid.CreateVersion7(),
            CustomerName = "Rejected Customer",
            CustomerPhone = "0900000004",
            Destination = "Thailand",
            DepartureDate = now.AddDays(10),
            NumberAdult = 1,
            Status = TourRequestStatus.Rejected,
            ReviewedAt = now.AddDays(-2),
            CreatedBy = "seed",
            LastModifiedBy = "seed",
            CreatedOnUtc = now.AddDays(-11),
            LastModifiedOnUtc = now.AddDays(-2)
        };

        await context.Users.AddAsync(user);
        await context.Tours.AddAsync(tour);
        await context.TourClassifications.AddAsync(classification);
        await context.TourInstances.AddAsync(tourInstance);
        await context.Bookings.AddRangeAsync(confirmedBooking, cancelledBooking);
        //await context.CustomerPayments.AddAsync(payment);
        await context.TourRequests.AddRangeAsync(pendingRequest, approvedRequest, rejectedRequest);
        await context.SaveChangesAsync();
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"admin-dashboard-repo-{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(options);
    }
}
