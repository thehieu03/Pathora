using Application.Features.BookingManagement.Activity;
using Application.Features.BookingManagement.Participant;
using Application.Features.BookingManagement.Payable;
using Domain.Enums;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class BookingManagementValidatorsTests
{
    [Fact]
    public void TransportValidator_WhenArrivalNotAfterDeparture_ShouldHaveError()
    {
        var validator = new TransportDetailValidator();
        var departure = new DateTimeOffset(2026, 7, 1, 8, 0, 0, TimeSpan.Zero);
        var command = new CreateTransportDetailCommand(
            Guid.CreateVersion7(),
            null,
            TransportType.Airplane,
            departure,
            departure,
            null,
            null,
            null,
            10,
            null,
            null,
            100,
            10,
            true,
            null,
            null,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.ArrivalAt);
    }

    [Fact]
    public void AccommodationValidator_WhenCheckoutNotAfterCheckin_ShouldHaveError()
    {
        var validator = new AccommodationDetailValidator();
        var checkIn = new DateTimeOffset(2026, 7, 1, 14, 0, 0, TimeSpan.Zero);
        var command = new CreateAccommodationDetailCommand(
            Guid.CreateVersion7(),
            null,
            "Hotel A",
            RoomType.Double,
            1,
            null,
            null,
            null,
            checkIn,
            checkIn,
            200,
            10,
            true,
            null,
            null,
            null,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.CheckOutAt);
    }

    [Fact]
    public void AccommodationValidator_WhenRoomCountNotPositive_ShouldHaveError()
    {
        var validator = new AccommodationDetailValidator();
        var command = new CreateAccommodationDetailCommand(
            Guid.CreateVersion7(),
            null,
            "Hotel A",
            RoomType.Double,
            0,
            null,
            null,
            null,
            null,
            null,
            200,
            10,
            true,
            null,
            null,
            null,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.RoomCount);
    }

    [Fact]
    public void PassportValidator_WhenExpiryNotAfterIssue_ShouldHaveError()
    {
        var validator = new PassportValidator();
        var issuedAt = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);
        var command = new CreatePassportCommand(
            Guid.CreateVersion7(),
            "P123456",
            "VN",
            issuedAt,
            issuedAt,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.ExpiresAt);
    }

    [Fact]
    public void VisaApplicationValidator_WhenDestinationMissing_ShouldHaveError()
    {
        var validator = new VisaApplicationValidator();
        var command = new CreateVisaApplicationCommand(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            string.Empty,
            null,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.DestinationCountry);
    }

    [Fact]
    public void SupplierPayableValidator_WhenPaidGreaterThanExpected_ShouldHaveError()
    {
        var validator = new SupplierPayableValidator();
        var command = new UpdateSupplierPayableCommand(
            Guid.CreateVersion7(),
            100,
            120,
            null,
            null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x);
    }
}
