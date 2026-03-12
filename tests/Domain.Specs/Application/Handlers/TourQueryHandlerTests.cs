using Contracts;
using Application.Contracts.Role;
using Application.Dtos;
using Application.Features.Tour.Queries;
using Application.Services;
using Domain.Enums;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class TourQueryHandlerTests
{
    // ── GetAll ──────────────────────────────────────────────

    [Fact]
    public async Task GetAllHandler_ShouldDelegateToTourService()
    {
        var tourService = Substitute.For<ITourService>();
        var tours = new List<TourVm>
        {
            new(
                Guid.CreateVersion7(),
                "TOUR-001",
                "Tour Đà Nẵng",
                "Short",
                "Active",
                null,
                DateTimeOffset.UtcNow)
        };
        var payload = new PaginatedList<TourVm>(1, tours);
        tourService.GetAll(Arg.Any<GetAllToursQuery>()).Returns(payload);

        var handler = new GetAllToursQueryHandler(tourService);
        var query = new GetAllToursQuery("Đà Nẵng", 1, 10);
        var result = await handler.Handle(query, CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        await tourService.Received(1).GetAll(query);
    }

    // ── GetDetail ───────────────────────────────────────────

    [Fact]
    public async Task GetDetailHandler_ShouldDelegateToTourService()
    {
        var tourService = Substitute.For<ITourService>();
        var tourId = Guid.CreateVersion7();
        var expected = new TourDto(
            tourId, "TOUR-001", "Tour", "Short", "Long",
            TourStatus.Active, null, null, false,
            new ImageDto(null, null, null, null), [], [],
            "admin", DateTimeOffset.UtcNow, null, null);
        tourService.GetDetail(tourId).Returns(expected);

        var handler = new GetTourDetailQueryHandler(tourService);
        var result = await handler.Handle(
            new GetTourDetailQuery(tourId), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await tourService.Received(1).GetDetail(tourId);
    }

    [Fact]
    public async Task GetDetailHandler_WhenNotFound_ShouldPropagateError()
    {
        var tourService = Substitute.For<ITourService>();
        var tourId = Guid.CreateVersion7();
        tourService.GetDetail(tourId)
            .Returns(Error.NotFound("Tour.NotFound", "Not found"));

        var handler = new GetTourDetailQueryHandler(tourService);
        var result = await handler.Handle(
            new GetTourDetailQuery(tourId), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }
}
