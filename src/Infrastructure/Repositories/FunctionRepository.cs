using Domain.Common.Repositories;
using Domain.Constant;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Data;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FunctionRepository : Repository<Function>, IFunctionRepository
{
    public FunctionRepository(AppDbContext context) : base(context)
    {
    }

    public Task<ErrorOr<List<Function>>> FindAll()
    {
        var functions = _context.Functions.Where(f => !f.IsDeleted).ToList();
        return Task.FromResult<ErrorOr<List<Function>>>(functions);
    }
    public async Task<ErrorOr<List<Function>>> FindUserFunctions(string userId)
    {
        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Error.Validation("User.InvalidId", "Định dạng UserId không hợp lệ.");
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
            return Error.NotFound("User.FunctionsNotFound", "Không tìm thấy chức năng nào cho người dùng này.");
        }

       
        return functions;
    }
}