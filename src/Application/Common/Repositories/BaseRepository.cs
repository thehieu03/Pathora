using System.Linq.Expressions;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<T>> GetListAsync(Expression<Func<T, bool>>? predicate = null,Expression<Func<T, object>>[] ? includes = null);
    Task UpsertRangeAsync(IEnumerable<T> entities);
    Task DeleteAsync(Guid id);
}