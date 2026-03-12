using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourGuideActivityStatusEntityTests
{
    [Fact]
    public void CreateTourGuide_ShouldSetExpectedDefaults()
    {
        var entity = TourGuideEntity.Create(
            fullName: "Guide One",
            licenseNumber: "LIC-001",
            performedBy: "tester",
            yearsOfExperience: 3,
            rating: 4.5m);

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal("Guide One", entity.FullName);
        Assert.Equal("LIC-001", entity.LicenseNumber);
        Assert.True(entity.IsAvailable);
        Assert.True(entity.IsActive);
        Assert.False(entity.IsDeleted);
    }

    [Fact]
    public void CreateBookingTourGuide_ShouldSetAssignmentFields()
    {
        var bookingId = Guid.CreateVersion7();
        var userId = Guid.CreateVersion7();
        var tourGuideId = Guid.CreateVersion7();

        var entity = BookingTourGuideEntity.Create(
            bookingId,
            userId,
            AssignedRole.TourGuide,
            performedBy: "tester",
            tourGuideId: tourGuideId,
            isLead: true,
            assignedBy: Guid.CreateVersion7(),
            note: "assigned");

        Assert.Equal(bookingId, entity.BookingId);
        Assert.Equal(userId, entity.UserId);
        Assert.Equal(tourGuideId, entity.TourGuideId);
        Assert.Equal(AssignedRole.TourGuide, entity.AssignedRole);
        Assert.True(entity.IsLead);
        Assert.Equal(AssignmentStatus.Assigned, entity.Status);
    }

    [Fact]
    public void CreateTourDayActivityStatus_ShouldStartInNotStarted()
    {
        var bookingId = Guid.CreateVersion7();
        var tourDayId = Guid.CreateVersion7();

        var entity = TourDayActivityStatusEntity.Create(bookingId, tourDayId, "tester", "note");

        Assert.Equal(bookingId, entity.BookingId);
        Assert.Equal(tourDayId, entity.TourDayId);
        Assert.Equal(ActivityStatus.NotStarted, entity.ActivityStatus);
        Assert.Equal("note", entity.Note);
    }

    [Fact]
    public void StartAndComplete_ShouldTransitionFromNotStartedToCompleted()
    {
        var entity = TourDayActivityStatusEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), "tester");
        var startAt = DateTimeOffset.UtcNow.AddMinutes(-30);
        var endAt = DateTimeOffset.UtcNow;

        entity.Start("operator", startAt);
        entity.Complete("operator", endAt, Guid.CreateVersion7());

        Assert.Equal(ActivityStatus.Completed, entity.ActivityStatus);
        Assert.Equal(startAt, entity.ActualStartTime);
        Assert.Equal(endAt, entity.ActualEndTime);
        Assert.NotNull(entity.CompletedAt);
    }

    [Fact]
    public void Cancel_ShouldAllowNotStartedAndInProgressOnly()
    {
        var notStarted = TourDayActivityStatusEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), "tester");
        notStarted.Cancel("weather", "operator");
        Assert.Equal(ActivityStatus.Cancelled, notStarted.ActivityStatus);

        var inProgress = TourDayActivityStatusEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), "tester");
        inProgress.Start("operator");
        inProgress.Cancel("incident", "operator");
        Assert.Equal(ActivityStatus.Cancelled, inProgress.ActivityStatus);

        var completed = TourDayActivityStatusEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), "tester");
        completed.Start("operator");
        completed.Complete("operator");

        Assert.Throws<InvalidOperationException>(() => completed.Cancel("late", "operator"));
    }
}
