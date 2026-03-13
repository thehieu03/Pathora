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
            .ForCtorParam(nameof(TourInstanceVm.DepositPerPerson), opt => opt.MapFrom(src => src.DepositPerPerson))
            .ForCtorParam(nameof(TourInstanceVm.Status), opt => opt.MapFrom(src => src.Status.ToString()))
            .ForCtorParam(nameof(TourInstanceVm.InstanceType), opt => opt.MapFrom(src => src.InstanceType.ToString()));

        CreateMap<TourInstanceEntity, TourInstanceDto>()
            .ForCtorParam(nameof(TourInstanceDto.DepositPerPerson), opt => opt.MapFrom(src => src.DepositPerPerson))
            .ForCtorParam(nameof(TourInstanceDto.Status), opt => opt.MapFrom(src => src.Status.ToString()))
            .ForCtorParam(nameof(TourInstanceDto.InstanceType), opt => opt.MapFrom(src => src.InstanceType.ToString()))
            .ForCtorParam(nameof(TourInstanceDto.Rating), opt => opt.MapFrom(_ => 0m))
            .ForCtorParam(nameof(TourInstanceDto.TotalBookings), opt => opt.MapFrom(_ => 0))
            .ForCtorParam(nameof(TourInstanceDto.Revenue), opt => opt.MapFrom(_ => 0m))
            .ForCtorParam(nameof(TourInstanceDto.DynamicPricing), opt => opt.MapFrom(src => src.DynamicPricingTiers));

        CreateMap<TourInstanceGuide, TourInstanceGuideDto>();

        CreateMap<DynamicPricingTierEntity, DynamicPricingDto>();
    }
}
