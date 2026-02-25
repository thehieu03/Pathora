using Application.Common.Contracts;
using Application.Contracts.Role;
using Application.Features.Role.Commands;
using Application.Services;
using ErrorOr;

namespace Domain.Specs.Role;

public sealed class CreateRoleCommandHandlerTests
{
    [Fact]
    public async Task Handle_WhenFunctionIdsIsNull_ShouldForwardEmptyFunctionIds()
    {
        var roleService = new CaptureRoleService();
        var handler = new CreateRoleCommandHandler(roleService);
        var command = new CreateRoleCommand("Admin", "Bootstrap role", 1, null!);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        Assert.NotNull(roleService.CapturedCreateRequest);
        Assert.NotNull(roleService.CapturedCreateRequest!.FunctionIds);
        Assert.Empty(roleService.CapturedCreateRequest.FunctionIds);
    }

    private sealed class CaptureRoleService : IRoleService
    {
        public CreateRoleRequest? CapturedCreateRequest { get; private set; }

        public Task<ErrorOr<Guid>> Create(CreateRoleRequest request)
        {
            CapturedCreateRequest = request;
            return Task.FromResult<ErrorOr<Guid>>(Guid.CreateVersion7());
        }

        public Task<ErrorOr<Success>> Update(UpdateRoleRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<Success>> Delete(DeleteRoleRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ErrorOr<PaginatedListWithPermissions<RoleVm>>> GetAll(GetAllRoleRequest request)
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
