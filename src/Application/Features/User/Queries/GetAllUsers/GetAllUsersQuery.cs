using Application.Common.Contracts;
using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Queries.GetAllUsers;

public sealed record GetAllUsersQuery(
    Guid DepartmentId,
    string? TextSearch,
    int PageNumber = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedListWithPermissions<UserVm>>>;
