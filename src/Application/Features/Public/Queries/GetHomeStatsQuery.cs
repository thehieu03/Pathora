using Application.Common;
using Application.Common.Interfaces;
using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetHomeStatsQuery : IQuery<ErrorOr<HomeStatsVm>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:home-stats";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}
