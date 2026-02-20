using Marten;
using System.Linq.Expressions;

public abstract class MartenBaseRepository<T> : IRepository<T> where T : class
{
    protected readonly IDocumentSession _session;
    protected MartenBaseRepository(IDocumentSession session) => _session = session;

    public virtual async Task<T?> GetByIdAsync(Guid id) => await _session.LoadAsync<T>(id);

    public virtual async Task<IReadOnlyList<T>> GetListAsync(Expression<Func<T, bool>>? predicate = null, Expression<Func<T, object>>[]? includes = null)
    {
        var query = _session.Query<T>();
        if (predicate != null) query = (Marten.Linq.IMartenQueryable<T>)query.Where(predicate);
        return await query.ToListAsync();
    }

    public virtual async Task UpsertRangeAsync(IEnumerable<T> entities)
    {
        _session.Store(entities.ToArray());
        await _session.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        _session.Delete<T>(id);
        await _session.SaveChangesAsync();
    }
}