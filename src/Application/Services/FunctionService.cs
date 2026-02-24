using Domain.Common.Repositories;
using Domain.Constant;
using ErrorOr;

namespace Application.Services;

public interface IFunctionService
{
    Task<ErrorOr<List<Function>>> GetAll();
}

public class FunctionService(IFunctionRepository functionRepository) : IFunctionService
{

    public Task<ErrorOr<List<Function>>> GetAll()
    {
        return functionRepository.FindAll();
    }
}