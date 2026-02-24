using Application.Common.Interfaces;
using Application.Contracts.Identity;
using Domain.UnitOfWork;
using ErrorOr;

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
}

public class IdentityService(
    IUser user,
    ITokenManager tokenManager,
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    IUserService userService)
    : IIdentityService
{
    private readonly IUser _user = user;
    private readonly ITokenManager _tokenManager = tokenManager;

    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;

    private readonly IUserService _userService = userService;

    public Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<ExternalLoginResponse>> ExternalLogin(ExternalLoginRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> ForgotPassword(ForgotPasswordRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<TabVm>>> GetTabs()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<UserInfoVm>> GetUserInfo()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<LoginResponse>> Login(LoginRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Logout(LogoutRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<RefreshTokenResponse>> Refresh(RefreshTokenRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Register(RegisterRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> SendOtp(string email)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> UpdateUserInfo(UpdateUserInfoRequest request)
    {
        throw new NotImplementedException();
    }
}