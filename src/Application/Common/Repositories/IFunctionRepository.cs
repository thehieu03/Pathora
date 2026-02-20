using Domain.Constant;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IFunctionRepository
{
    Task<ErrorOr<List<Function>>> FindAll();
    Task<ErrorOr<List<FunctionDto>>> FindAllByRoleGroupByCategory();
    Task<ErrorOr<List<FunctionCategory>>> FindAllCategories();
    Task<ErrorOr<List<Function>>> FindUserFunctions(string userId);
    Task<ErrorOr<List<Function>>> FindRoleFunctions(string roleId);
    Task<ErrorOr<Success>> AddFunctionsToRole(Guid roleId, List<Function> functions);
    Task<ErrorOr<Success>> RemoveFunctionsFromRole(Guid roleId);
}

public class FunctionDto
{
    public required string RoleId { get; set; }
    public int CategoryId { get; set; }
    public int FunctionId { get; set; }
    public required string FunctionDescription { get; set; }
}