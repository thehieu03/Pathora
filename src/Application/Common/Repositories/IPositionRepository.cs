using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IPositionRepository
{
    Task<ErrorOr<Success>> Upsert(Position position);
    Task<ErrorOr<List<Position>>> FindAll();
    Task<ErrorOr<Position?>> FindById(Guid id);
}