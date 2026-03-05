using Application.Contracts.User;
using Application.Features.User.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class UserCommandHandlerTests
{
    // ── Create ──────────────────────────────────────────────

    [Fact]
    public async Task CreateHandler_ShouldDelegateToUserService()
    {
        var userService = Substitute.For<IUserService>();
        var expectedId = Guid.CreateVersion7();
        userService.Create(Arg.Any<CreateUserRequest>()).Returns(expectedId);

        var handler = new CreateUserCommandHandler(userService);
        var result = await handler.Handle(
            new CreateUserCommand([], [], "user@example.com", "John Doe", "avatar.jpg"),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expectedId, result.Value);
        await userService.Received(1).Create(
            Arg.Is<CreateUserRequest>(r =>
                r.Email == "user@example.com" && r.FullName == "John Doe"));
    }

    [Fact]
    public async Task CreateHandler_WhenEmailConflict_ShouldPropagateError()
    {
        var userService = Substitute.For<IUserService>();
        userService.Create(Arg.Any<CreateUserRequest>())
            .Returns(Error.Conflict("User.EmailConflict", "Email already exists"));

        var handler = new CreateUserCommandHandler(userService);
        var result = await handler.Handle(
            new CreateUserCommand([], [], "dup@example.com", "Jane", ""),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("User.EmailConflict", result.FirstError.Code);
    }

    // ── Delete ──────────────────────────────────────────────

    [Fact]
    public async Task DeleteHandler_ShouldDelegateToUserService()
    {
        var userService = Substitute.For<IUserService>();
        var userId = Guid.CreateVersion7();
        userService.Delete(userId).Returns(Result.Success);

        var handler = new DeleteUserCommandHandler(userService);
        var result = await handler.Handle(
            new DeleteUserCommand(userId), CancellationToken.None);

        Assert.False(result.IsError);
        await userService.Received(1).Delete(userId);
    }

    [Fact]
    public async Task DeleteHandler_WhenNotFound_ShouldPropagateError()
    {
        var userService = Substitute.For<IUserService>();
        var userId = Guid.CreateVersion7();
        userService.Delete(userId)
            .Returns(Error.NotFound("User.NotFound", "User not found"));

        var handler = new DeleteUserCommandHandler(userService);
        var result = await handler.Handle(
            new DeleteUserCommand(userId), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("User.NotFound", result.FirstError.Code);
    }

    // ── ChangePassword ──────────────────────────────────────

    [Fact]
    public async Task ChangePasswordHandler_ShouldDelegateToUserService()
    {
        var userService = Substitute.For<IUserService>();
        var userId = Guid.CreateVersion7();
        userService.ChangePassword(Arg.Any<ChangePasswordRequest>()).Returns(Result.Success);

        var handler = new ChangePasswordCommandHandler(userService);
        var result = await handler.Handle(
            new ChangePasswordCommand(userId), CancellationToken.None);

        Assert.False(result.IsError);
        await userService.Received(1).ChangePassword(
            Arg.Is<ChangePasswordRequest>(r => r.UserId == userId));
    }
}
