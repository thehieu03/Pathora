using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext context) : Repository<UserEntity>(context), IUserRepository
{
    public async Task<UserEntity?> FindByEmail(string email)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
    }

    public async Task<UserEntity?> FindById(Guid id)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
    }

    public async Task<UserEntity?> FindByGoogleId(string googleId)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.GoogleId == googleId && !u.IsDeleted);
    }

    public async Task Create(UserEntity user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }



    public async Task SoftDelete(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user != null)
        {
            user.IsDeleted = true;
        }
    }

    public async Task<List<UserEntity>> FindAll(string? textSearch, Guid? departmentId, int pageNumber, int pageSize)
    {
        var query = _context.Users
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
        var query = _context.Users.Where(u => !u.IsDeleted);

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
        return !await _context.Users.AnyAsync(u => u.Email == email && !u.IsDeleted);
    }
}
