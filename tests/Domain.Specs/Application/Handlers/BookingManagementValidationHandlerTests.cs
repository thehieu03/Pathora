using Application.Features.BookingManagement.Participant;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class BookingManagementValidationHandlerTests
{
    [Fact]
    public async Task CreateParticipant_WhenSeatCapacityExceeded_ShouldReturnValidationError()
    {
        var bookingRepository = Substitute.For<IBookingRepository>();
        var bookingParticipantRepository = Substitute.For<IBookingParticipantRepository>();
        var bookingActivityReservationRepository = Substitute.For<IBookingActivityReservationRepository>();
        var bookingTransportDetailRepository = Substitute.For<IBookingTransportDetailRepository>();
        var bookingAccommodationDetailRepository = Substitute.For<IBookingAccommodationDetailRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        var booking = BookingEntity.Create(
            Guid.CreateVersion7(),
            "Customer",
            "0900000000",
            1,
            100,
            PaymentMethod.Cash,
            true,
            "tester");

        var existingParticipant = BookingParticipantEntity.Create(
            booking.Id,
            "Adult",
            "Existing Participant",
            "tester");

        var activity = BookingActivityReservationEntity.Create(
            booking.Id,
            1,
            "Transport",
            "Flight",
            "tester");

        var transportDetail = BookingTransportDetailEntity.Create(
            activity.Id,
            TransportType.Airplane,
            "tester",
            seatCapacity: 1);

        bookingRepository.GetByIdAsync(booking.Id).Returns(booking);
        bookingParticipantRepository.GetByBookingIdAsync(booking.Id).Returns(new List<BookingParticipantEntity> { existingParticipant });
        bookingActivityReservationRepository.GetByBookingIdAsync(booking.Id).Returns(new List<BookingActivityReservationEntity> { activity });
        bookingTransportDetailRepository.GetByBookingActivityReservationIdAsync(activity.Id).Returns(new List<BookingTransportDetailEntity> { transportDetail });
        bookingAccommodationDetailRepository.GetByBookingActivityReservationIdAsync(activity.Id).Returns(new List<BookingAccommodationDetailEntity>());

        var handler = new CreateParticipantCommandHandler(
            bookingRepository,
            bookingParticipantRepository,
            bookingActivityReservationRepository,
            bookingTransportDetailRepository,
            bookingAccommodationDetailRepository,
            unitOfWork);

        var command = new CreateParticipantCommand(
            booking.Id,
            "Adult",
            "New Participant",
            null,
            null,
            null);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Booking.SeatCapacityExceeded", result.FirstError.Code);
    }

    [Fact]
    public async Task CreatePassport_WhenExpiryBeforeTourStart_ShouldReturnValidationError()
    {
        var bookingParticipantRepository = Substitute.For<IBookingParticipantRepository>();
        var bookingRepository = Substitute.For<IBookingRepository>();
        var passportRepository = Substitute.For<IPassportRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        var booking = BookingEntity.Create(
            Guid.CreateVersion7(),
            "Customer",
            "0900000000",
            1,
            100,
            PaymentMethod.Cash,
            true,
            "tester");

        booking.TourInstance = new TourInstanceEntity
        {
            StartDate = DateTimeOffset.UtcNow.AddDays(10)
        };

        var participant = BookingParticipantEntity.Create(
            booking.Id,
            "Adult",
            "Participant",
            "tester");

        bookingParticipantRepository.GetByIdAsync(participant.Id).Returns(participant);
        bookingRepository.GetByIdAsync(booking.Id).Returns(booking);
        passportRepository.GetByBookingParticipantIdAsync(participant.Id).Returns((PassportEntity?)null);

        var handler = new CreatePassportCommandHandler(
            bookingParticipantRepository,
            bookingRepository,
            passportRepository,
            unitOfWork);

        var command = new CreatePassportCommand(
            participant.Id,
            "P123456",
            "VN",
            DateTimeOffset.UtcNow,
            DateTimeOffset.UtcNow.AddDays(5),
            null);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Passport.ExpiryBeforeTourStart", result.FirstError.Code);
    }

    [Fact]
    public async Task UpdateVisaApplication_WhenApproveAfterTourStart_ShouldReturnValidationError()
    {
        var visaApplicationRepository = Substitute.For<IVisaApplicationRepository>();
        var bookingParticipantRepository = Substitute.For<IBookingParticipantRepository>();
        var bookingRepository = Substitute.For<IBookingRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        var booking = BookingEntity.Create(
            Guid.CreateVersion7(),
            "Customer",
            "0900000000",
            1,
            100,
            PaymentMethod.Cash,
            true,
            "tester");

        booking.TourInstance = new TourInstanceEntity
        {
            StartDate = DateTimeOffset.UtcNow.AddDays(-1)
        };

        var participant = BookingParticipantEntity.Create(
            booking.Id,
            "Adult",
            "Participant",
            "tester");

        var visaApplication = VisaApplicationEntity.Create(
            participant.Id,
            Guid.CreateVersion7(),
            "JP",
            "tester");

        visaApplicationRepository.GetByIdAsync(visaApplication.Id).Returns(visaApplication);
        bookingParticipantRepository.GetByIdAsync(participant.Id).Returns(participant);
        bookingRepository.GetByIdAsync(booking.Id).Returns(booking);

        var handler = new UpdateVisaApplicationCommandHandler(
            visaApplicationRepository,
            bookingParticipantRepository,
            bookingRepository,
            unitOfWork);

        var command = new UpdateVisaApplicationCommand(
            visaApplication.Id,
            "JP",
            VisaStatus.Approved,
            null,
            null,
            null);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("VisaApplication.ApprovalTooLate", result.FirstError.Code);
    }
}
