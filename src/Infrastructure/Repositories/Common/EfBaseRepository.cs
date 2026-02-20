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

        // Gắn Tag để dễ debug trong Log của Postgres
        query = query.TagWith($"GetList: {typeof(T).Name}");

        if (includes is { Length: > 0 })
        {
            foreach (var include in includes) query = query.Include(include);
            query = query.AsSplitQuery();
        }

        if (predicate != null) query = query.Where(predicate);

        return await query.ToListAsync();
    }

    public virtual async Task UpsertRangeAsync(IEnumerable<T> entities)
    {
        var entityList = entities.ToList();
        if (!entityList.Any()) return;

        var keyName = GetPrimaryKeyName();

        var inputKeys = entityList
            .Select(e => _context.Entry(e).Property(keyName).CurrentValue)
            .Where(v => v != null)
            .ToList();

        var existingKeys = await _dbSet.AsNoTracking()
            .TagWith($"Bulk Upsert Check: {typeof(T).Name}")
            .Where(e => inputKeys.Contains(EF.Property<object>(e, keyName)))
            .Select(e => EF.Property<object>(e, keyName))
            .ToListAsync();

        var toAdd = new List<T>();
        var toUpdate = new List<T>();

        foreach (var entity in entityList)
        {
            var keyValue = _context.Entry(entity).Property(keyName).CurrentValue;

            if (existingKeys.Contains(keyValue))
            {
                toUpdate.Add(entity);
            }
            else
            {
                toAdd.Add(entity);
            }
        }
        if (toAdd.Any()) await _dbSet.AddRangeAsync(toAdd);
        if (toUpdate.Any()) _dbSet.UpdateRange(toUpdate);
        await _context.SaveChangesAsync();
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
}