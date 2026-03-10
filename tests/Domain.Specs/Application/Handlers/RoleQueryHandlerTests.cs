using Contracts;
using Application.Contracts.Role;
using Application.Features.Role.Queries;
using Application.Services;
using Domain.Enums;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class RoleQueryHandlerTests
{
    // ── GetDetail ───────────────────────────────────────────

    [Fact]
    public async Task GetDetailHandler_ShouldDelegateToRoleService()
    {
        var roleService = Substitute.For<IRoleService>();
        var roleId = 1;
        var expected = new RoleDetailVm(1, "Admin", "System admin", 1, RoleStatus.Active, []);
        roleService.GetDetail(Arg.Any<GetRoleDetailRequest>()).Returns(expected);

        var handler = new GetRoleDetailQueryHandler(roleService);
        var result = await handler.Handle(
            new GetRoleDetailQuery(roleId), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await roleService.Received(1).GetDetail(
            Arg.Is<GetRoleDetailRequest>(r => r.RoleId == roleId));
    }

    [Fact]
    public async Task GetDetailHandler_WhenNotFound_ShouldPropagateError()
    {
        var roleService = Substitute.For<IRoleService>();
        roleService.GetDetail(Arg.Any<GetRoleDetailRequest>())
            .Returns(Error.NotFound("Role.NotFound", "Role not found"));

        var handler = new GetRoleDetailQueryHandler(roleService);
        var result = await handler.Handle(
            new GetRoleDetailQuery(0), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Role.NotFound", result.FirstError.Code);
    }

    // ── GetLookup ───────────────────────────────────────────

    [Fact]
    public async Task GetLookupHandler_ShouldDelegateToRoleService()
    {
        var roleService = Substitute.For<IRoleService>();
        List<LookupVm> expected = [new LookupVm("1", "Admin"), new LookupVm("2", "User")];
        roleService.GetAll().Returns(expected);

        var handler = new GetRoleLookupQueryHandler(roleService);
        var result = await handler.Handle(
            new GetRoleLookupQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(2, result.Value.Count);
        await roleService.Received(1).GetAll();
    }
}
