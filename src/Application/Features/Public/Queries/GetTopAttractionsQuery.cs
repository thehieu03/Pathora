using Application.Common;
using Application.Common.Interfaces;
using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetTopAttractionsQuery(int Limit = 8) : IQuery<ErrorOr<List<TopAttractionVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:top-attractions:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}
