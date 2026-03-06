using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Tour.Queries;

public sealed class GetTourDetailQueryHandler(ITourService tourService)
    : IQueryHandler<GetTourDetailQuery, ErrorOr<TourDto>>
{
    public async Task<ErrorOr<TourDto>> Handle(GetTourDetailQuery request, CancellationToken cancellationToken)
    {
        return await tourService.GetDetail(request.Id);
    }
}


