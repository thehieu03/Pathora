using Application.Contracts.Role;
using Application.Features.Role.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class RoleCommandHandlerTests
{
    [Fact]
    public async Task DeleteHandler_ShouldDelegateToRoleService()
    {
        var roleService = Substitute.For<IRoleService>();
        var roleId = Guid.CreateVersion7().ToString();
        roleService.Delete(Arg.Any<DeleteRoleRequest>()).Returns(Result.Success);

        var handler = new DeleteRoleCommandHandler(roleService);
        var result = await handler.Handle(
            new DeleteRoleCommand(roleId), CancellationToken.None);

        Assert.False(result.IsError);
        await roleService.Received(1).Delete(
            Arg.Is<DeleteRoleRequest>(r => r.RoleId == roleId));
    }

    [Fact]
    public async Task DeleteHandler_WhenNotFound_ShouldPropagateError()
    {
        var roleService = Substitute.For<IRoleService>();
        roleService.Delete(Arg.Any<DeleteRoleRequest>())
            .Returns(Error.NotFound("Role.NotFound", "Role not found"));

        var handler = new DeleteRoleCommandHandler(roleService);
        var result = await handler.Handle(
            new DeleteRoleCommand("nonexistent"), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Role.NotFound", result.FirstError.Code);
    }
}
