using Domain.Enums;

namespace Application.Contracts.Role;

public sealed record GetAllRoleRequest(string? RoleName, RoleStatus Status, int CurrentPage = 1, int PageSize = 10);

public sealed record RoleVm(
    Guid Id,
    string Name,
    string Description,
    int Type,
    RoleStatus Status,
    List<FunctionCategoryInfoVm> FunctionCategories
);

public sealed record FunctionCategoryInfoVm(
    int Id,
    string Description,
    List<FunctionInfoVm> Functions
);

public sealed record FunctionInfoVm(int Id, string Description);