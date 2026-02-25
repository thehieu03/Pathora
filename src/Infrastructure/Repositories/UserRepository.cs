using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Data;
using Infrastructure.Repositories.Common;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext context) : Repository<UserEntity>(context), IUserRepository
{
    public async Task<ErrorOr<UserEntity>> FindByEmail(string email)
    {
       var user = _context.Users.FirstOrDefault(u => u.Email == email);
       return user is not null ? user : Error.NotFound("User.NotFound", $"No user found with email: {email}");
    }
}