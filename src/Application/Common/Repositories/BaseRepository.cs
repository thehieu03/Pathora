using System.Linq.Expressions;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<T>> GetListAsync(Expression<Func<T, bool>>? predicate = null,Expression<Func<T, object>>[] ? includes = null);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void UpdateRangeAsync(IEnumerable<T> entities);
    void AddRangeAsync(IEnumerable<T> entities);
    void Delete(T entity);
    void DeleteRangeAsync(IEnumerable<T> entities);
    Task<IQueryable<T>> GetQuery(Expression<Func<T, bool>> predicate);
    IQueryable<T> Get(
        Expression<Func<T, bool>>? filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        string includeProperties = "");
}