using Application.Common.Contracts;
using Application.Common.Interfaces;
using Domain.Common.Repositories;
using Application.Contracts.Position;
using Domain.Constant;
using Domain.Entities;
using ErrorOr;

namespace Application.Services;

public interface IPositionService
{
    Task<ErrorOr<PaginatedListWithPermissions<PositionVm>>> GetAllAsync(GetAllPositionRequest request);
    Task<ErrorOr<Success>> CreateAsync(CreatePositionRequest request);
    Task<ErrorOr<Success>> UpdateAsync(UpdatePositionRequest request);
    Task<ErrorOr<Success>> DeleteAsync(Guid id);
    Task<ErrorOr<List<LookupVm>>> GetComboboxAsync();
}

public class PositionService : IPositionService
{
    private readonly IPositionRepository _positionRepository;
    private readonly IRoleService _roleService;
    private readonly IUser _user;

    public PositionService(IPositionRepository positionRepository, IRoleService roleService, IUser user)
    {
        _positionRepository = positionRepository;
        _roleService = roleService;
        _user = user;
    }

    public Task<ErrorOr<Success>> CreateAsync(CreatePositionRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> DeleteAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<PaginatedListWithPermissions<PositionVm>>> GetAllAsync(GetAllPositionRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<LookupVm>>> GetComboboxAsync()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> UpdateAsync(UpdatePositionRequest request)
    {
        throw new NotImplementedException();
    }
}