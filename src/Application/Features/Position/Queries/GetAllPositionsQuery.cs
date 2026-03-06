using Application.Common;
using Contracts;
using Contracts.Interfaces;
using Application.Contracts.Position;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries;

public sealed record GetAllPositionsQuery(int PageNumber = 1, int PageSize = 10, string? SearchText = null)
    : IQuery<ErrorOr<PaginatedListWithPermissions<PositionVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Position}:all:{PageNumber}:{PageSize}:{SearchText}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}


