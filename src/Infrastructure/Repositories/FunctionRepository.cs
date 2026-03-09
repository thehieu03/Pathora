using Domain.Common.Repositories;
using Application.Common.Constant;
using Domain.Constant;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Repositories.Common;

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
    public async Task<ErrorOr<List<Function>>> FindUserFunctions(string userId)
    {
        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Error.Validation(ErrorConstants.User.InvalidIdCode, ErrorConstants.User.InvalidIdFormatDescription);
        }

        // Truy vấn lấy danh sách Function thông qua các bảng trung gian
        var functions = await _context.Set<UserRoleEntity>()
         .AsNoTracking()
         .Where(ur => ur.UserId == userGuid)
         .SelectMany(ur => _context.Set<RoleFunctionEntity>()
             .Where(rf => rf.RoleId == ur.RoleId)
             .Select(rf => rf.Function))
         .Distinct()
         .ToListAsync();

        if (functions == null || !functions.Any())
        {
            return Error.NotFound(ErrorConstants.User.FunctionsNotFoundCode, ErrorConstants.User.FunctionsNotFoundDescription);
        }


        return functions;
    }
}
