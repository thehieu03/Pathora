using Application.Common.Interfaces;
using Application.Contracts.Identity;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Mails;
using Domain.UnitOfWork;
using ErrorOr;
using System.Text.Json;

namespace Application.Services;

public interface IIdentityService
{
    Task<ErrorOr<Success>> Register(RegisterRequest request);
    Task<ErrorOr<LoginResponse>> Login(LoginRequest request);
    Task<ErrorOr<ExternalLoginResponse>> ExternalLogin(ExternalLoginRequest request);
    Task<ErrorOr<RefreshTokenResponse>> Refresh(RefreshTokenRequest request);
    Task<ErrorOr<Success>> Logout(LogoutRequest request);
    Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request);
    Task<ErrorOr<Success>> ForgotPassword(ForgotPasswordRequest request);
    Task<ErrorOr<Success>> SendOtp(string email);
    Task<ErrorOr<UserInfoVm>> GetUserInfo();
    Task<ErrorOr<Success>> UpdateUserInfo(UpdateUserInfoRequest request);
    Task<ErrorOr<List<TabVm>>> GetTabs();
    Task<ErrorOr<Success>> ConfirmRegister(ConfirmRegisterRequest request);
}

public class IdentityService(
    IUser user,
    ITokenManager tokenManager,
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    IUserService userService,
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IRegisterRepository registerRepository,
    IMailRepository mailRepository
    )
    : IIdentityService
{
    private readonly IUser _user = user;
    private readonly ITokenManager _tokenManager = tokenManager;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IUserService _userService = userService;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IRoleRepository _roleRepository = roleRepository;
    private readonly IRegisterRepository _registerRepository = registerRepository;
    private readonly IMailRepository mailRepository = mailRepository;

    public async Task<ErrorOr<Success>> Register(RegisterRequest request)
    {
       
        var isUnique = await _userRepository.IsEmailUnique(request.Email);
        if (!isUnique)
            return Error.Conflict("User.DuplicateEmail", "Email đã được sử dụng");
        
        try
        {
            await _unitOfWork.ExecuteTransactionAsync(async () =>
            {
                var registerRepo = _unitOfWork.GenericRepository<RegisterEntity>();


                var hashedPassword = _passwordHasher.HashPassword(request.Password);


                var userEntity = new RegisterEntity
                {
                    Email = request.Email,
                    Username = request.Username,
                    FullName = request.FullName,
                    Password = hashedPassword
                };
                await registerRepo.AddAsync(userEntity);
                var mailRepo = _unitOfWork.GenericRepository<MailEntity>();

                var mailEntity = new MailEntity
                {
                    To = request.Email,
                    Subject = "Chào mừng đến với hệ thống",
                    Body = JsonSerializer.Serialize(new RegisterMail("https://pathora-be.duckdns.org/swagger/index.html", request.Email, 180.ToString())),
                    Template = nameof(RegisterMail),
                };

                await mailRepo.AddAsync(mailEntity);
            });
        }
        catch(Exception) 
        {
            await _unitOfWork.RollbackTransactionAsync();
        }
       
        return Result.Success;
    }

    public async Task<ErrorOr<LoginResponse>> Login(LoginRequest request)
    {
        var userEntity = await _userRepository.FindByEmail(request.Email);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Email hoặc mật khẩu không đúng");

        var isPasswordValid = _passwordHasher.VerifyHashedPassword(userEntity.Password!, request.Password);
        if (!isPasswordValid)
            return Error.Validation("User.InvalidPassword", "Email hoặc mật khẩu ");

        var tokenResult = await _tokenManager.GenerateToken(userEntity);
        if (tokenResult.IsError)
            return tokenResult.Errors;

        var (accessToken, refreshToken) = tokenResult.Value;
        return new LoginResponse(accessToken, refreshToken);
    }

    public Task<ErrorOr<ExternalLoginResponse>> ExternalLogin(ExternalLoginRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<ErrorOr<RefreshTokenResponse>> Refresh(RefreshTokenRequest request)
    {
        var result = await _tokenManager.RefreshToken(request.RefreshToken);
        if (result.IsError)
            return result.Errors;

        var (accessToken, refreshToken) = result.Value;
        return new RefreshTokenResponse(accessToken, refreshToken);
    }

    public async Task<ErrorOr<Success>> Logout(LogoutRequest request)
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId))
            return Error.Unauthorized("User.Unauthorized", "Người dùng chưa đăng nhập");

        return await _tokenManager.RevokeToken(userId, request.RefreshToken);
    }

    public async Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request)
    {

        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var uid))
            return Error.Unauthorized("User.Unauthorized", "Người dùng chưa đăng nhập");

        var userEntity = await _userRepository.FindById(uid);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        var isOldPasswordValid = _passwordHasher.VerifyHashedPassword(userEntity.Password!, request.OldPassword);
        if (!isOldPasswordValid)
            return Error.Validation("User.InvalidPassword", "Mật khẩu cũ không đúng");

        userEntity.ChangePassword(_passwordHasher.HashPassword(request.NewPassword), _user.Id ?? string.Empty);
        _userRepository.Update(userEntity);

        return Result.Success;
    }

    public Task<ErrorOr<Success>> ForgotPassword(ForgotPasswordRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> SendOtp(string email)
    {
        throw new NotImplementedException();
    }

    public async Task<ErrorOr<UserInfoVm>> GetUserInfo()
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var uid))
            return Error.Unauthorized("User.Unauthorized", "Người dùng chưa đăng nhập");

        var userEntity = await _userRepository.FindById(uid);
        if (userEntity is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        var rolesResult = await _roleRepository.FindByUserId(userId);
        var roles = rolesResult.IsError
            ? []
            : rolesResult.Value.Select(r => new UserRoleVm(r.Type, r.Id.ToString(), r.Name)).ToList();

        return new UserInfoVm(
            userEntity.Id,
            userEntity.Username,
            userEntity.FullName,
            userEntity.Email,
            userEntity.AvatarUrl,
            userEntity.ForcePasswordChange,
            roles,
            []);
    }

    public Task<ErrorOr<Success>> UpdateUserInfo(UpdateUserInfoRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<ErrorOr<List<TabVm>>> GetTabs()
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId))
            return Error.Unauthorized("User.Unauthorized", "Người dùng chưa đăng nhập");

        return new List<TabVm>();
    }

    public async Task<ErrorOr<Success>> ConfirmRegister(ConfirmRegisterRequest request)
    {
        if (!Guid.TryParse(request.code, out var guidCode))
             return Error.Validation("Register.InvalidCode", "Mã xác nhận không đúng định dạng Guid.");

        var register = await _registerRepository.GetByIdAsync(guidCode);

        if (register is null)
            return Error.NotFound("Register.NotFound", "Mã xác nhận không tồn tại hoặc đã được kích hoạt.");
        try
        {
            await _unitOfWork.ExecuteTransactionAsync(async () =>
            {
                var userRepo = _unitOfWork.GenericRepository<UserEntity>();
                var registerRepo = _unitOfWork.GenericRepository<RegisterEntity>();

                var user = new UserEntity
                {
                    Email = register.Email,
                    Username = register.Username,
                    FullName = register.FullName,
                    Password = register.Password
                };

                await userRepo.AddAsync(user);
                await registerRepo.DeleteAsync(guidCode);
            });

            return Result.Success;
        }
        catch
        {
            return Error.Failure("Register.ConfirmationFailed", "Xác nhận đăng ký thất bại.");
        }
    }
}
