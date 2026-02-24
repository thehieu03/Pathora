using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext dbContext) : IUserRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<UserEntity?> FindByEmail(string email)
    {
        return await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
    }

    public async Task<UserEntity?> FindById(Guid id)
    {
        return await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
    }

    public async Task Create(UserEntity user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(UserEntity user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task SoftDelete(Guid id)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user != null)
        {
            user.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<List<UserEntity>> FindAll(string? textSearch, Guid? departmentId, int pageNumber, int pageSize)
    {
        var query = _dbContext.Users
            .AsNoTracking()
            .Where(u => !u.IsDeleted);

        if (!string.IsNullOrWhiteSpace(textSearch))
        {
            var search = textSearch.ToLower();
            query = query.Where(u =>
                (u.FullName != null && u.FullName.ToLower().Contains(search)) ||
                u.Email.ToLower().Contains(search) ||
                u.Username.ToLower().Contains(search));
        }

        return await query
            .OrderByDescending(u => u.CreatedOnUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAll(string? textSearch, Guid? departmentId)
    {
        var query = _dbContext.Users.Where(u => !u.IsDeleted);

        if (!string.IsNullOrWhiteSpace(textSearch))
        {
            var search = textSearch.ToLower();
            query = query.Where(u =>
                (u.FullName != null && u.FullName.ToLower().Contains(search)) ||
                u.Email.ToLower().Contains(search) ||
                u.Username.ToLower().Contains(search));
        }

        return await query.CountAsync();
    }

    public async Task<bool> IsEmailUnique(string email)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Email == email && !u.IsDeleted);
    }
}
