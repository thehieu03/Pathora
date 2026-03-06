using Contracts;
using Application.Contracts.Position;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries;

public sealed class GetAllPositionsQueryHandler(IPositionService positionService)
    : IQueryHandler<GetAllPositionsQuery, ErrorOr<PaginatedListWithPermissions<PositionVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<PositionVm>>> Handle(GetAllPositionsQuery request, CancellationToken cancellationToken)
    {
        return await positionService.GetAllAsync(new GetAllPositionRequest(request.PageNumber, request.PageSize, request.SearchText));
    }
}


