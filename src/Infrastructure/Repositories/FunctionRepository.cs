using Domain.Common.Repositories;
using Domain.Constant;
using ErrorOr;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FunctionRepository(AppDbContext context) : IFunctionRepository
{
    private readonly AppDbContext _context = context;

    public async Task<ErrorOr<List<Function>>> FindAll()
    {
        return await _context.Functions
            .AsNoTracking()
            .Where(f => !f.IsDeleted)
            .OrderBy(f => f.CategoryId)
            .ThenBy(f => f.Order)
            .ToListAsync();
    }

    public async Task<ErrorOr<List<Function>>> FindUserFunctions(string id)
    {
        if (!Guid.TryParse(id, out var userId))
            return Error.Validation("User.InvalidId", "User ID không hợp lệ");

        // Get user's role IDs, then find functions for those roles
        // For now, return all functions (authorization can be refined later)
        return await _context.Functions
            .AsNoTracking()
            .Where(f => !f.IsDeleted)
            .OrderBy(f => f.CategoryId)
            .ThenBy(f => f.Order)
            .ToListAsync();
    }
}
