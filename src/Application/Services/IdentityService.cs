using Application.Common.Interfaces;
using Application.Common.Auth;
using Application.Common.Constant;
using Contracts.Interfaces;
using Application.Contracts.Identity;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Mails;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Configuration;
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
    Task<ErrorOr<Success>> ResetPassword(ResetPasswordRequest request);
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
    IMailRepository mailRepository,
    IOtpRepository otpRepository,
    IPasswordResetTokenRepository passwordResetTokenRepository,
    IConfiguration configuration
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
    private readonly IOtpRepository _otpRepository = otpRepository;
    private readonly IPasswordResetTokenRepository _passwordResetTokenRepository = passwordResetTokenRepository;
    private readonly IConfiguration _configuration = configuration;

    public async Task<ErrorOr<Success>> Register(RegisterRequest request)
    {
        // Check if email is temporarily locked due to failed attempts
        var lockoutExpiration = await _otpRepository.GetLockoutExpiration(request.Email);
        if (lockoutExpiration.IsError)
        {
            return Error.Failure("Auth.LockoutCheckFailed", "Unable to verify registration eligibility");
        }

        if (lockoutExpiration.Value.HasValue)
        {
            var remainingMinutes = (lockoutExpiration.Value.Value - DateTimeOffset.UtcNow).TotalMinutes;
            var minutes = Math.Ceiling(remainingMinutes).ToString("F0");
            return Error.Custom(403, ErrorConstants.Auth.EmailTemporarilyLockedCode,
                ErrorConstants.Auth.EmailTemporarilyLockedDescription.Format(new(minutes)));
        }

        var isUnique = await _userRepository.IsEmailUnique(request.Email);
        if (!isUnique)
        {
            // Increment failed attempts on duplicate email (email already registered)
            await _otpRepository.IncrementFailedAttempts(request.Email);
            return Error.Conflict("User.DuplicateEmail", "Email đã được sử dụng");
        }

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

            // Clear failed attempts on successful registration
            await _otpRepository.ClearFailedAttempts(request.Email);
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
        }

        return Result.Success;
    }

    public async Task<ErrorOr<LoginResponse>> Login(LoginRequest request)
    {
        var userEntity = await _userRepository.FindByEmail(request.Email);
        if (userEntity is null)
            return Error.NotFound(ErrorConstants.User.NotFoundCode, ErrorConstants.User.NotFoundForInvalidCredentialsDescription);

        var isPasswordValid = _passwordHasher.VerifyHashedPassword(userEntity.Password!, request.Password);
        if (!isPasswordValid)
            return Error.Validation("User.InvalidPassword", "Email hoặc mật khẩu ");

        var tokenResult = await _tokenManager.GenerateToken(userEntity);
        if (tokenResult.IsError)
            return tokenResult.Errors;

        var portalResult = await ResolvePortalAsync(userEntity.Id);
        if (portalResult.IsError)
        {
            return portalResult.Errors;
        }

        var (accessToken, refreshToken) = tokenResult.Value;
        return new LoginResponse(accessToken, refreshToken, portalResult.Value.Portal, portalResult.Value.DefaultPath);
    }

    public async Task<ErrorOr<ExternalLoginResponse>> ExternalLogin(ExternalLoginRequest request)
    {
        // 1. Try to find user by GoogleId
        var userEntity = await _userRepository.FindByGoogleId(request.ProviderKey);

        if (userEntity is null)
        {
            // 2. Try to find user by email — link the GoogleId
            userEntity = await _userRepository.FindByEmail(request.ProviderEmail);
            if (userEntity is not null)
            {
                userEntity.LinkGoogle(request.ProviderKey, "google");
                _userRepository.Update(userEntity);
                await _unitOfWork.SaveChangeAsync();
            }
            else
            {
                // 3. Create a new user from Google info
                userEntity = UserEntity.CreateFromGoogle(
                    request.ProviderKey,
                    request.ProviderEmail,
                    request.FullName,
                    null);

                try
                {
                    await _unitOfWork.BeginTransactionAsync();
                    await _userRepository.Create(userEntity);

                    var addRoleResult = await _roleRepository.AddUser(userEntity.Id, [DefaultRoleIds.Customer]);
                    if (addRoleResult.IsError)
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        return addRoleResult.Errors;
                    }

                    await _unitOfWork.SaveChangeAsync();
                    await _unitOfWork.CommitTransactionAsync();
                }
                catch
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    throw;
                }
            }
        }

        var tokenResult = await _tokenManager.GenerateToken(userEntity);
        if (tokenResult.IsError)
            return tokenResult.Errors;

        var portalResult = await ResolvePortalAsync(userEntity.Id);
        if (portalResult.IsError)
        {
            return portalResult.Errors;
        }

        var (accessToken, refreshToken) = tokenResult.Value;
        return new ExternalLoginResponse(accessToken, refreshToken, portalResult.Value.Portal, portalResult.Value.DefaultPath);
    }

    public async Task<ErrorOr<RefreshTokenResponse>> Refresh(RefreshTokenRequest request)
    {
        var result = await _tokenManager.RefreshToken(request.RefreshToken);
        if (result.IsError)
            return result.Errors;

        var portalResult = await ResolvePortalAsync(result.Value.UserId);
        if (portalResult.IsError)
        {
            return portalResult.Errors;
        }

        var (accessToken, refreshToken, _) = result.Value;
        return new RefreshTokenResponse(accessToken, refreshToken, portalResult.Value.Portal, portalResult.Value.DefaultPath);
    }

    public async Task<ErrorOr<Success>> Logout(LogoutRequest request)
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId))
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);

        return await _tokenManager.RevokeToken(userId, request.RefreshToken);
    }

    public async Task<ErrorOr<Success>> ChangePassword(ChangePasswordRequest request)
    {

        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var uid))
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);

        var userEntity = await _userRepository.FindById(uid);
        if (userEntity is null)
            return Error.NotFound(ErrorConstants.User.NotFoundCode, ErrorConstants.User.NotFoundDescription);

        var isOldPasswordValid = _passwordHasher.VerifyHashedPassword(userEntity.Password!, request.OldPassword);
        if (!isOldPasswordValid)
            return Error.Validation(ErrorConstants.User.InvalidPasswordCode, ErrorConstants.User.InvalidPasswordDescription);

        userEntity.ChangePassword(_passwordHasher.HashPassword(request.NewPassword), _user.Id ?? string.Empty);
        _userRepository.Update(userEntity);

        return Result.Success;
    }

    public async Task<ErrorOr<Success>> ForgotPassword(ForgotPasswordRequest request)
    {
        // Find user by email
        var userEntity = await _userRepository.FindByEmail(request.Email);

        // Always return success to prevent email enumeration
        // Only send email if user exists

        if (userEntity is null)
        {
            return Result.Success;
        }

        // Generate secure token
        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        var tokenHash = _passwordHasher.HashPassword(token);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(15); // 15 minutes expiry

        // Create reset token record
        var resetToken = Domain.Entities.PasswordResetTokenEntity.Create(
            userEntity.Id.ToString(),
            tokenHash,
            expiresAt);

        var tokenResult = await _passwordResetTokenRepository.CreateAsync(resetToken);
        if (tokenResult.IsError)
        {
            return Error.Failure("PasswordReset.Failed", "Failed to create reset token");
        }

        // Get frontend URL from config
        var frontendUrl = _configuration["AppConfig:FrontendBaseUrl"] ?? "http://localhost:3001";
        var resetLink = $"{frontendUrl}/reset-password?token={token}";

        // Create and queue password reset email
        var mailEntity = new Domain.Mails.MailEntity
        {
            To = request.Email,
            Subject = "Đặt Lại Mật Khẩu",
            Body = JsonSerializer.Serialize(new Domain.Mails.PasswordResetMail(resetLink, userEntity.Username ?? userEntity.Email, 15)),
            Template = nameof(Domain.Mails.PasswordResetMail),
        };

        var mailRepo = _unitOfWork.GenericRepository<Domain.Mails.MailEntity>();
        await mailRepo.AddAsync(mailEntity);
        await _unitOfWork.SaveChangeAsync();

        return Result.Success;
    }

    public async Task<ErrorOr<Success>> ResetPassword(ResetPasswordRequest request)
    {
        // Find valid token
        var tokenHash = _passwordHasher.HashPassword(request.Token);
        var tokenResult = await _passwordResetTokenRepository.GetValidTokenAsync(tokenHash);

        if (tokenResult.IsError)
        {
            return Error.NotFound("PasswordReset.InvalidToken", "Invalid or expired reset token");
        }

        var resetToken = tokenResult.Value;
        if (resetToken is null)
        {
            return Error.NotFound("PasswordReset.InvalidToken", "Invalid or expired reset token");
        }

        // Find user
        if (!Guid.TryParse(resetToken.UserId, out var userId))
        {
            return Error.Failure("PasswordReset.InvalidToken", "Invalid user ID in token");
        }

        var userEntity = await _userRepository.FindById(userId);
        if (userEntity is null)
        {
            return Error.NotFound("PasswordReset.UserNotFound", "User not found");
        }

        // Update password
        userEntity.ChangePassword(_passwordHasher.HashPassword(request.NewPassword), userId.ToString());
        _userRepository.Update(userEntity);

        // Mark token as used
        await _passwordResetTokenRepository.MarkAsUsedAsync(resetToken.Id);

        // Delete all tokens for this user (security: invalidate all outstanding tokens)
        await _passwordResetTokenRepository.DeleteByUserIdAsync(userId.ToString());

        await _unitOfWork.SaveChangeAsync();

        return Result.Success;
    }

    public Task<ErrorOr<Success>> SendOtp(string email)
    {
        throw new NotImplementedException();
    }

    public async Task<ErrorOr<UserInfoVm>> GetUserInfo()
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var uid))
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);

        var userEntity = await _userRepository.FindById(uid);
        if (userEntity is null)
            return Error.NotFound(ErrorConstants.User.NotFoundCode, ErrorConstants.User.NotFoundDescription);

        var rolesResult = await _roleRepository.FindByUserId(userId);
        var roles = rolesResult.IsError
            ? []
            : rolesResult.Value.Select(r => new UserRoleVm(r.Type, r.Id.ToString(), r.Name)).ToList();

        var portalRouting = AuthPortalResolver.Resolve(roles.Select(role => role.Type));

        return new UserInfoVm(
            userEntity.Id,
            userEntity.Username,
            userEntity.FullName,
            userEntity.Email,
            userEntity.AvatarUrl,
            userEntity.ForcePasswordChange,
            roles,
            [],
            portalRouting.Portal,
            portalRouting.DefaultPath);
    }

    public Task<ErrorOr<Success>> UpdateUserInfo(UpdateUserInfoRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<ErrorOr<List<TabVm>>> GetTabs()
    {
        var userId = _user.Id;
        if (string.IsNullOrEmpty(userId))
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);

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

    private async Task<ErrorOr<PortalRouting>> ResolvePortalAsync(Guid userId)
    {
        var rolesResult = await _roleRepository.FindByUserId(userId.ToString());
        if (rolesResult.IsError)
        {
            return rolesResult.Errors;
        }

        var roleTypes = (rolesResult.Value ?? []).Select(role => role.Type);
        return AuthPortalResolver.Resolve(roleTypes);
    }
}
