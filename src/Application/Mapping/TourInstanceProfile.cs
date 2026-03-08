using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.ValueObjects;

namespace Application.Mapping;

public sealed class TourInstanceProfile : Profile
{
    public TourInstanceProfile()
    {
        CreateMap<TourInstanceEntity, TourInstanceVm>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.InstanceType, opt => opt.MapFrom(src => src.InstanceType.ToString()));

        CreateMap<TourInstanceEntity, TourInstanceDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.InstanceType, opt => opt.MapFrom(src => src.InstanceType.ToString()))
            .ForMember(dest => dest.DynamicPricing, opt => opt.MapFrom(src => src.DynamicPricingTiers));

        CreateMap<TourInstanceGuide, TourInstanceGuideDto>();

        CreateMap<DynamicPricingTierEntity, DynamicPricingDto>();
    }
}
