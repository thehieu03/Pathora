using Contracts;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Tour.Queries;

public sealed class GetAllToursQueryHandler(ITourService tourService)
    : IQueryHandler<GetAllToursQuery, ErrorOr<PaginatedList<TourVm>>>
{
    public async Task<ErrorOr<PaginatedList<TourVm>>> Handle(GetAllToursQuery request, CancellationToken cancellationToken)
    {
        return await tourService.GetAll(request);
    }
}


