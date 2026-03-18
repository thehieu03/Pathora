using Application.Common.Constant;
using Application.Dtos;
using Application.Services;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class DynamicPricingServiceTests
{
    private readonly IDynamicPricingTierRepository _dynamicPricingTierRepository = Substitute.For<IDynamicPricingTierRepository>();
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IDynamicPricingService _sut;

    public DynamicPricingServiceTests()
    {
        _user.Id.Returns("tester");
        _sut = new DynamicPricingService(_dynamicPricingTierRepository, _user);
    }

    [Fact]
    public async Task UpsertClassificationTiers_WhenRangesOverlap_ShouldReturnValidationError()
    {
        var classificationId = Guid.CreateVersion7();
        _dynamicPricingTierRepository.ClassificationExists(classificationId).Returns(true);

        var result = await _sut.UpsertClassificationTiers(
            classificationId,
            [
                new DynamicPricingDto(4, 6, 2500000m),
                new DynamicPricingDto(6, 9, 2300000m)
            ]);

        Assert.True(result.IsError);
        Assert.Equal(ErrorConstants.DynamicPricing.OverlapCode, result.FirstError.Code);
        await _dynamicPricingTierRepository.DidNotReceive()
            .ReplaceForClassification(Arg.Any<Guid>(), Arg.Any<IReadOnlyCollection<DynamicPricingTierEntity>>());
    }

    [Fact]
    public async Task ResolveForTourInstance_WhenInstanceTierMatches_ShouldUseInstanceTier()
    {
        var instanceId = Guid.CreateVersion7();
        var classificationId = Guid.CreateVersion7();
        var instance = BuildTourInstance(
            instanceId,
            classificationId,
            [DynamicPricingTierEntity.CreateForTourInstance(instanceId, 4, 8, 2100000m, "tester")],
            [DynamicPricingTierEntity.CreateForClassification(classificationId, 4, 8, 2600000m, "tester")],
            fallbackPrice: 3000000m);
        _dynamicPricingTierRepository.FindTourInstanceWithPricing(instanceId, asNoTracking: true).Returns(instance);
        var result = await _sut.ResolveForTourInstance(instanceId, 6);
        Assert.False(result.IsError);
        Assert.Equal("instance", result.Value.PricingSource);
        Assert.Equal(2100000m, result.Value.ResolvedPricePerPerson);
        Assert.Equal(4, result.Value.MinParticipants);
        Assert.Equal(8, result.Value.MaxParticipants);
    }
    [Fact]
    public async Task ResolveForTourInstance_WhenInstanceMissingAndClassificationMatches_ShouldUseClassificationTier()
    {
        var instanceId = Guid.CreateVersion7();
        var classificationId = Guid.CreateVersion7();
        var instance = BuildTourInstance(
            instanceId,
            classificationId,
            [],
            [DynamicPricingTierEntity.CreateForClassification(classificationId, 7, 12, 1950000m, "tester")],
            fallbackPrice: 2800000m);
        _dynamicPricingTierRepository.FindTourInstanceWithPricing(instanceId, asNoTracking: true).Returns(instance);
        var result = await _sut.ResolveForTourInstance(instanceId, 10);
        Assert.False(result.IsError);
        Assert.Equal("classification", result.Value.PricingSource);
        Assert.Equal(1950000m, result.Value.ResolvedPricePerPerson);
        Assert.Equal(7, result.Value.MinParticipants);
        Assert.Equal(12, result.Value.MaxParticipants);
    }

    [Fact]
    public async Task ResolveForTourInstance_WhenNoTierMatches_ShouldUseFallbackPrice()
    {
        var instanceId = Guid.CreateVersion7();
        var classificationId = Guid.CreateVersion7();
        var instance = BuildTourInstance(
            instanceId,
            classificationId,
            [DynamicPricingTierEntity.CreateForTourInstance(instanceId, 4, 8, 2100000m, "tester")],
            [DynamicPricingTierEntity.CreateForClassification(classificationId, 10, 15, 1950000m, "tester")],
            fallbackPrice: 3200000m);

        _dynamicPricingTierRepository.FindTourInstanceWithPricing(instanceId, asNoTracking: true).Returns(instance);

        var result = await _sut.ResolveForTourInstance(instanceId, 2);

        Assert.False(result.IsError);
        Assert.Equal("fallback", result.Value.PricingSource);
        Assert.Equal(3200000m, result.Value.ResolvedPricePerPerson);
        Assert.Null(result.Value.MinParticipants);
        Assert.Null(result.Value.MaxParticipants);
    }

    [Fact]
    public async Task UpsertClassificationTiers_WhenInstanceOverridesExist_ShouldNotOverwriteInstanceOverrides()
    {
        var classificationId = Guid.CreateVersion7();
        _dynamicPricingTierRepository.ClassificationExists(classificationId).Returns(true);

        var result = await _sut.UpsertClassificationTiers(
            classificationId,
            [new DynamicPricingDto(4, 6, 2600000m)]);

        Assert.False(result.IsError);
        await _dynamicPricingTierRepository.Received(1)
            .ReplaceForClassification(classificationId, Arg.Any<IReadOnlyCollection<DynamicPricingTierEntity>>());
        await _dynamicPricingTierRepository.DidNotReceive()
            .ReplaceForTourInstance(Arg.Any<Guid>(), Arg.Any<IReadOnlyCollection<DynamicPricingTierEntity>>());
    }

    [Fact]
    public async Task ClearTourInstanceTiers_WhenCleared_ShouldResolveBackToClassificationTier()
    {
        var instanceId = Guid.CreateVersion7();
        var classificationId = Guid.CreateVersion7();
        _dynamicPricingTierRepository.TourInstanceExists(instanceId).Returns(true);

        var instanceAfterClear = BuildTourInstance(
            instanceId,
            classificationId,
            [],
            [DynamicPricingTierEntity.CreateForClassification(classificationId, 5, 10, 2300000m, "tester")],
            fallbackPrice: 3000000m);
        _dynamicPricingTierRepository.FindTourInstanceWithPricing(instanceId, asNoTracking: true)
            .Returns(instanceAfterClear);
        var clearResult = await _sut.ClearTourInstanceTiers(instanceId);
        var resolveResult = await _sut.ResolveForTourInstance(instanceId, 6);
        Assert.False(clearResult.IsError);
        await _dynamicPricingTierRepository.Received(1).ClearForTourInstance(instanceId);

        Assert.False(resolveResult.IsError);
        Assert.Equal("classification", resolveResult.Value.PricingSource);
        Assert.Equal(2300000m, resolveResult.Value.ResolvedPricePerPerson);
    }

    private static TourInstanceEntity BuildTourInstance(
        Guid instanceId,
        Guid classificationId,
        List<DynamicPricingTierEntity> instanceTiers,
        List<DynamicPricingTierEntity> classificationTiers,
        decimal fallbackPrice)
    {
        var classification = new TourClassificationEntity
        {
            Id = classificationId,
            TourId = Guid.CreateVersion7(),
            Name = "Standard",
            AdultPrice = fallbackPrice,
            ChildPrice = fallbackPrice,
            InfantPrice = fallbackPrice,
            Description = "desc",
            NumberOfDay = 3,
            NumberOfNight = 2,
            DynamicPricingTiers = classificationTiers
        };

        return new TourInstanceEntity
        {
            Id = instanceId,
            TourId = classification.TourId,
            ClassificationId = classificationId,
            Classification = classification,
            TourInstanceCode = "TI-001",
            Title = "Tour instance",
            TourName = "Tour",
            TourCode = "TOUR-001",
            ClassificationName = "Standard",
            StartDate = DateTimeOffset.UtcNow,
            EndDate = DateTimeOffset.UtcNow.AddDays(2),
            DurationDays = 3,
            MinParticipation = 1,
            MaxParticipation = 30,
            AdultPrice = fallbackPrice,
            ChildPrice = fallbackPrice,
            InfantPrice = fallbackPrice,
            DynamicPricingTiers = instanceTiers,
            Thumbnail = new ImageEntity()
        };
    }
}
