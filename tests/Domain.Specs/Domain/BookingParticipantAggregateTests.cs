using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class BookingParticipantAggregateTests
{
    [Fact]
    public void ParticipantWithPassportAndVisaCreation_ShouldSetExpectedRelationships()
    {
        var participantId = Guid.CreateVersion7();
        var bookingId = Guid.CreateVersion7();

        var participant = BookingParticipantEntity.Create(
            bookingId,
            "Adult",
            "Nguyen Van A",
            "tester");

        var passport = PassportEntity.Create(
            participant.Id,
            "P123456",
            "tester",
            "VN",
            new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
            new DateTimeOffset(2030, 1, 1, 0, 0, 0, TimeSpan.Zero));

        var visaApplication = VisaApplicationEntity.Create(
            participant.Id,
            passport.Id,
            "JP",
            "tester");

        var visa = VisaEntity.Create(
            visaApplication.Id,
            "tester",
            visaNumber: "VISA-001",
            country: "JP",
            status: VisaStatus.Approved,
            entryType: VisaEntryType.Single,
            issuedAt: new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero),
            expiresAt: new DateTimeOffset(2026, 8, 1, 0, 0, 0, TimeSpan.Zero));

        Assert.NotEqual(Guid.Empty, participantId);
        Assert.Equal(bookingId, participant.BookingId);
        Assert.Equal(participant.Id, passport.BookingParticipantId);
        Assert.Equal(passport.Id, visaApplication.PassportId);
        Assert.Equal(visaApplication.Id, visa.VisaApplicationId);
    }
}
