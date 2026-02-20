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

public class IdentityService : IIdentityService
{
    private readonly IUser _user;
    private readonly ITokenManager _tokenManager;

    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    private readonly IUserService _userService;

    public IdentityService(
        IUser user,
        ITokenManager tokenManager,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IUserService userService)
    {
        _user = user;
        _tokenManager = tokenManager;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _userService = userService;
    }

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