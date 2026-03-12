using Api.Controllers;
using Application.Contracts.Booking;
using Application.Features.BookingManagement.ActivityStatus;
using Application.Features.BookingManagement.TourGuide;
using Contracts.ModelResponse;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Domain.Specs.Api;

public sealed class TourGuideActivityStatusApiControllerTests
{
    [Fact]
    public async Task GetAvailableTourGuides_WhenQuerySucceeds_ShouldCaptureAvailabilityFilter()
    {
        var dto = new TourGuideDto(
            Guid.CreateVersion7(),
            "Guide One",
            null,
            null,
            null,
            null,
            null,
            null,
            "LIC-001",
            null,
            "vi,en",
            "culture",
            null,
            3,
            4.5m,
            true,
            true,
            null);

        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourGuideController, GetTourGuidesQuery, List<TourGuideDto>>(
                new List<TourGuideDto> { dto },
                "/api/tour-guides/available");

        var actionResult = await controller.GetAvailableTourGuides("vi", "culture");

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour-guides/available",
            expectedData: new List<TourGuideDto> { dto });

        Assert.Equal(new GetTourGuidesQuery(true, "vi", "culture"), probe.CapturedRequest);
    }

    [Fact]
    public async Task StartActivity_WhenCommandSucceeds_ShouldMapRouteAndBodyIntoCommand()
    {
        var bookingId = Guid.CreateVersion7();
        var tourDayId = Guid.CreateVersion7();
        var actualTime = DateTimeOffset.UtcNow;

        var (controller, probe) = ApiControllerTestHelper
            .BuildController<BookingManagementController, StartActivityCommand, Success>(
                Result.Success,
                $"/api/bookings/{bookingId}/activity-statuses/{tourDayId}/start");

        var actionResult = await controller.StartActivity(
            bookingId,
            tourDayId,
            new UpdateActivityStatusDto(actualTime, null, null));

        var objectResult = Assert.IsType<ObjectResult>(actionResult);
        Assert.Equal(StatusCodes.Status200OK, objectResult.StatusCode);
        Assert.IsType<ResultSharedResponse<ApiUpdatedResponse<Success>>>(objectResult.Value);

        Assert.Equal(new StartActivityCommand(bookingId, tourDayId, actualTime), probe.CapturedRequest);
    }

    [Fact]
    public async Task AssignTeamMember_WhenCommandSucceeds_ShouldMapAssignmentPayload()
    {
        var bookingId = Guid.CreateVersion7();
        var assignmentId = Guid.CreateVersion7();
        var request = new AssignTeamMemberDto(
            Guid.CreateVersion7(),
            AssignedRole.TourGuide,
            true,
            Guid.CreateVersion7(),
            "lead");

        var (controller, probe) = ApiControllerTestHelper
            .BuildController<BookingManagementController, AssignTourGuideToBookingCommand, Guid>(
                assignmentId,
                $"/api/bookings/{bookingId}/team");

        var actionResult = await controller.AssignTeamMember(bookingId, request);

        var objectResult = Assert.IsType<ObjectResult>(actionResult);
        Assert.Equal(StatusCodes.Status201Created, objectResult.StatusCode);

        var payload = Assert.IsType<ResultSharedResponse<ApiCreatedResponse<Guid>>>(objectResult.Value);
        Assert.Equal(assignmentId, payload.Data?.Value);

        var captured = Assert.IsType<AssignTourGuideToBookingCommand>(probe.CapturedRequest);
        Assert.Equal(bookingId, captured.BookingId);
        Assert.Equal(request.UserId, captured.UserId);
        Assert.Equal(request.AssignedRole, captured.AssignedRole);
        Assert.Equal(request.TourGuideId, captured.TourGuideId);
        Assert.True(captured.IsLead);
    }
}
