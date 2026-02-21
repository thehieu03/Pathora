

using Domain.Constant;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface IFunctionRepository
{
    Task<ErrorOr<List<Function>>> FindAll();
    Task<ErrorOr<List<Function>>> FindUserFunctions(string id);
}
