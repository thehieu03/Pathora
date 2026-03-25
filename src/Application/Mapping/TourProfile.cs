using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping;

public sealed class TourProfile : Profile
{
    public TourProfile()
    {
        CreateMap<ImageEntity, ImageDto>();

        CreateMap<TourEntity, TourDto>();

        CreateMap<TourClassificationEntity, TourClassificationDto>()
            .ForCtorParam(
                nameof(TourClassificationDto.DynamicPricing),
                opt => opt.MapFrom(src => src.DynamicPricingTiers
                    .OrderBy(tier => tier.MinParticipants)
                    .ThenBy(tier => tier.MaxParticipants)
                    .Select(tier => new DynamicPricingDto(
                        tier.MinParticipants,
                        tier.MaxParticipants,
                        tier.PricePerPerson))));

        CreateMap<TourDayEntity, TourDayDto>();

        CreateMap<TourDayActivityEntity, TourDayActivityDto>()
            .ForCtorParam(
                nameof(TourDayActivityDto.linkToResources),
                opt => opt.MapFrom(src => src.ResourceLinks
                    .OrderBy(l => l.Order)
                    .Select(l => l.Url).ToList()));

        CreateMap<TourInsuranceEntity, TourInsuranceDto>();

        CreateMap<TourPlanLocationEntity, TourPlanLocationDto>();

        CreateMap<TourPlanRouteEntity, TourPlanRouteDto>();

        CreateMap<TourPlanAccommodationEntity, TourPlanAccommodationDto>();

        CreateMap<TourResourceEntity, TourResourceDto>();
    }
}
