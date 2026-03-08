using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetPublicTourInstanceDetailQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetPublicTourInstanceDetailQuery, ErrorOr<TourInstanceDto>>
{
    public async Task<ErrorOr<TourInstanceDto>> Handle(GetPublicTourInstanceDetailQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetPublicDetail(request.Id);
    }
}
