using Application.Features.TourInstance.Commands;
using Application.Services;
using AutoMapper;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Application.Services;

public sealed class TourInstanceServiceTests
{
    private readonly ITourInstanceRepository _tourInstanceRepository = Substitute.For<ITourInstanceRepository>();
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly ILogger<TourInstanceService> _logger = Substitute.For<ILogger<TourInstanceService>>();

    private TourInstanceService CreateService() =>
        new(_tourInstanceRepository, _tourRepository, _user, _mapper, _logger);

    private static TourEntity CreateTourWithClassification(Guid classificationId)
    {
        var tour = TourEntity.Create(
            tourName: "Ha Long Tour",
            shortDescription: "Short",
            longDescription: "Long",
            performedBy: "system");

        var classification = TourClassificationEntity.Create(
            tourId: tour.Id,
            name: "Standard",
            basePrice: 1000,
            description: "Desc",
            numberOfDay: 3,
            numberOfNight: 2,
            performedBy: "system");
        classification.Id = classificationId;
        tour.Classifications.Add(classification);

        return tour;
    }

    [Fact]
    public async Task Create_WithAuthenticatedUser_AutoBindsManagerAndUsesEntityId()
    {
        var classificationId = Guid.NewGuid();
        var creatorUserId = Guid.NewGuid();
        var tour = CreateTourWithClassification(classificationId);
        TourInstanceEntity? captured = null;

        _user.Id.Returns(creatorUserId.ToString());
        _tourRepository.FindById(Arg.Any<Guid>()).Returns(tour);
        _tourInstanceRepository.Create(Arg.Do<TourInstanceEntity>(e => captured = e)).Returns(Task.CompletedTask);

        var command = new CreateTourInstanceCommand(
            TourId: tour.Id,
            ClassificationId: classificationId,
            Title: "Instance 01",
            InstanceType: TourType.Public,
            StartDate: DateTimeOffset.UtcNow.AddDays(1),
            EndDate: DateTimeOffset.UtcNow.AddDays(3),
            MaxParticipation: 20,
            BasePrice: 1000,
            IncludedServices: ["shuttle"],
            GuideUserIds: []);

        var service = CreateService();
        var result = await service.Create(command);

        Assert.False(result.IsError);
        Assert.NotNull(captured);

        // Task 6.1: one manager row added with correct userId and TourInstanceManagerRole.Manager
        var manager = captured!.Managers.SingleOrDefault(m => m.Role == TourInstanceManagerRole.Manager);
        Assert.NotNull(manager);
        Assert.Equal(creatorUserId, manager!.UserId);
        Assert.Equal(TourInstanceManagerRole.Manager, manager.Role);

        // Task 6.3: manager entity has correct entity ID (not Guid.Empty)
        Assert.Equal(captured.Id, manager.TourInstanceId);
        Assert.NotEqual(Guid.Empty, manager.TourInstanceId);
    }

    [Fact]
    public async Task Create_WithGuideUserIds_AddsGuideManagerRole()
    {
        // Task 6.1 extension: guide assignment adds TourInstanceManagerRole.Guide
        var classificationId = Guid.NewGuid();
        var creatorUserId = Guid.NewGuid();
        var guideUserId = Guid.NewGuid();
        var tour = CreateTourWithClassification(classificationId);
        TourInstanceEntity? captured = null;

        _user.Id.Returns(creatorUserId.ToString());
        _tourRepository.FindById(Arg.Any<Guid>()).Returns(tour);
        _tourInstanceRepository.Create(Arg.Do<TourInstanceEntity>(e => captured = e)).Returns(Task.CompletedTask);

        var command = new CreateTourInstanceCommand(
            TourId: tour.Id,
            ClassificationId: classificationId,
            Title: "Instance With Guide",
            InstanceType: TourType.Public,
            StartDate: DateTimeOffset.UtcNow.AddDays(1),
            EndDate: DateTimeOffset.UtcNow.AddDays(3),
            MaxParticipation: 20,
            BasePrice: 1000,
            IncludedServices: [],
            GuideUserIds: [guideUserId]);

        var service = CreateService();
        var result = await service.Create(command);

        Assert.False(result.IsError);
        Assert.NotNull(captured);

        // Manager auto-bound
        var manager = captured!.Managers.SingleOrDefault(m => m.Role == TourInstanceManagerRole.Manager);
        Assert.NotNull(manager);
        Assert.Equal(creatorUserId, manager!.UserId);

        // Guide assigned
        var guide = captured.Managers.SingleOrDefault(m => m.Role == TourInstanceManagerRole.Guide);
        Assert.NotNull(guide);
        Assert.Equal(guideUserId, guide!.UserId);
        Assert.Equal(captured.Id, guide.TourInstanceId);
    }

    [Fact]
    public async Task Create_WithNullUserId_ReturnsUnauthorized()
    {
        var classificationId = Guid.NewGuid();
        var tour = CreateTourWithClassification(classificationId);

        _user.Id.Returns((string?)null);
        _tourRepository.FindById(Arg.Any<Guid>()).Returns(tour);

        var command = new CreateTourInstanceCommand(
            TourId: tour.Id,
            ClassificationId: classificationId,
            Title: "Instance 01",
            InstanceType: TourType.Public,
            StartDate: DateTimeOffset.UtcNow.AddDays(1),
            EndDate: DateTimeOffset.UtcNow.AddDays(3),
            MaxParticipation: 20,
            BasePrice: 1000,
            IncludedServices: ["shuttle"],
            GuideUserIds: []);

        var service = CreateService();
        var result = await service.Create(command);

        Assert.True(result.IsError);
        Assert.Equal("User.Unauthorized", result.FirstError.Code);
        await _tourInstanceRepository.DidNotReceive().Create(Arg.Any<TourInstanceEntity>());
    }

    [Fact]
    public async Task Create_WithWhitespaceUserId_ReturnsUnauthorized()
    {
        // Task 6.2: mock IUser returning whitespace, assert Error.Unauthorized()
        var classificationId = Guid.NewGuid();
        var tour = CreateTourWithClassification(classificationId);

        _user.Id.Returns("   ");
        _tourRepository.FindById(Arg.Any<Guid>()).Returns(tour);

        var command = new CreateTourInstanceCommand(
            TourId: tour.Id,
            ClassificationId: classificationId,
            Title: "Instance 01",
            InstanceType: TourType.Public,
            StartDate: DateTimeOffset.UtcNow.AddDays(1),
            EndDate: DateTimeOffset.UtcNow.AddDays(3),
            MaxParticipation: 20,
            BasePrice: 1000,
            IncludedServices: [],
            GuideUserIds: []);

        var service = CreateService();
        var result = await service.Create(command);

        Assert.True(result.IsError);
        Assert.Equal("User.Unauthorized", result.FirstError.Code);
        await _tourInstanceRepository.DidNotReceive().Create(Arg.Any<TourInstanceEntity>());
    }

    [Fact]
    public async Task Create_WithMissingUserId_ReturnsUnauthorized()
    {
        var classificationId = Guid.NewGuid();
        var tour = CreateTourWithClassification(classificationId);

        _user.Id.Returns((string?)null);
        _tourRepository.FindById(Arg.Any<Guid>()).Returns(tour);

        var command = new CreateTourInstanceCommand(
            TourId: tour.Id,
            ClassificationId: classificationId,
            Title: "Instance 01",
            InstanceType: TourType.Public,
            StartDate: DateTimeOffset.UtcNow.AddDays(1),
            EndDate: DateTimeOffset.UtcNow.AddDays(3),
            MaxParticipation: 20,
            BasePrice: 1000,
            IncludedServices: ["shuttle"],
            GuideUserIds: []);

        var service = CreateService();
        var result = await service.Create(command);

        Assert.True(result.IsError);
        Assert.Equal("User.Unauthorized", result.FirstError.Code);
        await _tourInstanceRepository.DidNotReceive().Create(Arg.Any<TourInstanceEntity>());
    }
}
