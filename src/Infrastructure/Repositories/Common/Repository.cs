using Domain.Common.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Repositories.Common;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual T? GetById(int id)
    {
        return _dbSet.Find(id);
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        IQueryable<T> query = _dbSet.TagWith($"GetById: {typeof(T).Name}");
        query = query.Where(e => EF.Property<Guid>(e, GetPrimaryKeyName()) == id);
        if (typeof(T).GetProperty("IsDeleted") != null)
             query = query.Where(e => !EF.Property<bool>(e, "IsDeleted"));
        return await query.FirstOrDefaultAsync();
    }

    public virtual async Task<IReadOnlyList<T>> GetListAsync(
     Expression<Func<T, bool>>? predicate = null,
     Expression<Func<T, object>>[]? includes = null)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        query = query.TagWith($"GetList: {typeof(T).Name}");

        // kiểm tra entity có IsDeleted không
        if (typeof(T).GetProperty("IsDeleted") != null)
        {
            query = query.Where(e => !EF.Property<bool>(e, "IsDeleted"));
        }
        if (includes is { Length: > 0 })
        {
            foreach (var include in includes)
                query = query.Include(include);

            query = query.AsSplitQuery();
        }
        if (predicate != null)
            query = query.Where(predicate);
        return await query.ToListAsync();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var keyName = GetPrimaryKeyName();
        var entity = await _dbSet.FirstOrDefaultAsync(e => EF.Property<Guid>(e, keyName) == id);

        if (entity != null)
        {
            var property = _context.Entry(entity).Metadata.FindProperty("IsDeleted");

            if (property != null)
            {
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

    public virtual IEnumerable<T> GetAll()
    {
        return _dbSet.ToList();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public virtual void Update(T entity)
    {
        _dbSet.Update(entity);
        _context.SaveChanges();
    }

    public virtual void UpdateRangeAsync(IEnumerable<T> entities)
    {
        _dbSet.UpdateRange(entities);
        _context.SaveChanges();
    }

    public virtual async void AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
    }

    public virtual void Delete(int id)
    {
        var entity = GetById(id);
        if (entity != null)
        {
            Delete(entity);
        }
    }

    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
        _context.SaveChanges();
    }

    public virtual void DeleteRangeAsync(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
        _context.SaveChanges();
    }

    public virtual IQueryable<T> GetQuery()
    {
        return _dbSet;
    }

    public virtual Task<IQueryable<T>> GetQuery(Expression<Func<T, bool>> predicate)
    {
        return Task.FromResult(_dbSet.Where(predicate));
    }

    public virtual IQueryable<T> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, string includeProperties = "")
    {
        IQueryable<T> query = _dbSet;

        if (filter != null)
            query = query.Where(filter);

        foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            query = query.Include(includeProperty);

        if (orderBy != null)
            return orderBy(query);

        return query;
    }
}
