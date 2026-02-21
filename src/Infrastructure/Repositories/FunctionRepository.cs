using Domain.Common.Repositories;
using Domain.Constant;
using ErrorOr;

namespace Infrastructure.Repositories;
//làm riêng

public class FunctionRepository : IFunctionRepository
{
    public Task<ErrorOr<List<Function>>> FindAll()
    {
        throw new NotImplementedException();
    }
    public Task<ErrorOr<List<Function>>> FindUserFunctions(string userId)
    {
        throw new NotImplementedException();
    }
}