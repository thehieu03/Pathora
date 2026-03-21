using Contracts;
using Contracts.Interfaces;
using Application.Common.Constant;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;

namespace Application.Services;

public interface ITourService
{
    Task<ErrorOr<Guid>> Create(CreateTourCommand request);
    Task<ErrorOr<Success>> Update(UpdateTourCommand request);
    Task<ErrorOr<Success>> Delete(Guid id);
    Task<ErrorOr<PaginatedList<TourVm>>> GetAll(GetAllToursQuery request);
    Task<ErrorOr<TourDto>> GetDetail(Guid id);
}

public class TourService(
    ITourRepository tourRepository,
    IUser user,
    IUnitOfWork unitOfWork,
    IMapper mapper,
    ILanguageContext? languageContext = null) : ITourService
{
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly IUser _user = user;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly ILanguageContext _languageContext = languageContext ?? new FallbackLanguageContext();

    private static ImageEntity ToImageEntity(ImageInputDto dto) =>
        ImageEntity.Create(dto.FileId, dto.OriginalFileName, dto.FileName, dto.PublicURL);

    private static ImageDto? ToImageDto(ImageEntity? image)
    {
        if (image is null)
        {
            return null;
        }

        var hasValue = !string.IsNullOrWhiteSpace(image.FileId)
            || !string.IsNullOrWhiteSpace(image.OriginalFileName)
            || !string.IsNullOrWhiteSpace(image.FileName)
            || !string.IsNullOrWhiteSpace(image.PublicURL);

        return hasValue
            ? new ImageDto(image.FileId, image.OriginalFileName, image.FileName, image.PublicURL)
            : null;
    }

    public async Task<ErrorOr<Guid>> Create(CreateTourCommand request)
    {
        var thumbnail = request.Thumbnail is not null ? ToImageEntity(request.Thumbnail) : new ImageEntity();
        var images = request.Images?.Select(ToImageEntity).ToList() ?? [];

        var tour = TourEntity.Create(
            request.TourName,
            request.ShortDescription,
            request.LongDescription,
            _user.Id ?? string.Empty,
            request.Status,
            seoTitle: request.SEOTitle,
            seoDescription: request.SEODescription,
            thumbnail: thumbnail,
            images: images,
            visaPolicyId: request.VisaPolicyId,
            depositPolicyId: request.DepositPolicyId,
            pricingPolicyId: request.PricingPolicyId,
            cancellationPolicyId: request.CancellationPolicyId);
        tour.Translations = NormalizeTranslations(request.Translations);

        // Add Classifications with Plans, Activities, Insurances
        if (request.Classifications != null)
        {
            foreach (var cls in request.Classifications)
            {
                var classification = TourClassificationEntity.Create(
                    tour.Id,
                    cls.Name,
                    cls.AdultPrice,
                    cls.ChildPrice,
                    cls.InfantPrice,
                    cls.Description,
                    cls.NumberOfDay,
                    cls.NumberOfNight,
                    _user.Id ?? string.Empty);

                // Add Plans (Days)
                foreach (var plan in cls.Plans)
                {
                    var day = TourDayEntity.Create(
                        classification.Id,
                        plan.DayNumber,
                        plan.Title,
                        _user.Id ?? string.Empty,
                        plan.Description);

                    // Add Activities
                    foreach (var act in plan.Activities)
                    {
                        var activityOrder = plan.Activities.IndexOf(act) + 1;
                        var activityType = Enum.TryParse<TourDayActivityType>(act.ActivityType, out var at) ? at : TourDayActivityType.Other;
                        TimeOnly? startTime = null;
                        TimeOnly? endTime = null;

                        if (!string.IsNullOrWhiteSpace(act.StartTime) && TimeOnly.TryParse(act.StartTime, out var st))
                        {
                            startTime = st;
                        }
                        if (!string.IsNullOrWhiteSpace(act.EndTime) && TimeOnly.TryParse(act.EndTime, out var et))
                        {
                            endTime = et;
                        }

                        var activity = TourDayActivityEntity.Create(
                            day.Id,
                            activityOrder,
                            activityType,
                            act.Title,
                            _user.Id ?? string.Empty,
                            act.Description,
                            act.Note,
                            startTime,
                            endTime,
                            act.EstimatedCost,
                            act.IsOptional);

                        // Add Routes (Transportations)
                        foreach (var route in act.Routes)
                        {
                            var routeOrder = act.Routes.IndexOf(route) + 1;
                            var transportationType = Enum.TryParse<TransportationType>(route.TransportationType, out var tt) ? tt : TransportationType.Other;

                            // Create FromLocation
                            var fromLocation = TourPlanLocationEntity.Create(
                                route.FromLocationName,
                                LocationType.Other,
                                _user.Id ?? string.Empty);

                            // Create ToLocation
                            var toLocation = TourPlanLocationEntity.Create(
                                route.ToLocationName,
                                LocationType.Other,
                                _user.Id ?? string.Empty);

                            var routeEntity = TourPlanRouteEntity.Create(
                                routeOrder,
                                transportationType,
                                _user.Id ?? string.Empty,
                                route.TransportationName,
                                route.Note,
                                null, // estimatedDepartureTime
                                null, // estimatedArrivalTime
                                route.DurationMinutes,
                                null, // distanceKm
                                route.Price,
                                route.TicketInfo,
                                route.Note);

                            routeEntity.FromLocation = fromLocation;
                            routeEntity.ToLocation = toLocation;
                            activity.Routes.Add(routeEntity);
                        }

                        // Add Accommodation
                        if (act.Accommodation != null)
                        {
                            var accommodation = TourPlanAccommodationEntity.Create(
                                act.Accommodation.AccommodationName,
                                Domain.Enums.RoomType.Double,
                                2, // default roomCapacity
                                Domain.Enums.MealType.None,
                                _user.Id ?? string.Empty,
                                act.Accommodation.CheckInTime != null && TimeOnly.TryParse(act.Accommodation.CheckInTime, out var cit) ? cit : null,
                                act.Accommodation.CheckOutTime != null && TimeOnly.TryParse(act.Accommodation.CheckOutTime, out var cot) ? cot : null,
                                null, // roomPrice
                                null, // numberOfRooms
                                null, // numberOfNights
                                null, // totalPrice
                                null, // specialRequest
                                act.Accommodation.Address,
                                null, // city
                                act.Accommodation.ContactPhone,
                                null, // website
                                null, // imageUrl
                                null, // latitude
                                null, // longitude
                                act.Accommodation.Note);

                            activity.Accommodation = accommodation;
                        }

                        day.Activities.Add(activity);
                    }

                    classification.Plans.Add(day);
                }

                // Add Insurances
                foreach (var ins in cls.Insurances)
                {
                    var insuranceType = Enum.TryParse<InsuranceType>(ins.InsuranceType, out var it) ? it : InsuranceType.None;

                    var insurance = TourInsuranceEntity.Create(
                        ins.InsuranceName,
                        insuranceType,
                        ins.InsuranceProvider,
                        ins.CoverageDescription,
                        ins.CoverageAmount,
                        ins.CoverageFee,
                        _user.Id ?? string.Empty,
                        ins.IsOptional,
                        ins.Note);

                    classification.Insurances.Add(insurance);
                }

                tour.Classifications.Add(classification);
            }
        }

        await _tourRepository.Create(tour);
        await _unitOfWork.SaveChangeAsync();
        return tour.Id;
    }

    public async Task<ErrorOr<Success>> Update(UpdateTourCommand request)
    {
        var tour = await _tourRepository.FindById(request.Id);
        if (tour is null)
            return Error.NotFound(ErrorConstants.Tour.NotFoundCode, ErrorConstants.Tour.NotFoundDescription);

        if (await _tourRepository.ExistsByTourCode(tour.TourCode, request.Id))
            return Error.Conflict(
                ErrorConstants.Tour.DuplicateCodeCode,
                string.Format(ErrorConstants.Tour.DuplicateCodeDescriptionTemplate, tour.TourCode));

        var thumbnail = request.Thumbnail is not null ? ToImageEntity(request.Thumbnail) : null;
        var images = request.Images?.Select(ToImageEntity).ToList();

        tour.Update(
            request.TourName,
            request.ShortDescription,
            request.LongDescription,
            request.Status,
            _user.Id ?? string.Empty,
            seoTitle: request.SEOTitle,
            seoDescription: request.SEODescription,
            thumbnail: thumbnail,
            images: images,
            visaPolicyId: request.VisaPolicyId,
            depositPolicyId: request.DepositPolicyId,
            pricingPolicyId: request.PricingPolicyId,
            cancellationPolicyId: request.CancellationPolicyId);
        MergeTranslations(tour, request.Translations);

        await _tourRepository.Update(tour);
        await _unitOfWork.SaveChangeAsync();
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> Delete(Guid id)
    {
        var tour = await _tourRepository.FindById(id);
        if (tour is null)
            return Error.NotFound(ErrorConstants.Tour.NotFoundCode, ErrorConstants.Tour.NotFoundDescription);

        await _tourRepository.SoftDelete(id);
        await _unitOfWork.SaveChangeAsync();
        return Result.Success;
    }

    public async Task<ErrorOr<PaginatedList<TourVm>>> GetAll(GetAllToursQuery request)
    {
        var tours = await _tourRepository.FindAll(request.SearchText, request.PageNumber, request.PageSize);
        var total = await _tourRepository.CountAll(request.SearchText);
        var currentLanguage = _languageContext.CurrentLanguage;

        var tourVms = tours.Select(t =>
        {
            var translated = t.ResolveTranslation(currentLanguage);
            return new TourVm(
                t.Id,
                t.TourCode,
                translated.TourName,
                translated.ShortDescription,
                t.Status.ToString(),
                ToImageDto(t.Thumbnail),
                t.CreatedOnUtc);
        }).ToList();

        return new PaginatedList<TourVm>(total, tourVms);
    }

    public async Task<ErrorOr<TourDto>> GetDetail(Guid id)
    {
        var tour = await _tourRepository.FindById(id, asNoTracking: true);
        if (tour is null)
            return Error.NotFound(ErrorConstants.Tour.NotFoundCode, ErrorConstants.Tour.NotFoundDescription);

        tour.ApplyResolvedTranslations(_languageContext.CurrentLanguage);
        return _mapper.Map<TourDto>(tour);
    }

    private static Dictionary<string, TourTranslationData> NormalizeTranslations(
        Dictionary<string, TourTranslationData>? translations)
    {
        var result = new Dictionary<string, TourTranslationData>(StringComparer.OrdinalIgnoreCase);
        if (translations is null || translations.Count == 0)
        {
            return result;
        }

        foreach (var translation in translations)
        {
            if (string.IsNullOrWhiteSpace(translation.Key) || translation.Value is null)
            {
                continue;
            }

            result[translation.Key.ToLowerInvariant()] = translation.Value;
        }

        return result;
    }

    private static void MergeTranslations(TourEntity tour, Dictionary<string, TourTranslationData>? translations)
    {
        if (translations is null || translations.Count == 0)
        {
            return;
        }

        var normalized = NormalizeTranslations(translations);
        foreach (var translation in normalized)
        {
            tour.Translations[translation.Key] = translation.Value;
        }
    }

    private sealed class FallbackLanguageContext : ILanguageContext
    {
        public string CurrentLanguage { get; set; } = ILanguageContext.DefaultLanguage;
    }
}
