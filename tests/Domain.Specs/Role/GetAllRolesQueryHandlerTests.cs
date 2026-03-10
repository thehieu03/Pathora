using Contracts;
using Application.Contracts.Role;
using Application.Features.Role.Queries;
using Application.Services;
using Domain.Enums;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Role;

public sealed class GetAllRolesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnAllRolesWithoutFiltersOrPagination()
    {
        var roles = new List<RoleVm>
        {
            new(1, "Admin", "System admin", 1, RoleStatus.Active, [])
        };
        var payload = new PaginatedListWithPermissions<RoleVm>(roles.Count, roles, new Dictionary<string, bool>());

        var roleService = Substitute.For<IRoleService>();
        roleService.GetAll(Arg.Any<GetAllRoleRequest>()).Returns(payload);

        var handler = new GetAllRolesQueryHandler(roleService);
        var query = new GetAllRolesQuery();

        var result = await handler.Handle(query, CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        await roleService.Received(1).GetAll(new GetAllRoleRequest());
    }
}

