using Domain.Common.Repositories;
using Domain.Constant;
using ErrorOr;

namespace Application.Services;

public interface IFunctionService
{
    Task<ErrorOr<List<Function>>> GetAll();
}

public class FunctionService : IFunctionService
{
    private readonly IFunctionRepository _functionRepository;

    public FunctionService(IFunctionRepository functionRepository)
    {
        _functionRepository = functionRepository;
    }

    public Task<ErrorOr<List<Function>>> GetAll()
    {
        return _functionRepository.FindAll();
    }
}