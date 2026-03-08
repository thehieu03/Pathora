using Contracts;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed class GetAllTourInstancesQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetAllTourInstancesQuery, ErrorOr<PaginatedList<TourInstanceVm>>>
{
    public async Task<ErrorOr<PaginatedList<TourInstanceVm>>> Handle(GetAllTourInstancesQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetAll(request);
    }
}
