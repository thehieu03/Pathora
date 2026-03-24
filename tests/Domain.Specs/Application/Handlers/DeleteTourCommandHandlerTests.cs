using Application.Common.Constant;
using Application.Features.Tour.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;
using Application.Dtos;

namespace Domain.Specs.Application.Handlers;

public class DeleteTourCommandHandlerTests
{
    private readonly ITourService _tourService = Substitute.For<ITourService>();
    private readonly DeleteTourCommandHandler _handler;

    public DeleteTourCommandHandlerTests()
    {
        _handler = new DeleteTourCommandHandler(_tourService);
    }

    #region TC01: Delete Existing Tour - Normal

    [Fact]
    public async Task Handle_TC01_ExistingTour_ShouldReturnSuccess()
    {
        var tourId = Guid.NewGuid();
        _tourService.Delete(tourId).Returns(Result.Success);

        var command = new DeleteTourCommand(tourId);
        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        await _tourService.Received(1).Delete(tourId);
    }

    #endregion

    #region TC02: Delete Non-Existent Tour - Abnormal

    [Fact]
    public async Task Handle_TC02_NonExistentTour_ShouldReturnNotFound()
    {
        var tourId = Guid.NewGuid();
        var notFoundError = Error.NotFound(ErrorConstants.Tour.NotFoundCode, ErrorConstants.Tour.NotFoundDescription);
        _tourService.Delete(tourId).Returns(notFoundError);

        var command = new DeleteTourCommand(tourId);
        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorType.NotFound, result.FirstError.Type);
    }

    #endregion

    #region TC03: Delete Tour - Service Throws Unexpected Error - Abnormal

    [Fact]
    public async Task Handle_TC03_ServiceThrowsUnexpected_ShouldPropagateException()
    {
        var tourId = Guid.NewGuid();
        _tourService.Delete(tourId).Returns(Task.FromException<ErrorOr.ErrorOr<ErrorOr.Success>>(new InvalidOperationException("Database error")));

        var command = new DeleteTourCommand(tourId);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));
    }

    #endregion
}
