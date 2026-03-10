using Contracts;
using BuildingBlocks.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.Position.Queries;

public sealed record GetPositionComboBoxQuery() : IQuery<ErrorOr<List<LookupVm>>>;

public sealed class GetPositionComboBoxQueryHandler(IPositionService positionService)
    : IQueryHandler<GetPositionComboBoxQuery, ErrorOr<List<LookupVm>>>
{
    public async Task<ErrorOr<List<LookupVm>>> Handle(GetPositionComboBoxQuery request, CancellationToken cancellationToken)
    {
        return await positionService.GetComboboxAsync();
    }
}

