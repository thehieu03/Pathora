using Domain.Common.Repositories;
using Domain.UnitOfWork;

namespace Infrastructure.Repositories.Common;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public AppDbContext ContextDb => _context;

    public async Task BeginTransactionAsync()
    {
        await ContextDb.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        await ContextDb.Database.CommitTransactionAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }


    public async Task RollbackTransactionAsync()
    {
        await ContextDb.Database.RollbackTransactionAsync();
    }

    public async Task<int> SaveChangeAsync(CancellationToken cancellationToken = default)
    {
        return await ContextDb.SaveChangesAsync(cancellationToken);
    }

    public int SaveChanges()
    {
        return ContextDb.SaveChanges();
    }

    public IRepository<TEntity> GenericRepository<TEntity>() where TEntity : class
    {
        var type = typeof(TEntity);
        if (_repositories.TryGetValue(type, out var repository))
        {
            return (IRepository<TEntity>)repository;
        }

        var newRepository = new Repository<TEntity>(_context);
        _repositories[type] = newRepository;
        return newRepository;
    }
}
