using Contracts;
using Application.Contracts.Role;
using Application.Features.Role.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Role;

public sealed class CreateRoleCommandHandlerTests
{
    [Fact]
    public async Task Handle_WhenFunctionIdsIsNull_ShouldForwardEmptyFunctionIds()
    {
        var roleService = Substitute.For<IRoleService>();
        roleService.Create(Arg.Any<CreateRoleRequest>())
            .Returns(Guid.CreateVersion7());

        var handler = new CreateRoleCommandHandler(roleService);
        var command = new CreateRoleCommand("Admin", "Bootstrap role", 1, null!);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        await roleService.Received(1).Create(
            Arg.Is<CreateRoleRequest>(r => r.FunctionIds != null && !r.FunctionIds.Any()));
    }
}

