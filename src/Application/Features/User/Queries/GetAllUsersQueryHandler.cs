using Contracts;
using Application.Contracts.User;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.User.Queries;

public sealed class GetAllUsersQueryHandler(IUserService userService)
    : IQueryHandler<GetAllUsersQuery, ErrorOr<PaginatedListWithPermissions<UserVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<UserVm>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return await userService.GetAll(new GetAllUserRequest(
            request.DepartmentId, request.TextSearch, request.PageNumber, request.PageSize));
    }
}


