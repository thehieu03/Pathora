using Contracts.Interfaces;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using Application.Mapping;
using Application.Services;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using Domain.UnitOfWork;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class TourServiceLanguageTests
{
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly ILanguageContext _languageContext = Substitute.For<ILanguageContext>();
    private readonly IMapper _mapper;
    private readonly ITourService _sut;

    public TourServiceLanguageTests()
    {
        _user.Id.Returns("tester");
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<TourProfile>());
        _mapper = mapperConfig.CreateMapper();
        _sut = new TourService(_tourRepository, _user, _unitOfWork, _mapper, _languageContext);
    }

    [Fact]
    public async Task GetAll_ShouldReturnRequestedLanguageWhenTranslationExists()
    {
        _languageContext.CurrentLanguage.Returns("en");
        var tour = TourEntity.Create("Tên gốc", "Mô tả gốc", "Mô tả dài gốc", "tester");
        tour.Translations["en"] = new TourTranslationData
        {
            TourName = "English tour",
            ShortDescription = "English short",
            LongDescription = "English long"
        };

        _tourRepository.FindAll(null, 1, 10).Returns([tour]);
        _tourRepository.CountAll(null).Returns(1);

        var result = await _sut.GetAll(new GetAllToursQuery(null, 1, 10));

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        Assert.Equal("English tour", result.Value.Data[0].TourName);
        Assert.Equal("English short", result.Value.Data[0].ShortDescription);
    }

    [Fact]
    public async Task GetAll_ShouldIncludeThumbnailMetadataInListViewModel()
    {
        _languageContext.CurrentLanguage.Returns("vi");
        var thumbnail = ImageEntity.Create(
            "thumb-file-id",
            "thumbnail-original.jpg",
            "thumbnail.jpg",
            "https://cdn.pathora.test/tours/thumbnail.jpg");
        var tour = TourEntity.Create(
            "Tour có ảnh",
            "Mô tả ngắn",
            "Mô tả dài",
            "tester",
            thumbnail: thumbnail);

        _tourRepository.FindAll(null, 1, 10).Returns([tour]);
        _tourRepository.CountAll(null).Returns(1);

        var result = await _sut.GetAll(new GetAllToursQuery(null, 1, 10));

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        Assert.Equal("thumb-file-id", result.Value.Data[0].Thumbnail?.FileId);
        Assert.Equal(
            "https://cdn.pathora.test/tours/thumbnail.jpg",
            result.Value.Data[0].Thumbnail?.PublicURL);
    }

    [Fact]
    public async Task GetDetail_ShouldFallbackToVietnameseWhenRequestedMissing()
    {
        _languageContext.CurrentLanguage.Returns("en");

        var tour = TourEntity.Create("Tên gốc", "Mô tả gốc", "Mô tả dài gốc", "tester");
        tour.Translations["vi"] = new TourTranslationData
        {
            TourName = "Tour tiếng Việt",
            ShortDescription = "Mô tả vi",
            LongDescription = "Mô tả dài vi"
        };

        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var result = await _sut.GetDetail(tour.Id);

        Assert.False(result.IsError);
        Assert.Equal("Tour tiếng Việt", result.Value.TourName);
        Assert.Equal("Mô tả vi", result.Value.ShortDescription);
        Assert.Equal("Mô tả dài vi", result.Value.LongDescription);
    }

    [Fact]
    public async Task Update_ShouldMergeTranslationsInsteadOfOverwritingExistingLanguage()
    {
        _languageContext.CurrentLanguage.Returns("vi");

        var tour = TourEntity.Create("Tên gốc", "Mô tả gốc", "Mô tả dài gốc", "tester");
        tour.Translations["vi"] = new TourTranslationData
        {
            TourName = "Tour tiếng Việt",
            ShortDescription = "Mô tả vi",
            LongDescription = "Mô tả dài vi"
        };

        _tourRepository.FindById(tour.Id).Returns(tour);
        _tourRepository.ExistsByTourCode(tour.TourCode, tour.Id).Returns(false);

        var command = new UpdateTourCommand(
            tour.Id,
            "Tên gốc cập nhật",
            "Mô tả gốc cập nhật",
            "Mô tả dài gốc cập nhật",
            null,
            null,
            TourStatus.Active,
            null,
            null,
            new Dictionary<string, TourTranslationData>
            {
                ["en"] = new()
                {
                    TourName = "English tour",
                    ShortDescription = "English short",
                    LongDescription = "English long"
                }
            });

        var result = await _sut.Update(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Update(Arg.Is<TourEntity>(t =>
            t.Translations.ContainsKey("vi") &&
            t.Translations.ContainsKey("en") &&
            t.Translations["vi"].TourName == "Tour tiếng Việt" &&
            t.Translations["en"].TourName == "English tour"));
    }
}
