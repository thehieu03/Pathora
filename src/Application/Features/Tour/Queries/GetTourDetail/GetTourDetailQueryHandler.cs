using Application.Services;
using Domain.CORS;
using Domain.Entities;
using ErrorOr;

namespace Application.Features.Tour.Queries.GetTourDetail;

public sealed class GetTourDetailQueryHandler(ITourService tourService)
    : IQueryHandler<GetTourDetailQuery, ErrorOr<TourEntity>>
{
    public async Task<ErrorOr<TourEntity>> Handle(GetTourDetailQuery request, CancellationToken cancellationToken)
    {
        return await tourService.GetDetail(request.Id);
    }
}
