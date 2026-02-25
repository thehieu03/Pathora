using Application.Common;
using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Contracts.User;
using Domain.Common.Repositories;
using Domain.Entities;
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
    IRoleService roleService,
    IUserRepository userRepository,
    IRoleRepository roleRepository)
    : IUserService
{
    private readonly IUser _user = user;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IRoleService _roleService = roleService;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IRoleRepository _roleRepository = roleRepository;

    public async Task<ErrorOr<PaginatedListWithPermissions<UserVm>>> GetAll(GetAllUserRequest request)
    {
        var users = await _userRepository.FindAll(
            request.TextSearch,
            request.DepartmentId == Guid.Empty ? null : request.DepartmentId,
            request.PageNumber,
            request.PageSize);
        var total = await _userRepository.CountAll(
            request.TextSearch,
            request.DepartmentId == Guid.Empty ? null : request.DepartmentId);

        var userVms = new List<UserVm>();
        foreach (var u in users)
        {
            var rolesResult = await _roleRepository.FindByUserId(u.Id.ToString());
            var roles = rolesResult.IsError ? [] : rolesResult.Value.Select(r => r.Name).ToList();

            userVms.Add(new UserVm(
                u.Id, u.Avatar, u.Username, u.FullName, u.Email,
                string.Empty, roles, new Dictionary<string, bool>()));
        }

        return new PaginatedListWithPermissions<UserVm>(total, userVms, new Dictionary<string, bool>());
    }

    public async Task<ErrorOr<UserDetailVm>> GetDetail(Guid id)
    {
        var userEntity = await _userRepository.FindById(id);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        var rolesResult = await _roleRepository.FindByUserId(id.ToString());
        var roles = rolesResult.IsError
            ? Enumerable.Empty<Contracts.User.RoleVm>()
            : rolesResult.Value.Select(r => new Contracts.User.RoleVm(r.Id, r.Name));

        return new UserDetailVm(
            userEntity.Id,
            userEntity.Username,
            userEntity.FullName,
            userEntity.Email,
            userEntity.Avatar,
            roles,
            []);
    }

    public async Task<ErrorOr<Guid>> Create(CreateUserRequest request)
    {
        var isUnique = await _userRepository.IsEmailUnique(request.Email);
        if (!isUnique)
            return Error.Conflict("User.DuplicateEmail", "Email đã được sử dụng");

        var generatedPassword = PasswordGenerator.Generate();
        var userEntity = UserEntity.Create(
            request.Email,
            request.FullName,
            request.Email,
            _passwordHasher.HashPassword(generatedPassword),
            _user.Id ?? string.Empty,
            request.Avatar,
            forcePasswordChange: true);

        await _userRepository.Create(userEntity);

        if (request.RoleIds.Count > 0)
        {
            await _roleRepository.AddUser(userEntity.Id, request.RoleIds);
        }

        return userEntity.Id;
    }

    public async Task<ErrorOr<Success>> Update(UpdateUserRequest request)
    {
        var userEntity = await _userRepository.FindById(request.Id);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        userEntity.Update(request.FullName, request.Avatar, _user.Id ?? string.Empty);
        await _userRepository.Update(userEntity);

        // Update roles
        await _roleRepository.DeleteUser(request.Id);
        if (request.RoleIds.Count > 0)
        {
            await _roleRepository.AddUser(request.Id, request.RoleIds);
        }

        return Result.Success;
    }

    public async Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request)
    {
        var userEntity = await _userRepository.FindById(request.UserId);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        var newPassword = PasswordGenerator.Generate();
        userEntity.ChangePassword(_passwordHasher.HashPassword(newPassword), _user.Id ?? string.Empty, forcePasswordChange: true);
        await _userRepository.Update(userEntity);

        return Result.Success;
    }

    public async Task<ErrorOr<Success>> Delete(Guid id)
    {
        var userEntity = await _userRepository.FindById(id);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        await _userRepository.SoftDelete(id);
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> IsEmailUnique(string email)
    {
        var isUnique = await _userRepository.IsEmailUnique(email);
        if (!isUnique)
            return Error.Conflict("User.DuplicateEmail", "Email đã được sử dụng");
        return Result.Success;
    }
}
