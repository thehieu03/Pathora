using Contracts;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetPublicTourInstancesQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetPublicTourInstancesQuery, ErrorOr<PaginatedList<TourInstanceVm>>>
{
    public async Task<ErrorOr<PaginatedList<TourInstanceVm>>> Handle(GetPublicTourInstancesQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetPublicAvailable(request.Destination, request.Page, request.PageSize);
    }
}
