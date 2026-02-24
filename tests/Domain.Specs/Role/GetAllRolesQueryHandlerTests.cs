using Application.Common.Contracts;
using Application.Contracts.Role;
using Application.Features.Role.Queries;
using Application.Services;
using ErrorOr;

namespace Domain.Specs.Role;

public sealed class GetAllRolesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnAllRolesWithoutFiltersOrPagination()
    {
        var roleService = new CaptureRoleService();
        var handler = new GetAllRolesQueryHandler(roleService);
        var query = new GetAllRolesQuery();

        var result = await handler.Handle(query, CancellationToken.None);

        Assert.True(roleService.GetAllCalled);
        Assert.NotNull(roleService.CapturedRequest);
        Assert.Equal(new GetAllRoleRequest(), roleService.CapturedRequest);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
    }

    private sealed class CaptureRoleService : IRoleService
    {
        public bool GetAllCalled { get; private set; }
        public GetAllRoleRequest? CapturedRequest { get; private set; }

        public Task<ErrorOr<PaginatedListWithPermissions<RoleVm>>> GetAll(GetAllRoleRequest request)
        {
            GetAllCalled = true;
            CapturedRequest = request;

            var roles = new List<RoleVm>
            {
                new(Guid.CreateVersion7(), "Admin", "System admin", 1, Domain.Enums.RoleStatus.Active, [])
            };
            var payload = new PaginatedListWithPermissions<RoleVm>(roles.Count, roles, new Dictionary<string, bool>());
            return Task.FromResult<ErrorOr<PaginatedListWithPermissions<RoleVm>>>(payload);
        }

        public Task<ErrorOr<Guid>> Create(CreateRoleRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<Success>> Update(UpdateRoleRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<Success>> Delete(DeleteRoleRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<List<LookupVm>>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<RoleDetailVm>> GetDetail(GetRoleDetailRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<Dictionary<string, bool>>> HasFunctions(string userId, int categoryId, string[] type)
        {
            throw new NotImplementedException();
        }
    }
}
