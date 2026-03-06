using Application.Features.Tour.Commands;
using Application.Services;
using Domain.Enums;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class TourCommandHandlerTests
{
    // ── Create ──────────────────────────────────────────────

    [Fact]
    public async Task CreateHandler_ShouldDelegateToTourService()
    {
        var tourService = Substitute.For<ITourService>();
        var expectedId = Guid.CreateVersion7();
        tourService.Create(Arg.Any<CreateTourCommand>()).Returns(expectedId);

        var handler = new CreateTourCommandHandler(tourService);
        var command = new CreateTourCommand(
            "Tour Đà Nẵng", "Short desc", "Long desc", "SEO", "SEO desc", TourStatus.Active);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expectedId, result.Value);
        await tourService.Received(1).Create(command);
    }

    // ── Delete ──────────────────────────────────────────────

    [Fact]
    public async Task DeleteHandler_ShouldDelegateToTourService()
    {
        var tourService = Substitute.For<ITourService>();
        var tourId = Guid.CreateVersion7();
        tourService.Delete(tourId).Returns(Result.Success);

        var handler = new DeleteTourCommandHandler(tourService);
        var result = await handler.Handle(
            new DeleteTourCommand(tourId), CancellationToken.None);

        Assert.False(result.IsError);
        await tourService.Received(1).Delete(tourId);
    }

    [Fact]
    public async Task DeleteHandler_WhenNotFound_ShouldPropagateError()
    {
        var tourService = Substitute.For<ITourService>();
        var tourId = Guid.CreateVersion7();
        tourService.Delete(tourId)
            .Returns(Error.NotFound("Tour.NotFound", "Not found"));

        var handler = new DeleteTourCommandHandler(tourService);
        var result = await handler.Handle(
            new DeleteTourCommand(tourId), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }
}
