using Application.Common;
using Application.Common.Interfaces;
using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetLatestToursQuery(int Limit = 6) : IQuery<ErrorOr<List<LatestTourVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:latest:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}
