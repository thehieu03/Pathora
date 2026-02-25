using Domain.Entities;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface IUserRepository
{
    Task<ErrorOr<UserEntity>> FindByEmail(string email);
}
