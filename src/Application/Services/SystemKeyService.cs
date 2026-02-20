using Application.Common.Repositories;
using Domain.Constant;
using ErrorOr;

namespace Application.Services;

public interface ISystemKeyService
{
    Task<ErrorOr<List<SystemKey>>> GetAll();
}

public class SystemKeyService : ISystemKeyService
{
    private readonly ISystemKeyRepository _systemKeyRepository;

    public SystemKeyService(ISystemKeyRepository systemKeyRepository)
    {
        _systemKeyRepository = systemKeyRepository;
    }

    public async Task<ErrorOr<List<SystemKey>>> GetAll()
    {
        var result = await _systemKeyRepository.FindAll();
        if (result.IsError) return result.Errors;
        return result.Value;
    }
}