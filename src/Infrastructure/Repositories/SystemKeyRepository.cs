using Domain.Common.Repositories;
using Domain.Constant;
using ErrorOr;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class SystemKeyRepository : ISystemKeyRepository
{
    private readonly AppDbContext _context;
    public SystemKeyRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<ErrorOr<List<SystemKey>>> FindAll()
    {
        throw new NotImplementedException();
    }
}