using Application.Common;
using Contracts;
using Contracts.Interfaces;
using Application.Contracts.User;
using BuildingBlocks.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.User.Queries;

public sealed record GetAllUsersQuery(
    Guid DepartmentId,
    string? TextSearch,
    int PageNumber = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedListWithPermissions<UserVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.User}:all:{DepartmentId}:{TextSearch}:{PageNumber}:{PageSize}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}

public sealed class GetAllUsersQueryHandler(IUserService userService)
    : IQueryHandler<GetAllUsersQuery, ErrorOr<PaginatedListWithPermissions<UserVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<UserVm>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return await userService.GetAll(new GetAllUserRequest(
            request.DepartmentId, request.TextSearch, request.PageNumber, request.PageSize));
    }
}

