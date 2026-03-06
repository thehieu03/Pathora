using Application.Contracts.Identity;
using Application.Features.Identity.Queries;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class IdentityQueryHandlerTests
{
    // ── GetUserInfo ─────────────────────────────────────────

    [Fact]
    public async Task GetUserInfoHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        var expected = new UserInfoVm(
            Id: Guid.CreateVersion7(),
            Username: "admin",
            FullName: "Administrator",
            Email: "admin@example.com",
            Avatar: null,
            ForcePasswordChange: false,
            Roles: [new UserRoleVm(1, "role-1", "Admin")],
            Departments: [new UserDepartmentVm(Guid.CreateVersion7().ToString(), "IT", null, null)]);

        identityService.GetUserInfo().Returns(expected);

        var handler = new GetUserInfoQueryHandler(identityService);
        var result = await handler.Handle(new GetUserInfoQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await identityService.Received(1).GetUserInfo();
    }

    [Fact]
    public async Task GetUserInfoHandler_WhenNotFound_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.GetUserInfo()
            .Returns(Error.NotFound("Identity.UserNotFound", "User not found"));

        var handler = new GetUserInfoQueryHandler(identityService);
        var result = await handler.Handle(new GetUserInfoQuery(), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.UserNotFound", result.FirstError.Code);
    }

    // ── GetTabs ─────────────────────────────────────────────

    [Fact]
    public async Task GetTabsHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        List<TabVm> expected = [new TabVm(1, "Dashboard", true), new TabVm(2, "Tour", false)];
        identityService.GetTabs().Returns(expected);

        var handler = new GetTabsQueryHandler(identityService);
        var result = await handler.Handle(new GetTabsQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(2, result.Value.Count);
        await identityService.Received(1).GetTabs();
    }

    [Fact]
    public async Task GetTabsHandler_WhenForbidden_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.GetTabs()
            .Returns(Error.Forbidden("Identity.Forbidden", "No access"));

        var handler = new GetTabsQueryHandler(identityService);
        var result = await handler.Handle(new GetTabsQuery(), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.Forbidden", result.FirstError.Code);
    }
}
