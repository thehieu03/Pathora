using Application.Common.Interfaces;
using Application.Contracts.Identity;
using Application.Services;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using NSubstitute.ReceivedExtensions;

namespace Domain.Specs.Application;

public sealed class IdentityServicePortalMetadataTests
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

    public IdentityServicePortalMetadataTests()
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
    public async Task Login_WhenCustomerRole_ShouldReturnUserPortalMetadata()
    {
        var userId = Guid.CreateVersion7();
        var userEntity = UserEntity.Create("customer@example.com", "Customer", "customer", "hashed", "seed");
        userEntity.Id = userId;

        _userRepository.FindByEmail("customer@example.com").Returns(userEntity);
        _passwordHasher.VerifyHashedPassword("hashed", "secret").Returns(true);
        _tokenManager.GenerateToken(userEntity).Returns(("access-token", "refresh-token"));
        _roleRepository.FindByUserId(userId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 9, Name = "Customer", Type = 2 }
        });

        var result = await _sut.Login(new LoginRequest("customer@example.com", "secret"));

        Assert.False(result.IsError);
        Assert.Equal("user", result.Value.Portal);
        Assert.Equal("/home", result.Value.DefaultPath);
    }

    [Fact]
    public async Task ExternalLogin_WhenInternalRole_ShouldReturnAdminPortalMetadata()
    {
        var userId = Guid.CreateVersion7();
        var userEntity = UserEntity.Create("staff@example.com", "Staff", "staff", "hashed", "seed");
        userEntity.Id = userId;

        _userRepository.FindByGoogleId("google-key").Returns(userEntity);
        _tokenManager.GenerateToken(userEntity).Returns(("access-token", "refresh-token"));
        _roleRepository.FindByUserId(userId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 2, Name = "Admin", Type = 9 }
        });

        var result = await _sut.ExternalLogin(
            new ExternalLoginRequest("Google", "google-key", "staff@example.com", "Staff"));

        Assert.False(result.IsError);
        Assert.Equal("admin", result.Value.Portal);
        Assert.Equal("/dashboard", result.Value.DefaultPath);
    }

    [Fact]
    public async Task Refresh_WhenSucceeded_ShouldReturnPortalMetadata()
    {
        var userId = Guid.CreateVersion7();
        _tokenManager.RefreshToken("refresh-token")
            .Returns(("new-access-token", "new-refresh-token", userId));
        _roleRepository.FindByUserId(userId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 2, Name = "Admin", Type = 9 }
        });

        var result = await _sut.Refresh(new RefreshTokenRequest("refresh-token"));

        Assert.False(result.IsError);
        Assert.Equal("admin", result.Value.Portal);
        Assert.Equal("/dashboard", result.Value.DefaultPath);
    }

    [Fact]
    public async Task GetUserInfo_WhenInternalRole_ShouldReturnPortalMetadata()
    {
        var userId = Guid.CreateVersion7();
        var userEntity = UserEntity.Create("staff@example.com", "Staff", "staff", "hashed", "seed");
        userEntity.Id = userId;

        _user.Id.Returns(userId.ToString());
        _userRepository.FindById(userId).Returns(userEntity);
        _roleRepository.FindByUserId(userId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 2, Name = "Admin", Type = 9 }
        });

        var result = await _sut.GetUserInfo();

        Assert.False(result.IsError);
        Assert.Equal("admin", result.Value.Portal);
        Assert.Equal("/dashboard", result.Value.DefaultPath);
    }
}
