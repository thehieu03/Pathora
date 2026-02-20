using Application.Common.Repositories;

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

    public IRepository<TEntity> GenericRepository<TEntity>() where TEntity : class
    {
        if (!_repositories.ContainsKey(typeof(TEntity)))
        {
            _repositories[typeof(TEntity)] = new EfBaseRepository<TEntity>(ContextDb);
        }
        return (IRepository<TEntity>)_repositories[typeof(TEntity)];
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
}
