using Application.Common.Contracts;
using Application.Contracts.Role;
using Domain.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Role.Queries.GetAllRoles;

public sealed record GetAllRolesQuery(string? RoleName, RoleStatus Status, int CurrentPage = 1, int PageSize = 10)
    : IQuery<ErrorOr<PaginatedListWithPermissions<RoleVm>>>;
