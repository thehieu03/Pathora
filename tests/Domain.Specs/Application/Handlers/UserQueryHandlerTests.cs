using Application.Common.Contracts;
using Application.Contracts.User;
using Application.Features.User.Queries;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class UserQueryHandlerTests
{
    // ── GetAll ──────────────────────────────────────────────

    [Fact]
    public async Task GetAllHandler_ShouldDelegateToUserService()
    {
        var userService = Substitute.For<IUserService>();
        var users = new List<UserVm>();
        var payload = new PaginatedListWithPermissions<UserVm>(0, users, new Dictionary<string, bool>());
        userService.GetAll(Arg.Any<GetAllUserRequest>()).Returns(payload);

        var handler = new GetAllUsersQueryHandler(userService);
        var deptId = Guid.CreateVersion7();
        var result = await handler.Handle(
            new GetAllUsersQuery(deptId, "search", 1, 10), CancellationToken.None);

        Assert.False(result.IsError);
        await userService.Received(1).GetAll(
            Arg.Is<GetAllUserRequest>(r =>
                r.DepartmentId == deptId && r.TextSearch == "search" &&
                r.PageNumber == 1 && r.PageSize == 10));
    }

    // ── GetDetail ───────────────────────────────────────────

    [Fact]
    public async Task GetDetailHandler_ShouldDelegateToUserService()
    {
        var userService = Substitute.For<IUserService>();
        var userId = Guid.CreateVersion7();
        var expected = new UserDetailVm(userId, "john", "John Doe", "john@example.com", null, [], []);
        userService.GetDetail(userId).Returns(expected);

        var handler = new GetUserDetailQueryHandler(userService);
        var result = await handler.Handle(
            new GetUserDetailQuery(userId), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await userService.Received(1).GetDetail(userId);
    }

    [Fact]
    public async Task GetDetailHandler_WhenNotFound_ShouldPropagateError()
    {
        var userService = Substitute.For<IUserService>();
        var userId = Guid.CreateVersion7();
        userService.GetDetail(userId)
            .Returns(Error.NotFound("User.NotFound", "User not found"));

        var handler = new GetUserDetailQueryHandler(userService);
        var result = await handler.Handle(
            new GetUserDetailQuery(userId), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("User.NotFound", result.FirstError.Code);
    }
}
