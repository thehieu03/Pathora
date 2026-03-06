using Application.Common;
using Contracts.Interfaces;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetLatestToursQuery(int Limit = 6) : IQuery<ErrorOr<List<LatestTourVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:latest:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

