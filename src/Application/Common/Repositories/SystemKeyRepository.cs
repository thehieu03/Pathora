using Domain.Constant;
using ErrorOr;

namespace Application.Common.Repositories;

public interface ISystemKeyRepository
{
    Task<ErrorOr<List<SystemKey>>> FindAll();
}