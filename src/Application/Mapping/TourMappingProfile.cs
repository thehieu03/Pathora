using System.Collections.Generic;
using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Entities.Translations;

namespace Application.Mapping;

public sealed class TourMappingProfile : Profile
{
    public TourMappingProfile()
    {
        // TourEntity -> TourDto
        CreateMap<TourEntity, TourDto>()
            .ForMember(dest => dest.TourName, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.TourName) ? src.TourName : string.Empty))
            .ForMember(dest => dest.ShortDescription, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.ShortDescription) ? src.ShortDescription : string.Empty))
            .ForMember(dest => dest.LongDescription, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.LongDescription) ? src.LongDescription : string.Empty))
            .ForMember(dest => dest.Thumbnail, opt => opt.MapFrom(src => src.Thumbnail ?? new ImageEntity()))
            .ForMember(dest => dest.Classifications, opt => opt.MapFrom(src => src.Classifications ?? new List<TourClassificationEntity>()))
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images ?? new List<ImageEntity>()));

        // TourClassificationEntity -> TourClassificationDto
        CreateMap<TourClassificationEntity, TourClassificationDto>()
            .ForMember(dest => dest.Plans, opt => opt.MapFrom(src => src.Plans.OrderBy(p => p.DayNumber).ToList()))
            .ForMember(dest => dest.DynamicPricing, opt => opt.MapFrom(src => src.DynamicPricingTiers ?? new List<DynamicPricingTierEntity>()));

        // TourDayEntity -> TourDayDto
        CreateMap<TourDayEntity, TourDayDto>()
            .ForMember(dest => dest.Activities, opt => opt.MapFrom(src => src.Activities.OrderBy(a => a.Order).ToList()));

        // TourDayActivityEntity -> TourDayActivityDto
        CreateMap<TourDayActivityEntity, TourDayActivityDto>()
            .ForMember(dest => dest.Routes, opt => opt.MapFrom(src => src.Routes.OrderBy(r => r.Order).ToList()));

        // TourPlanRouteEntity -> TourPlanRouteDto
        CreateMap<TourPlanRouteEntity, TourPlanRouteDto>()
            .ForMember(dest => dest.FromLocation, opt => opt.MapFrom(src => src.FromLocation))
            .ForMember(dest => dest.ToLocation, opt => opt.MapFrom(src => src.ToLocation));

        // TourPlanLocationEntity -> TourPlanLocationDto
        CreateMap<TourPlanLocationEntity, TourPlanLocationDto>();

        // TourPlanAccommodationEntity -> TourPlanAccommodationDto
        CreateMap<TourPlanAccommodationEntity, TourPlanAccommodationDto>();

        // TourInsuranceEntity -> TourInsuranceDto
        CreateMap<TourInsuranceEntity, TourInsuranceDto>();

        // DynamicPricingTierEntity -> DynamicPricingDto
        CreateMap<DynamicPricingTierEntity, DynamicPricingDto>();

        // ImageEntity -> ImageDto
        CreateMap<ImageEntity, ImageDto>();
    }
}
