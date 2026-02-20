using System.Data;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IUnitOfWork : IDisposable
{
    IRepository<TEntity> GenericRepository<TEntity>() where TEntity : class;
    int SaveChanges();
    Task<int> SaveChangeAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
public static class UnitOfWorkExtensions
{
    public static async Task<ErrorOr<T>> Rollback<T>(
        this IUnitOfWork uow,
        List<Error> errors)
    {
        await uow.RollbackTransactionAsync();
        return errors;
    }
}