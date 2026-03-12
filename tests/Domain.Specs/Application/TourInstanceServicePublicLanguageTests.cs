using Application.Mapping;
using Application.Services;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class TourInstanceServicePublicLanguageTests
{
    private readonly ITourInstanceRepository _tourInstanceRepository = Substitute.For<ITourInstanceRepository>();
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly Contracts.Interfaces.IUser _user = Substitute.For<Contracts.Interfaces.IUser>();
    private readonly IMapper _mapper;

    public TourInstanceServicePublicLanguageTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<TourProfile>();
            cfg.AddProfile<TourInstanceProfile>();
        });
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task GetPublicAvailable_WhenTranslationsExist_ShouldReturnDifferentPayloadForViAndEn()
    {
        _tourInstanceRepository
            .FindPublicAvailable(Arg.Any<string?>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(_ => [BuildTourInstance()]);
        _tourInstanceRepository
            .CountPublicAvailable(Arg.Any<string?>())
            .Returns(1);

        var sut = new TourInstanceService(_tourInstanceRepository, _tourRepository, _user, _mapper);

        var viResult = await sut.GetPublicAvailable(null, 1, 10, "vi");
        var enResult = await sut.GetPublicAvailable(null, 1, 10, "en");

        Assert.False(viResult.IsError);
        Assert.False(enResult.IsError);
        Assert.NotEqual(viResult.Value.Data[0].Title, enResult.Value.Data[0].Title);
        Assert.NotEqual(viResult.Value.Data[0].Location, enResult.Value.Data[0].Location);
    }

    [Fact]
    public async Task GetPublicDetail_WhenEntityExists_ShouldMapDtoWithoutConstructorErrors()
    {
        var id = Guid.CreateVersion7();
        _tourInstanceRepository
            .FindPublicById(id)
            .Returns(BuildTourInstance(id));

        var sut = new TourInstanceService(_tourInstanceRepository, _tourRepository, _user, _mapper);
        var result = await sut.GetPublicDetail(id, "en");

        Assert.False(result.IsError);
        Assert.Equal(id, result.Value.Id);
        Assert.Equal("Ha Long Public Tour", result.Value.Title);
        Assert.Single(result.Value.DynamicPricing);
    }

    private static TourInstanceEntity BuildTourInstance(Guid? id = null)
    {
        var instanceId = id ?? Guid.CreateVersion7();
        var entity = new TourInstanceEntity
        {
            Id = instanceId,
            TourId = Guid.CreateVersion7(),
            ClassificationId = Guid.CreateVersion7(),
            TourInstanceCode = "TI-001",
            Title = "Tour Hạ Long công khai",
            TourName = "Hà Nội - Hạ Long 3 Ngày 2 Đêm",
            TourCode = "VN-HN-HL-3N2D",
            ClassificationName = "Tiêu chuẩn",
            InstanceType = TourType.Public,
            Status = TourInstanceStatus.Available,
            StartDate = new DateTimeOffset(2026, 4, 15, 0, 0, 0, TimeSpan.Zero),
            EndDate = new DateTimeOffset(2026, 4, 17, 0, 0, 0, TimeSpan.Zero),
            DurationDays = 3,
            MinParticipation = 10,
            MaxParticipation = 30,
            CurrentParticipation = 5,
            AdultPrice = 3000000m,
            ChildPrice = 3500000m,
            InfantPrice = 2500000m,
            Location = "Hạ Long, Quảng Ninh",
            Thumbnail = new ImageEntity
            {
                FileId = "thumb",
                FileName = "thumb.jpg",
                OriginalFileName = "thumb.jpg",
                PublicURL = "https://cdn/thumb.jpg"
            },
            Images =
            [
                new ImageEntity
                {
                    FileId = "img-1",
                    FileName = "img-1.jpg",
                    OriginalFileName = "img-1.jpg",
                    PublicURL = "https://cdn/img-1.jpg"
                }
            ],
            IncludedServices = ["Xe khách", "Khách sạn 3 sao"],
            DynamicPricingTiers =
            [
                DynamicPricingTierEntity.CreateForTourInstance(instanceId, 10, 20, 2800000m, "tester")
            ],
            Translations = new Dictionary<string, TourInstanceTranslationData>(StringComparer.OrdinalIgnoreCase)
            {
                ["vi"] = new TourInstanceTranslationData
                {
                    Title = "Tour Hạ Long công khai",
                    Location = "Hạ Long, Quảng Ninh",
                    IncludedServices = ["Xe khách", "Khách sạn 3 sao"]
                },
                ["en"] = new TourInstanceTranslationData
                {
                    Title = "Ha Long Public Tour",
                    Location = "Ha Long, Quang Ninh",
                    IncludedServices = ["Coach", "3-star hotel"]
                }
            }
        };

        return entity;
    }
}
