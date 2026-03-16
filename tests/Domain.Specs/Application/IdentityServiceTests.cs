using Application.Common.Constant;
using Application.Common.Interfaces;
using Application.Contracts.Identity;
using Application.Services;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Mails;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Configuration;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class IdentityServiceTests
{
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly ITokenManager _tokenManager = Substitute.For<ITokenManager>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IPasswordHasher _passwordHasher = Substitute.For<IPasswordHasher>();
    private readonly IUserService _userService = Substitute.For<IUserService>();
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IRoleRepository _roleRepository = Substitute.For<IRoleRepository>();
    private readonly IRegisterRepository _registerRepository = Substitute.For<IRegisterRepository>();
    private readonly IMailRepository _mailRepository = Substitute.For<IMailRepository>();
    private readonly IOtpRepository _otpRepository = Substitute.For<IOtpRepository>();
    private readonly IPasswordResetTokenRepository _passwordResetTokenRepository = Substitute.For<IPasswordResetTokenRepository>();
    private readonly IConfiguration _configuration = Substitute.For<IConfiguration>();
    private readonly IdentityService _sut;

    public IdentityServiceTests()
    {
        _configuration["App:FrontendUrl"].Returns("http://localhost:3001");
        _sut = new IdentityService(
            _user,
            _tokenManager,
            _unitOfWork,
            _passwordHasher,
            _userService,
            _userRepository,
            _roleRepository,
            _registerRepository,
            _mailRepository,
            _otpRepository,
            _passwordResetTokenRepository,
            _configuration);
    }

    [Fact]
    public async Task Register_WhenEmailUnique_ShouldQueueRegisterAndWelcomeMail()
    {
        var registerRepo = Substitute.For<IRepository<RegisterEntity>>();
        var mailRepo = Substitute.For<IRepository<MailEntity>>();
        _unitOfWork.GenericRepository<RegisterEntity>().Returns(registerRepo);
        _unitOfWork.GenericRepository<MailEntity>().Returns(mailRepo);

        _userRepository.IsEmailUnique("new@example.com").Returns(true);
        _passwordHasher.HashPassword("secret123").Returns("hashed-secret");
        _unitOfWork.ExecuteTransactionAsync(Arg.Any<Func<Task>>())
            .Returns(callInfo => ((Func<Task>)callInfo[0])());

        var result = await _sut.Register(new RegisterRequest("newuser", "New User", "new@example.com", "secret123"));

        Assert.False(result.IsError);
        await _unitOfWork.Received(1).ExecuteTransactionAsync(Arg.Any<Func<Task>>());
        await registerRepo.Received(1).AddAsync(Arg.Is<RegisterEntity>(entity =>
            entity.Email == "new@example.com" &&
            entity.Username == "newuser" &&
            entity.Password == "hashed-secret"));
        await mailRepo.Received(1).AddAsync(Arg.Is<MailEntity>(entity =>
            entity.To == "new@example.com" &&
            entity.Template == nameof(RegisterMail)));
    }

    [Fact]
    public async Task Register_WhenTransactionThrows_ShouldRollbackAndReturnSuccess()
    {
        _userRepository.IsEmailUnique("new@example.com").Returns(true);
        _unitOfWork.ExecuteTransactionAsync(Arg.Any<Func<Task>>())
            .Returns<Task>(_ => throw new InvalidOperationException("boom"));

        var result = await _sut.Register(new RegisterRequest("newuser", "New User", "new@example.com", "secret123"));

        Assert.False(result.IsError);
        await _unitOfWork.Received(1).RollbackTransactionAsync();
    }

    [Fact]
    public async Task ExternalLogin_WhenCreatingNewGoogleUser_ShouldCreateUserWithCustomerRole()
    {
        _userRepository.FindByGoogleId("google-key").Returns((UserEntity?)null);
        _userRepository.FindByEmail("google@example.com").Returns((UserEntity?)null);
        _roleRepository.AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>()).Returns(Result.Success);
        _roleRepository.FindByUserId(Arg.Any<string>()).Returns(new List<RoleEntity>
        {
            RoleEntity.Create("Admin", "Admin role", 9, "seed")
        });
        _tokenManager.GenerateToken(Arg.Any<UserEntity>())
            .Returns((ValueTuple<string, string>)("access-token", "refresh-token"));

        var result = await _sut.ExternalLogin(
            new ExternalLoginRequest(AuthProviders.Google, "google-key", "google@example.com", "Google User"));

        Assert.False(result.IsError);
        Assert.Equal("access-token", result.Value.AccessToken);
        await _userRepository.Received(1).Create(Arg.Is<UserEntity>(user =>
            user.GoogleId == "google-key" &&
            user.Balance == 0m));
        await _roleRepository.Received(1).AddUser(
            Arg.Any<Guid>(),
            Arg.Is<List<int>>(roleIds => roleIds.Count == 1 && roleIds[0] == DefaultRoleIds.Customer));
        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task ExternalLogin_WhenUserExistsByEmail_ShouldLinkGoogleWithoutAddingCustomerRole()
    {
        var existingUser = UserEntity.Create(
            "existing@example.com",
            "Existing User",
            "existing@example.com",
            "hashed-password",
            "seed");

        _userRepository.FindByGoogleId("google-key").Returns((UserEntity?)null);
        _userRepository.FindByEmail("existing@example.com").Returns(existingUser);
        _roleRepository.FindByUserId(Arg.Any<string>()).Returns(new List<RoleEntity>
        {
            RoleEntity.Create("Customer", "Customer role", 3, "seed")
        });
        _tokenManager.GenerateToken(existingUser)
            .Returns((ValueTuple<string, string>)("access-token", "refresh-token"));

        var result = await _sut.ExternalLogin(
            new ExternalLoginRequest(AuthProviders.Google, "google-key", "existing@example.com", "Existing User"));

        Assert.False(result.IsError);
        _userRepository.Received(1).Update(Arg.Is<UserEntity>(user => user.GoogleId == "google-key"));
        await _roleRepository.DidNotReceive().AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>());
        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
    }
}
