//using Application.Common.Constant;
//using Application.Common.Interfaces;
//using Application.Contracts.Identity;
//using Application.Services;
//using Contracts.Interfaces;
//using Domain.Common.Repositories;
//using Domain.Entities;
//using Domain.UnitOfWork;
//using ErrorOr;
//using NSubstitute;

//namespace Domain.Specs.Application;

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
    private readonly IdentityService _sut;

    public IdentityServiceTests()
    {
        _sut = new IdentityService(
            _user,
            _tokenManager,
            _unitOfWork,
            _passwordHasher,
            _userService,
            _userRepository,
            _roleRepository,
            _registerRepository,
            _mailRepository);
    }



    [Fact]
    public async Task Register_WhenRoleAssignmentSucceeds_ShouldCreateUserWithZeroBalanceAndCustomerRole()
    {
        _userRepository.IsEmailUnique("new@example.com").Returns(true);
        _passwordHasher.HashPassword("secret123").Returns("hashed-secret");
        _roleRepository.AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>()).Returns(Result.Success);

//        var result = await _sut.Register(new RegisterRequest("newuser", "New User", "new@example.com", "secret123"));

//        Assert.False(result.IsError);
//        await _unitOfWork.Received(1).BeginTransactionAsync();
//        await _userRepository.Received(1).Create(Arg.Is<UserEntity>(u =>
//            u.Email == "new@example.com" &&
//            u.Password == "hashed-secret" &&
//            u.Balance == 0m));
//        await _roleRepository.Received(1).AddUser(
//            Arg.Any<Guid>(),
//            Arg.Is<List<int>>(roleIds => roleIds.Count == 1 && roleIds[0] == 9));
//        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
//        await _unitOfWork.Received(1).CommitTransactionAsync();
//    }

//    [Fact]
//    public async Task Register_WhenRoleAssignmentFails_ShouldRollbackAndReturnError()
//    {
//        _userRepository.IsEmailUnique("new@example.com").Returns(true);
//        _passwordHasher.HashPassword("secret123").Returns("hashed-secret");
//        _roleRepository.AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>())
//            .Returns(Error.Failure("Role.AssignFailed", "Cannot assign role"));

//        //var result = await _sut.Register(new RegisterRequest("newuser", "New User", "new@example.com", "secret123"));

//        Assert.True(result.IsError);
//        Assert.Equal("Role.AssignFailed", result.FirstError.Code);
//        await _unitOfWork.Received(1).RollbackTransactionAsync();
//        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
//    }

//    [Fact]
//    public async Task ExternalLogin_WhenCreatingNewGoogleUser_ShouldCreateUserWithZeroBalanceAndCustomerRole()
//    {
//        _userRepository.FindByGoogleId("google-key").Returns((UserEntity?)null);
//        _userRepository.FindByEmail("google@example.com").Returns((UserEntity?)null);
//        _roleRepository.AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>()).Returns(Result.Success);
//        _tokenManager.GenerateToken(Arg.Any<UserEntity>())
//            .Returns((ValueTuple<string, string>)("access-token", "refresh-token"));

//        var result = await _sut.ExternalLogin(
//            new ExternalLoginRequest(AuthProviders.Google, "google-key", "google@example.com", "Google User"));

//        Assert.False(result.IsError);
//        Assert.Equal("access-token", result.Value.AccessToken);
//        await _userRepository.Received(1).Create(Arg.Is<UserEntity>(u =>
//            u.GoogleId == "google-key" &&
//            u.Balance == 0m));
//        await _roleRepository.Received(1).AddUser(
//            Arg.Any<Guid>(),
//            Arg.Is<List<int>>(roleIds => roleIds.Count == 1 && roleIds[0] == 9));
//        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
//        await _unitOfWork.Received(1).CommitTransactionAsync();
//    }

//    [Fact]
//    public async Task ExternalLogin_WhenUserExistsByEmail_ShouldLinkGoogleWithoutAddingCustomerRole()
//    {
//        var existingUser = UserEntity.Create(
//            "existing@example.com",
//            "Existing User",
//            "existing@example.com",
//            "hashed-password",
//            "seed");
//        _userRepository.FindByGoogleId("google-key").Returns((UserEntity?)null);
//        _userRepository.FindByEmail("existing@example.com").Returns(existingUser);
//        _tokenManager.GenerateToken(existingUser)
//            .Returns((ValueTuple<string, string>)("access-token", "refresh-token"));

//        var result = await _sut.ExternalLogin(
//            new ExternalLoginRequest(AuthProviders.Google, "google-key", "existing@example.com", "Existing User"));

//        Assert.False(result.IsError);
//        _userRepository.Received(1).Update(Arg.Is<UserEntity>(u => u.GoogleId == "google-key"));
//        await _roleRepository.DidNotReceive().AddUser(Arg.Any<Guid>(), Arg.Any<List<int>>());
//        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
//    }
//}
