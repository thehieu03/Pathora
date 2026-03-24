using Application.Common.Constant;
using Application.Dtos;
using Contracts;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;

namespace Application.Services;

public interface IDynamicPricingService
{
    Task<ErrorOr<List<DynamicPricingDto>>> GetClassificationTiers(Guid classificationId);
    Task<ErrorOr<Success>> UpsertClassificationTiers(Guid classificationId, IReadOnlyCollection<DynamicPricingDto> tiers);

    Task<ErrorOr<List<DynamicPricingDto>>> GetTourInstanceTiers(Guid tourInstanceId);
    Task<ErrorOr<Success>> UpsertTourInstanceTiers(Guid tourInstanceId, IReadOnlyCollection<DynamicPricingDto> tiers);
    Task<ErrorOr<Success>> ClearTourInstanceTiers(Guid tourInstanceId);

    Task<ErrorOr<DynamicPricingResolutionDto>> ResolveForTourInstance(Guid tourInstanceId, int participants);
}

public sealed class DynamicPricingService(
    IDynamicPricingTierRepository dynamicPricingTierRepository,
    IUser user) : IDynamicPricingService
{
    private readonly IDynamicPricingTierRepository _dynamicPricingTierRepository = dynamicPricingTierRepository;
    private readonly IUser _user = user;

    public async Task<ErrorOr<List<DynamicPricingDto>>> GetClassificationTiers(Guid classificationId)
    {
        if (!await _dynamicPricingTierRepository.ClassificationExists(classificationId))
        {
            return Error.NotFound(ErrorConstants.Classification.NotFoundCode, ErrorConstants.Classification.NotFoundDescription);
        }

        var tiers = await _dynamicPricingTierRepository.GetByClassificationId(classificationId, asNoTracking: true);
        return tiers.Select(ToDto).ToList();
    }

    public async Task<ErrorOr<Success>> UpsertClassificationTiers(Guid classificationId, IReadOnlyCollection<DynamicPricingDto> tiers)
    {
        if (!await _dynamicPricingTierRepository.ClassificationExists(classificationId))
        {
            return Error.NotFound(ErrorConstants.Classification.NotFoundCode, ErrorConstants.Classification.NotFoundDescription);
        }

        var validationResult = ValidateTiers(tiers);
        if (validationResult.IsError)
        {
            return validationResult.Errors;
        }

        var performedBy = _user.Id ?? string.Empty;
        var entities = tiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .Select(tier => DynamicPricingTierEntity.CreateForClassification(
                classificationId,
                tier.MinParticipants,
                tier.MaxParticipants,
                tier.PricePerPerson,
                performedBy))
            .ToList();

        await _dynamicPricingTierRepository.ReplaceForClassification(classificationId, entities);
        return Result.Success;
    }

    public async Task<ErrorOr<List<DynamicPricingDto>>> GetTourInstanceTiers(Guid tourInstanceId)
    {
        if (!await _dynamicPricingTierRepository.TourInstanceExists(tourInstanceId))
        {
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);
        }

        var tiers = await _dynamicPricingTierRepository.GetByTourInstanceId(tourInstanceId, asNoTracking: true);
        return tiers.Select(ToDto).ToList();
    }

    public async Task<ErrorOr<Success>> UpsertTourInstanceTiers(Guid tourInstanceId, IReadOnlyCollection<DynamicPricingDto> tiers)
    {
        if (!await _dynamicPricingTierRepository.TourInstanceExists(tourInstanceId))
        {
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);
        }

        var validationResult = ValidateTiers(tiers);
        if (validationResult.IsError)
        {
            return validationResult.Errors;
        }

        var performedBy = _user.Id ?? string.Empty;
        var entities = tiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .Select(tier => DynamicPricingTierEntity.CreateForTourInstance(
                tourInstanceId,
                tier.MinParticipants,
                tier.MaxParticipants,
                tier.PricePerPerson,
                performedBy))
            .ToList();

        await _dynamicPricingTierRepository.ReplaceForTourInstance(tourInstanceId, entities);
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> ClearTourInstanceTiers(Guid tourInstanceId)
    {
        if (!await _dynamicPricingTierRepository.TourInstanceExists(tourInstanceId))
        {
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);
        }

        await _dynamicPricingTierRepository.ClearForTourInstance(tourInstanceId);
        return Result.Success;
    }

    public async Task<ErrorOr<DynamicPricingResolutionDto>> ResolveForTourInstance(Guid tourInstanceId, int participants)
    {
        if (participants <= 0)
        {
            return Error.Validation(ErrorConstants.DynamicPricing.InvalidRangeCode, ValidationMessages.DynamicPricingMinParticipantsGreaterThanZero);
        }

        var instance = await _dynamicPricingTierRepository.FindTourInstanceWithPricing(tourInstanceId, asNoTracking: true);
        if (instance is null)
        {
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);
        }

        var instanceTiers = await _dynamicPricingTierRepository.GetByTourInstanceId(tourInstanceId, asNoTracking: true);
        var instanceTier = instanceTiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .FirstOrDefault(tier => tier.Matches(participants));

        if (instanceTier is not null)
        {
            return ToResolution(instanceTier, DynamicPricingSource.Instance);
        }

        var classificationTier = instance.Classification.DynamicPricingTiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .FirstOrDefault(tier => tier.Matches(participants));

        if (classificationTier is not null)
        {
            return ToResolution(classificationTier, DynamicPricingSource.Classification);
        }

        return new DynamicPricingResolutionDto(
            ResolvedPricePerPerson: instance.BasePrice,
            PricingSource: DynamicPricingSource.Fallback.ToString().ToLowerInvariant(),
            MinParticipants: null,
            MaxParticipants: null);
    }

    private static DynamicPricingResolutionDto ToResolution(DynamicPricingTierEntity tier, DynamicPricingSource source)
    {
        return new DynamicPricingResolutionDto(
            ResolvedPricePerPerson: tier.PricePerPerson,
            PricingSource: source.ToString().ToLowerInvariant(),
            MinParticipants: tier.MinParticipants,
            MaxParticipants: tier.MaxParticipants);
    }

    private static DynamicPricingDto ToDto(DynamicPricingTierEntity tier)
    {
        return new DynamicPricingDto(
            MinParticipants: tier.MinParticipants,
            MaxParticipants: tier.MaxParticipants,
            PricePerPerson: tier.PricePerPerson);
    }

    private static ErrorOr<Success> ValidateTiers(IReadOnlyCollection<DynamicPricingDto> tiers)
    {
        foreach (var tier in tiers)
        {
            if (tier.MinParticipants <= 0)
            {
                return Error.Validation(ErrorConstants.DynamicPricing.InvalidRangeCode, ValidationMessages.DynamicPricingMinParticipantsGreaterThanZero);
            }

            if (tier.MaxParticipants < tier.MinParticipants)
            {
                return Error.Validation(ErrorConstants.DynamicPricing.InvalidRangeCode, ValidationMessages.DynamicPricingMaxParticipantsGreaterThanOrEqualMin);
            }

            if (tier.PricePerPerson < 0)
            {
                return Error.Validation(ErrorConstants.DynamicPricing.InvalidRangeCode, ValidationMessages.DynamicPricingPricePerPersonNonNegative);
            }
        }

        var tierEntities = tiers
            .Select(tier => new DynamicPricingTierEntity
            {
                MinParticipants = tier.MinParticipants,
                MaxParticipants = tier.MaxParticipants,
                PricePerPerson = tier.PricePerPerson
            })
            .ToList();

        if (DynamicPricingTierEntity.HasOverlappingRanges(tierEntities))
        {
            return Error.Validation(ErrorConstants.DynamicPricing.OverlapCode, ValidationMessages.DynamicPricingRangeMustNotOverlap);
        }

        return Result.Success;
    }
}
