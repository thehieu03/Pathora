using Application.Features.TourRequest.Commands;
using Application.Features.TourRequest.Queries;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class TourRequestHandlerTests
{
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IRoleRepository _roleRepository = Substitute.For<IRoleRepository>();
    private readonly ITourRequestRepository _tourRequestRepository = Substitute.For<ITourRequestRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IMailRepository _mailRepository = Substitute.For<IMailRepository>();

    public TourRequestHandlerTests()
    {
        _mailRepository
            .Add(Arg.Any<global::Domain.Mails.MailEntity>())
            .Returns(Task.FromResult<ErrorOr<Success>>(Result.Success));
    }

    [Fact]
    public async Task CreateTourRequestHandler_WhenValid_ShouldCreatePendingRequest()
    {
        var userId = Guid.CreateVersion7();
        _user.Id.Returns(userId.ToString());
        _userRepository.FindById(userId).Returns(new UserEntity
        {
            Id = userId,
            Username = "customer01",
            FullName = "Customer Name",
            Email = "customer01@example.com",
            PhoneNumber = "0900000000"
        });

        var handler = new CreateTourRequestCommandHandler(
            _user,
            _userRepository,
            _tourRequestRepository,
            _unitOfWork,
            _mailRepository,
            NullLogger<CreateTourRequestCommandHandler>.Instance);

        var command = new CreateTourRequestCommand(
            Destination: "Ha Long",
            StartDate: new DateTimeOffset(2026, 4, 10, 0, 0, 0, TimeSpan.Zero),
            EndDate: new DateTimeOffset(2026, 4, 12, 0, 0, 0, TimeSpan.Zero),
            NumberOfParticipants: 3,
            BudgetPerPersonUsd: 250,
            TravelInterests: ["Adventure", "NatureAndWildlife"],
            PreferredAccommodation: "3-star hotel",
            TransportationPreference: "Bus",
            SpecialRequests: "Window seat");

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        await _tourRequestRepository.Received(1).AddAsync(Arg.Is<TourRequestEntity>(entity =>
            entity.UserId == userId
            && entity.Status == TourRequestStatus.Pending
            && entity.Destination == "Ha Long"
            && entity.NumberAdult == 3
            && entity.TravelInterests.Count == 2));
        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateTourRequestHandler_WhenUserUnauthorized_ShouldReturnUnauthorized()
    {
        _user.Id.Returns((string?)null);
        var handler = new CreateTourRequestCommandHandler(
            _user,
            _userRepository,
            _tourRequestRepository,
            _unitOfWork,
            _mailRepository,
            NullLogger<CreateTourRequestCommandHandler>.Instance);

        var command = new CreateTourRequestCommand(
            "Ha Long",
            new DateTimeOffset(2026, 4, 10, 0, 0, 0, TimeSpan.Zero),
            new DateTimeOffset(2026, 4, 12, 0, 0, 0, TimeSpan.Zero),
            3,
            250,
            ["Adventure"]);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorOr.ErrorType.Unauthorized, result.FirstError.Type);
    }

    [Fact]
    public async Task GetMyTourRequestsHandler_WhenAuthenticated_ShouldReturnOnlyOwnRequests()
    {
        var userId = Guid.CreateVersion7();
        _user.Id.Returns(userId.ToString());

        var entity = CreateTourRequestEntity(userId: userId);
        _tourRequestRepository.GetByUserIdAsync(userId, 1, 10, true).Returns([entity]);
        _tourRequestRepository.CountByUserIdAsync(userId).Returns(1);

        var handler = new GetMyTourRequestsQueryHandler(_user, _tourRequestRepository);
        var result = await handler.Handle(new GetMyTourRequestsQuery(userId.ToString()), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        Assert.Equal("Ha Long", result.Value.Data[0].Destination);
        Assert.Equal("Pending", result.Value.Data[0].Status);
    }

    [Fact]
    public async Task GetTourRequestDetailHandler_WhenOwner_ShouldReturnDetail()
    {
        var userId = Guid.CreateVersion7();
        var requestId = Guid.CreateVersion7();
        _user.Id.Returns(userId.ToString());
        _roleRepository.FindByUserId(userId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 10, Name = "Customer", Type = 3 }
        });
        _tourRequestRepository.GetByIdAsync(requestId, true).Returns(CreateTourRequestEntity(requestId, userId));

        var handler = new GetTourRequestDetailQueryHandler(_user, _roleRepository, _tourRequestRepository);
        var result = await handler.Handle(new GetTourRequestDetailQuery(requestId, userId.ToString()), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(requestId, result.Value.Id);
    }

    [Fact]
    public async Task GetTourRequestDetailHandler_WhenNotOwnerAndNotAdmin_ShouldReturnForbidden()
    {
        var currentUserId = Guid.CreateVersion7();
        var ownerId = Guid.CreateVersion7();
        var requestId = Guid.CreateVersion7();
        _user.Id.Returns(currentUserId.ToString());
        _roleRepository.FindByUserId(currentUserId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 10, Name = "Customer", Type = 3 }
        });
        _tourRequestRepository.GetByIdAsync(requestId, true).Returns(CreateTourRequestEntity(requestId, ownerId));

        var handler = new GetTourRequestDetailQueryHandler(_user, _roleRepository, _tourRequestRepository);
        var result = await handler.Handle(new GetTourRequestDetailQuery(requestId, currentUserId.ToString()), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorOr.ErrorType.Forbidden, result.FirstError.Type);
    }

    [Fact]
    public async Task GetAllTourRequestsHandler_WhenAdmin_ShouldReturnPagedRequests()
    {
        var currentUserId = Guid.CreateVersion7();
        _user.Id.Returns(currentUserId.ToString());
        _roleRepository.FindByUserId(currentUserId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 2, Name = "Admin", Type = 9 }
        });

        _tourRequestRepository.GetAllAsync(
            Arg.Any<TourRequestStatus?>(),
            Arg.Any<DateTimeOffset?>(),
            Arg.Any<DateTimeOffset?>(),
            Arg.Any<string?>(),
            Arg.Any<int>(),
            Arg.Any<int>(),
            true).Returns([CreateTourRequestEntity()]);

        _tourRequestRepository.CountAllAsync(
            Arg.Any<TourRequestStatus?>(),
            Arg.Any<DateTimeOffset?>(),
            Arg.Any<DateTimeOffset?>(),
            Arg.Any<string?>()).Returns(1);

        var handler = new GetAllTourRequestsQueryHandler(_user, _roleRepository, _tourRequestRepository);
        var result = await handler.Handle(new GetAllTourRequestsQuery(currentUserId.ToString()), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
    }

    [Fact]
    public async Task ReviewTourRequestHandler_WhenAdminApproves_ShouldUpdateStatus()
    {
        var currentUserId = Guid.CreateVersion7();
        var requestId = Guid.CreateVersion7();
        _user.Id.Returns(currentUserId.ToString());
        _roleRepository.FindByUserId(currentUserId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 1, Name = "SuperAdmin", Type = 9 }
        });

        var entity = CreateTourRequestEntity(requestId, Guid.CreateVersion7());
        _tourRequestRepository.GetByIdAsync(requestId, false).Returns(entity);

        var handler = new ReviewTourRequestCommandHandler(
            _user,
            _roleRepository,
            _userRepository,
            _tourRequestRepository,
            _unitOfWork,
            _mailRepository,
            NullLogger<ReviewTourRequestCommandHandler>.Instance);
        var result = await handler.Handle(
            new ReviewTourRequestCommand(requestId, TourRequestStatus.Approved, "Approved by admin"),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(TourRequestStatus.Approved, entity.Status);
        Assert.Equal(currentUserId, entity.ReviewedBy);
        await _tourRequestRepository.Received(1).UpdateAsync(entity);
        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ReviewTourRequestHandler_WhenInvalidTransition_ShouldReturnValidationError()
    {
        var currentUserId = Guid.CreateVersion7();
        var requestId = Guid.CreateVersion7();
        _user.Id.Returns(currentUserId.ToString());
        _roleRepository.FindByUserId(currentUserId.ToString()).Returns(new List<RoleEntity>
        {
            new() { Id = 1, Name = "SuperAdmin", Type = 9 }
        });

        var entity = CreateTourRequestEntity(requestId, Guid.CreateVersion7());
        entity.Approve(currentUserId, currentUserId.ToString(), adminNote: "already approved");
        _tourRequestRepository.GetByIdAsync(requestId, false).Returns(entity);

        var handler = new ReviewTourRequestCommandHandler(
            _user,
            _roleRepository,
            _userRepository,
            _tourRequestRepository,
            _unitOfWork,
            _mailRepository,
            NullLogger<ReviewTourRequestCommandHandler>.Instance);
        var result = await handler.Handle(
            new ReviewTourRequestCommand(requestId, TourRequestStatus.Rejected, "reject after approve"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorOr.ErrorType.Validation, result.FirstError.Type);
    }

    private static TourRequestEntity CreateTourRequestEntity(Guid? requestId = null, Guid? userId = null)
    {
        var entity = TourRequestEntity.Create(
            customerName: "Customer Name",
            customerPhone: "0900000000",
            destination: "Ha Long",
            departureDate: new DateTimeOffset(2026, 4, 10, 0, 0, 0, TimeSpan.Zero),
            numberAdult: 3,
            performedBy: "system",
            userId: userId,
            customerEmail: "customer@example.com",
            returnDate: new DateTimeOffset(2026, 4, 12, 0, 0, 0, TimeSpan.Zero),
            budget: 250,
            travelInterests: ["Adventure", "NatureAndWildlife"],
            preferredAccommodation: "3-star hotel",
            transportationPreference: "Bus",
            specialRequirements: "Window seat");

        if (requestId.HasValue)
        {
            entity.Id = requestId.Value;
        }

        return entity;
    }
}
