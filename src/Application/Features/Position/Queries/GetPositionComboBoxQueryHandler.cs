using Contracts;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries;

public sealed class GetPositionComboBoxQueryHandler(IPositionService positionService)
    : IQueryHandler<GetPositionComboBoxQuery, ErrorOr<List<LookupVm>>>
{
    public async Task<ErrorOr<List<LookupVm>>> Handle(GetPositionComboBoxQuery request, CancellationToken cancellationToken)
    {
        return await positionService.GetComboboxAsync();
    }
}


