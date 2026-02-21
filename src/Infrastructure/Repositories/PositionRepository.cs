using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class PositionRepository : IPositionRepository
{
    private readonly AppDbContext _context;
    public PositionRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<ErrorOr<List<Position>>> FindAll()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Position?>> FindById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Upsert(Position position)
    {
        throw new NotImplementedException();
    }
}