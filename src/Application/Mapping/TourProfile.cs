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

        CreateMap<TourDayEntity, TourDayDto>();

        CreateMap<TourDayActivityEntity, TourDayActivityDto>();

        CreateMap<TourInsuranceEntity, TourInsuranceDto>();

        CreateMap<TourPlanLocationEntity, TourPlanLocationDto>();

        CreateMap<TourPlanRouteEntity, TourPlanRouteDto>();

        CreateMap<TourPlanAccommodationEntity, TourPlanAccommodationDto>();
    }
}
