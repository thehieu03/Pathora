using Application.Common.Contracts;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Queries.GetAllTours;

public sealed class GetAllToursQueryHandler(ITourService tourService)
    : IQueryHandler<GetAllToursQuery, ErrorOr<PaginatedList<TourVm>>>
{
    public async Task<ErrorOr<PaginatedList<TourVm>>> Handle(GetAllToursQuery request, CancellationToken cancellationToken)
    {
        return await tourService.GetAll(request);
    }
}
