using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Repositories.Common;

public abstract class EfBaseRepository<T> : IRepository<T> where T : class
{
    protected readonly DbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected EfBaseRepository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .TagWith($"GetById: {typeof(T).Name}") // Thêm comment vào SQL
            .FirstOrDefaultAsync(e => EF.Property<Guid>(e, GetPrimaryKeyName()) == id);
    }

    public virtual async Task<IReadOnlyList<T>> GetListAsync(
        Expression<Func<T, bool>>? predicate = null,
        Expression<Func<T, object>>[]? includes = null)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();
      
        query = query.TagWith($"GetList: {typeof(T).Name}");

        if (includes is { Length: > 0 })
        {
            foreach (var include in includes) query = query.Include(include);
            query = query.AsSplitQuery();
        }

        if (predicate != null) query = query.Where(predicate);

        return await query.ToListAsync();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var keyName = GetPrimaryKeyName();
        var entity = await _dbSet.FirstOrDefaultAsync(e => EF.Property<Guid>(e, keyName) == id);

        if (entity != null)
        {
            // Kiểm tra xem class T có thuộc tính "IsDeleted" hay không
            var property = _context.Entry(entity).Metadata.FindProperty("IsDeleted");

            if (property != null)
            {
                // Nếu có thì set true (Xóa mềm)
                _context.Entry(entity).Property("IsDeleted").CurrentValue = true;
                _dbSet.Update(entity);
            }
            else _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
    private string GetPrimaryKeyName()
    {
        var key = _context.Model.FindEntityType(typeof(T))?.FindPrimaryKey();
        return key?.Properties.Select(x => x.Name).FirstOrDefault()
               ?? throw new InvalidOperationException($"Entity {typeof(T).Name} does not have a primary key defined.");
    }

    public Task<IEnumerable<T>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task AddAsync(T entity)
    {
        throw new NotImplementedException();
    }

    public void Update(T entity)
    {
        throw new NotImplementedException();
    }

    public void UpdateRangeAsync(IEnumerable<T> entities)
    {
        throw new NotImplementedException();
    }

    public void AddRangeAsync(IEnumerable<T> entities)
    {
        throw new NotImplementedException();
    }

    public void Delete(T entity)
    {
        throw new NotImplementedException();
    }

    public void DeleteRangeAsync(IEnumerable<T> entities)
    {
        throw new NotImplementedException();
    }

    public Task<IQueryable<T>> GetQuery(Expression<Func<T, bool>> predicate)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, string includeProperties = "")
    {
        throw new NotImplementedException();
    }
}