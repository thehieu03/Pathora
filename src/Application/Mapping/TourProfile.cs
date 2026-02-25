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

        CreateMap<TourClassificationEntity, TourClassificationDto>();

        CreateMap<TourDayEntity, TourDayDto>()
            .ForMember(dest => dest.ClassificationId, opt => opt.MapFrom(src => src.TourDayId));

        CreateMap<TourDayActivityEntity, TourDayActivityDto>();

        CreateMap<TourInsuranceEntity, TourInsuranceDto>()
            .ForMember(dest => dest.CoverageDescription, opt => opt.MapFrom(src => src.CoverageDesciption));

        CreateMap<TourPlanLocationEntity, TourPlanLocationDto>();

        CreateMap<TourPlanRouteEntity, TourPlanRouteDto>();

        CreateMap<TourPlanAccommodationEntity, TourPlanAccommodationDto>();
    }
}
