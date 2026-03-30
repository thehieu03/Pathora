using Contracts;
using Contracts.Interfaces;
using Application.Common.Constant;
using Application.Common.Localization;
using Application.Dtos;
using Application.Features.TourInstance.Commands;
using Application.Features.TourInstance.Queries;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using Domain.ValueObjects;
using ErrorOr;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface ITourInstanceService
{
    Task<ErrorOr<Guid>> Create(CreateTourInstanceCommand request);
    Task<ErrorOr<Success>> Update(UpdateTourInstanceCommand request);
    Task<ErrorOr<Success>> Delete(Guid id);
    Task<ErrorOr<Success>> ChangeStatus(Guid id, TourInstanceStatus newStatus);
    Task<ErrorOr<PaginatedList<TourInstanceVm>>> GetAll(GetAllTourInstancesQuery request);
    Task<ErrorOr<TourInstanceDto>> GetDetail(Guid id);
    Task<ErrorOr<TourInstanceStatsDto>> GetStats();
    Task<ErrorOr<PaginatedList<TourInstanceVm>>> GetPublicAvailable(string? destination, string? sortBy, int page, int pageSize, string? language = null);
    Task<ErrorOr<TourInstanceDto>> GetPublicDetail(Guid id, string? language = null);
    Task<ErrorOr<CheckDuplicateTourInstanceResultDto>> CheckDuplicate(Guid tourId, Guid classificationId, DateTimeOffset startDate);
}

public class TourInstanceService(
    ITourInstanceRepository tourInstanceRepository,
    ITourRepository tourRepository,
    IUser user,
    IMapper mapper,
    ILogger<TourInstanceService> logger) : ITourInstanceService
{
    private readonly ITourInstanceRepository _tourInstanceRepository = tourInstanceRepository;
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly IUser _user = user;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<TourInstanceService> _logger = logger;

    public async Task<ErrorOr<Guid>> Create(CreateTourInstanceCommand request)
    {
        var tour = await _tourRepository.FindById(request.TourId);
        if (tour is null)
            return Error.NotFound(ErrorConstants.Tour.NotFoundCode, ErrorConstants.Tour.NotFoundDescription);

        var classification = tour.Classifications.FirstOrDefault(c => c.Id == request.ClassificationId);
        if (classification is null)
            return Error.NotFound(ErrorConstants.Classification.NotFoundCode, ErrorConstants.Classification.NotFoundDescription);

        if (string.IsNullOrWhiteSpace(_user.Id))
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);

        if (!Guid.TryParse(_user.Id, out var creatorUserId))
            return Error.Validation(ErrorConstants.User.InvalidIdCode, ErrorConstants.User.InvalidIdFormatDescription);

        var performedBy = _user.Id;

        var thumbnail = string.IsNullOrWhiteSpace(request.ThumbnailUrl)
            ? null
            : ImageEntity.Create(
                fileId: null!,
                originalFileName: null!,
                fileName: null!,
                publicURL: request.ThumbnailUrl);

        var entity = TourInstanceEntity.Create(
            tourId: request.TourId,
            classificationId: request.ClassificationId,
            title: request.Title,
            tourName: tour.TourName,
            tourCode: tour.TourCode,
            classificationName: classification.Name,
            instanceType: request.InstanceType,
            startDate: request.StartDate,
            endDate: request.EndDate,
            maxParticipation: request.MaxParticipation,
            basePrice: request.BasePrice,
            performedBy: performedBy,
            location: request.Location,
            thumbnail: thumbnail,
            images: null,
            confirmationDeadline: request.ConfirmationDeadline,
            includedServices: request.IncludedServices);

        if (request.GuideUserIds?.Count > 0)
        {
            foreach (var userId in request.GuideUserIds.Distinct())
            {
                entity.Managers.Add(TourInstanceManagerEntity.Create(
                    entity.Id, userId, TourInstanceManagerRole.Guide, performedBy));
            }
        }

        entity.Managers.Add(TourInstanceManagerEntity.Create(
            entity.Id, creatorUserId, TourInstanceManagerRole.Manager, performedBy));

        try
        {
            await _tourInstanceRepository.Create(entity);
            _logger.LogInformation("TourInstance {TourInstanceId} created with manager {ManagerId} bound by creator", entity.Id, creatorUserId);
            return entity.Id;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create TourInstance for TourId {TourId}, ClassificationId {ClassificationId}", request.TourId, request.ClassificationId);
            return Error.Failure("TourInstance.CreateFailed", "Failed to create tour instance");
        }
    }

    public async Task<ErrorOr<Success>> Update(UpdateTourInstanceCommand request)
    {
        var entity = await _tourInstanceRepository.FindById(request.Id);
        if (entity is null)
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);

        var performedBy = _user.Id ?? string.Empty;

        // Update Managers
        entity.Managers.Clear();
        if (request.GuideUserIds?.Count > 0)
        {
            foreach (var userId in request.GuideUserIds)
            {
                entity.Managers.Add(TourInstanceManagerEntity.Create(
                    entity.Id, userId, TourInstanceManagerRole.Guide, performedBy));
            }
        }
        if (request.ManagerUserIds?.Count > 0)
        {
            foreach (var userId in request.ManagerUserIds)
            {
                entity.Managers.Add(TourInstanceManagerEntity.Create(
                    entity.Id, userId, TourInstanceManagerRole.Manager, performedBy));
            }
        }

        entity.Update(
            title: request.Title,
            startDate: request.StartDate,
            endDate: request.EndDate,
            maxParticipation: request.MaxParticipation,
            basePrice: request.BasePrice,
            performedBy: performedBy,
            location: request.Location,
            thumbnail: request.Thumbnail,
            images: request.Images,
            confirmationDeadline: request.ConfirmationDeadline,
            includedServices: request.IncludedServices);

        await _tourInstanceRepository.Update(entity);
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> Delete(Guid id)
    {
        var entity = await _tourInstanceRepository.FindById(id);
        if (entity is null)
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);

        await _tourInstanceRepository.SoftDelete(id);
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> ChangeStatus(Guid id, TourInstanceStatus newStatus)
    {
        var entity = await _tourInstanceRepository.FindById(id);
        if (entity is null)
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);

        var performedBy = _user.Id ?? string.Empty;
        entity.ChangeStatus(newStatus, performedBy);
        await _tourInstanceRepository.Update(entity);
        return Result.Success;
    }

    public async Task<ErrorOr<PaginatedList<TourInstanceVm>>> GetAll(GetAllTourInstancesQuery request)
    {
        var entities = await _tourInstanceRepository.FindAll(request.SearchText, request.Status, request.PageNumber, request.PageSize);
        var total = await _tourInstanceRepository.CountAll(request.SearchText, request.Status);

        var vms = entities.Select(e => _mapper.Map<TourInstanceVm>(e)).ToList();
        return new PaginatedList<TourInstanceVm>(total, vms);
    }

    public async Task<ErrorOr<TourInstanceDto>> GetDetail(Guid id)
    {
        var entity = await _tourInstanceRepository.FindById(id, asNoTracking: true);
        if (entity is null)
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.NotFoundDescription);

        return _mapper.Map<TourInstanceDto>(entity);
    }

    public async Task<ErrorOr<TourInstanceStatsDto>> GetStats()
    {
        var (total, available, confirmed, soldOut) = await _tourInstanceRepository.GetStats();
        return new TourInstanceStatsDto(total, available, confirmed, soldOut);
    }

    public async Task<ErrorOr<PaginatedList<TourInstanceVm>>> GetPublicAvailable(string? destination, string? sortBy, int page, int pageSize, string? language = null)
    {
        var entities = await _tourInstanceRepository.FindPublicAvailable(destination, sortBy, page, pageSize);
        var total = await _tourInstanceRepository.CountPublicAvailable(destination);
        var resolvedLanguage = PublicLanguageResolver.Resolve(language);

        foreach (var entity in entities)
        {
            entity.ApplyResolvedTranslation(resolvedLanguage);
        }

        var vms = entities.Select(e => _mapper.Map<TourInstanceVm>(e)).ToList();
        return new PaginatedList<TourInstanceVm>(total, vms);
    }

    public async Task<ErrorOr<TourInstanceDto>> GetPublicDetail(Guid id, string? language = null)
    {
        var entity = await _tourInstanceRepository.FindPublicById(id);
        if (entity is null)
            return Error.NotFound(ErrorConstants.TourInstance.NotFoundCode, ErrorConstants.TourInstance.PublicNotFoundDescription);

        entity.ApplyResolvedTranslation(PublicLanguageResolver.Resolve(language));
        return _mapper.Map<TourInstanceDto>(entity);
    }

    public async Task<ErrorOr<CheckDuplicateTourInstanceResultDto>> CheckDuplicate(Guid tourId, Guid classificationId, DateTimeOffset startDate)
    {
        var instances = await _tourInstanceRepository.FindDuplicate(tourId, classificationId, startDate);
        var summaries = instances.Select(e => new DuplicateInstanceSummaryDto(
            e.Id,
            e.Title,
            e.StartDate,
            e.Status.ToString()
        )).ToList();

        return new CheckDuplicateTourInstanceResultDto(
            Exists: summaries.Count > 0,
            Count: summaries.Count,
            ExistingInstances: summaries
        );
    }
}
