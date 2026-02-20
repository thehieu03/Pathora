using Domain.Enums;

namespace Application.Contracts.Role;

public sealed record GetRoleDetailRequest(string RoleId);

public sealed record RoleDetailVm(
    Guid? Id,
    string? Name,
    string? Description,
    int? Type,
    RoleStatus? Status,
    List<FunctionCategoryDetailVm> FunctionCategories);

public sealed record FunctionCategoryDetailVm(
    int Id,
    string Name,
    string Identity,
    List<FunctionDetailVm> Functions
);

public sealed record FunctionDetailVm(
    int Id,
    string ApiUrl,
    string Description,
    string ButtonShow,
    int Order,
    bool IsChecked
);