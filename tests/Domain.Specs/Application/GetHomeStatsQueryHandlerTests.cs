using Application.Features.Public.Queries;
using Domain.Common.Repositories;
using Domain.Constant;
using NSubstitute;
using ZiggyCreatures.Caching.Fusion;

namespace Domain.Specs.Application;

public sealed class GetHomeStatsQueryHandlerTests
{
    [Fact]
    public async Task Handle_WhenCalledTwiceWithinCacheTtl_ShouldQueryRepositoriesOnce()
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

        var cache = new FusionCache(new FusionCacheOptions());
        var handler = new GetHomeStatsQueryHandler(tourRepository, systemKeyRepository, cache);

        var firstResult = await handler.Handle(new GetHomeStatsQuery(), CancellationToken.None);
        var secondResult = await handler.Handle(new GetHomeStatsQuery(), CancellationToken.None);

        Assert.False(firstResult.IsError);
        Assert.False(secondResult.IsError);
        Assert.Equal(3210, firstResult.Value.TotalTravelers);
        Assert.Equal(120, firstResult.Value.TotalTours);
        Assert.Equal(6789m, firstResult.Value.TotalDistanceKm);

        await tourRepository.Received(1).GetTotalActiveTours();
        await tourRepository.Received(1).GetTotalDistanceKm();
        await systemKeyRepository.Received(1).FindByCode("TOTAL_TRAVELERS");
    }
}
