using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed class GetTourInstanceDetailQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetTourInstanceDetailQuery, ErrorOr<TourInstanceDto>>
{
    public async Task<ErrorOr<TourInstanceDto>> Handle(GetTourInstanceDetailQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetDetail(request.Id);
    }
}
