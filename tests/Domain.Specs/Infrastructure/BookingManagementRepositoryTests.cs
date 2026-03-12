using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class BookingManagementRepositoryTests
{
    [Fact]
    public async Task BookingActivityReservationRepository_GetByBookingIdAsync_ShouldReturnOrderedActivities()
    {
        await using var context = CreateContext();
        var repository = new BookingActivityReservationRepository(context);
        var bookingId = Guid.CreateVersion7();

        var first = BookingActivityReservationEntity.Create(bookingId, 2, "Transport", "Second", "tester");
        var second = BookingActivityReservationEntity.Create(bookingId, 1, "Activity", "First", "tester");

        await context.Set<BookingActivityReservationEntity>().AddRangeAsync(first, second);
        await context.SaveChangesAsync();

        var result = await repository.GetByBookingIdAsync(bookingId);

        Assert.Equal(2, result.Count);
        Assert.Equal(1, result[0].Order);
        Assert.Equal(2, result[1].Order);
    }

    [Fact]
    public async Task SupplierPayableRepository_GetByBookingIdAsync_ShouldReturnMatchingRowsOnly()
    {
        await using var context = CreateContext();
        var repository = new SupplierPayableRepository(context);
        var bookingId = Guid.CreateVersion7();

        var payable1 = SupplierPayableEntity.Create(bookingId, Guid.CreateVersion7(), 100, "tester");
        var payable2 = SupplierPayableEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), 200, "tester");

        await context.Set<SupplierPayableEntity>().AddRangeAsync(payable1, payable2);
        await context.SaveChangesAsync();

        var result = await repository.GetByBookingIdAsync(bookingId);

        Assert.Single(result);
        Assert.Equal(bookingId, result[0].BookingId);
    }

    [Fact]
    public async Task SupplierReceiptRepository_GetBySupplierPayableIdAsync_ShouldReturnDescendingPaidAt()
    {
        await using var context = CreateContext();
        var repository = new SupplierReceiptRepository(context);
        var payableId = Guid.CreateVersion7();

        var older = SupplierReceiptEntity.Create(
            payableId,
            100,
            DateTimeOffset.UtcNow.AddDays(-2),
            PaymentMethod.Cash,
            "tester");

        var newer = SupplierReceiptEntity.Create(
            payableId,
            200,
            DateTimeOffset.UtcNow.AddDays(-1),
            PaymentMethod.BankTransfer,
            "tester");

        await context.Set<SupplierReceiptEntity>().AddRangeAsync(older, newer);
        await context.SaveChangesAsync();

        var result = await repository.GetBySupplierPayableIdAsync(payableId);

        Assert.Equal(2, result.Count);
        Assert.True(result[0].PaidAt >= result[1].PaidAt);
        Assert.Equal(200, result[0].Amount);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"booking-management-repo-{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(options);
    }
}
