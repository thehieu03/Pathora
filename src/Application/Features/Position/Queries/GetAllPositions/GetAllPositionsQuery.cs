using Application.Common.Contracts;
using Application.Contracts.Position;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries.GetAllPositions;

public sealed record GetAllPositionsQuery(int PageNumber = 1, int PageSize = 10, string? SearchText = null)
    : IQuery<ErrorOr<PaginatedListWithPermissions<PositionVm>>>;
