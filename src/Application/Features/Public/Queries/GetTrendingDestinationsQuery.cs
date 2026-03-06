using Application.Common;
using Contracts.Interfaces;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetTrendingDestinationsQuery(int Limit = 6) : IQuery<ErrorOr<List<TrendingDestinationVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:trending:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

