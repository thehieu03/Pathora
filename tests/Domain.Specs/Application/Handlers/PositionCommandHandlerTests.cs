using Application.Contracts.Position;
using Application.Features.Position.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class PositionCommandHandlerTests
{
    // ── Create ──────────────────────────────────────────────

    [Fact]
    public async Task CreateHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IPositionService>();
        service.CreateAsync(Arg.Any<CreatePositionRequest>()).Returns(Result.Success);

        var handler = new CreatePositionCommandHandler(service);
        var result = await handler.Handle(
            new CreatePositionCommand("Manager", 1, "Note", 0),
            CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).CreateAsync(
            Arg.Is<CreatePositionRequest>(r =>
                r.Name == "Manager" && r.Level == 1));
    }

    [Fact]
    public async Task CreateHandler_WhenServiceReturnsError_ShouldPropagate()
    {
        var service = Substitute.For<IPositionService>();
        service.CreateAsync(Arg.Any<CreatePositionRequest>())
            .Returns(Error.Conflict("Position.Conflict", "Already exists"));

        var handler = new CreatePositionCommandHandler(service);
        var result = await handler.Handle(
            new CreatePositionCommand("Duplicate", 1, null, null),
            CancellationToken.None);

        Assert.True(result.IsError);
    }

    // ── Delete ──────────────────────────────────────────────

    [Fact]
    public async Task DeleteHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IPositionService>();
        var id = Guid.CreateVersion7();
        service.DeleteAsync(id).Returns(Result.Success);

        var handler = new DeletePositionCommandHandler(service);
        var result = await handler.Handle(
            new DeletePositionCommand(id), CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).DeleteAsync(id);
    }

    [Fact]
    public async Task DeleteHandler_WhenNotFound_ShouldPropagateError()
    {
        var service = Substitute.For<IPositionService>();
        var id = Guid.CreateVersion7();
        service.DeleteAsync(id)
            .Returns(Error.NotFound("Position.NotFound", "Not found"));

        var handler = new DeletePositionCommandHandler(service);
        var result = await handler.Handle(
            new DeletePositionCommand(id), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Position.NotFound", result.FirstError.Code);
    }
}
