using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Contracts.User;
using Domain.UnitOfWork;
using ErrorOr;

namespace Application.Services;

public interface IUserService
{
    Task<ErrorOr<PaginatedListWithPermissions<UserVm>>> GetAll(GetAllUserRequest request);
    Task<ErrorOr<UserDetailVm>> GetDetail(Guid id);
    Task<ErrorOr<Guid>> Create(CreateUserRequest request);
    Task<ErrorOr<Success>> Update(UpdateUserRequest request);
    Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request);
    Task<ErrorOr<Success>> Delete(Guid id);
    Task<ErrorOr<Success>> IsEmailUnique(string email);
}

public class UserService(
    IUser user,
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    IRoleService roleService)
    : IUserService
{
    private readonly IUser _user = user;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IRoleService _roleService = roleService;

    public Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Guid>> Create(CreateUserRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<PaginatedListWithPermissions<UserVm>>> GetAll(GetAllUserRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<UserDetailVm>> GetDetail(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> IsEmailUnique(string email)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Update(UpdateUserRequest request)
    {
        throw new NotImplementedException();
    }
}