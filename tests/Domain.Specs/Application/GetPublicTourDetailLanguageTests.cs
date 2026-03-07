using Contracts.Interfaces;
using Application.Features.Public.Queries;
using Application.Mapping;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class GetPublicTourDetailLanguageTests
{
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly ILanguageContext _languageContext = Substitute.For<ILanguageContext>();
    private readonly IMapper _mapper;

    public GetPublicTourDetailLanguageTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<TourProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ShouldReturnTourInRequestedLanguage()
    {
        _languageContext.CurrentLanguage.Returns("en");

        var tour = TourEntity.Create("Tour tiếng Việt", "Mô tả vi", "Mô tả dài vi", "tester", TourStatus.Active);
        tour.Translations["en"] = new TourTranslationData
        {
            TourName = "English tour",
            ShortDescription = "English short",
            LongDescription = "English long"
        };
        _tourRepository.FindByIdReadOnly(tour.Id).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper, _languageContext);
        var result = await handler.Handle(new GetPublicTourDetailQuery(tour.Id), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal("English tour", result.Value.TourName);
        Assert.Equal("English short", result.Value.ShortDescription);
        Assert.Equal("English long", result.Value.LongDescription);
    }
}
