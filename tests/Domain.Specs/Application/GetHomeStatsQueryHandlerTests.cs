using Application.Features.Public.Queries;
using Domain.Common.Repositories;
using Domain.Constant;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class GetHomeStatsQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnStatsFromRepositories()
    {
        var tourRepository = Substitute.For<ITourRepository>();
        var systemKeyRepository = Substitute.For<ISystemKeyRepository>();

        tourRepository.GetTotalActiveTours().Returns(120);
        tourRepository.GetTotalDistanceKm().Returns(6789m);
        systemKeyRepository.FindByCode("TOTAL_TRAVELERS").Returns(new SystemKey
        {
            CodeKey = "TOTAL_TRAVELERS",
            CodeValue = 3210
        });

        var handler = new GetHomeStatsQueryHandler(tourRepository, systemKeyRepository);

        var result = await handler.Handle(new GetHomeStatsQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(3210, result.Value.TotalTravelers);
        Assert.Equal(120, result.Value.TotalTours);
        Assert.Equal(6789m, result.Value.TotalDistanceKm);

        await tourRepository.Received(1).GetTotalActiveTours();
        await tourRepository.Received(1).GetTotalDistanceKm();
        await systemKeyRepository.Received(1).FindByCode("TOTAL_TRAVELERS");
    }

    [Fact]
    public async Task Handle_WhenNoTravelersKey_ShouldDefaultTo10000()
    {
        var tourRepository = Substitute.For<ITourRepository>();
        var systemKeyRepository = Substitute.For<ISystemKeyRepository>();

        tourRepository.GetTotalActiveTours().Returns(50);
        tourRepository.GetTotalDistanceKm().Returns(1000m);
        systemKeyRepository.FindByCode("TOTAL_TRAVELERS").Returns((SystemKey?)null);

        var handler = new GetHomeStatsQueryHandler(tourRepository, systemKeyRepository);

        var result = await handler.Handle(new GetHomeStatsQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(10000, result.Value.TotalTravelers);
    }
}
