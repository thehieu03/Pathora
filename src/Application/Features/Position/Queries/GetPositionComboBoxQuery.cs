using Contracts;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries;

public sealed record GetPositionComboBoxQuery() : IQuery<ErrorOr<List<LookupVm>>>;


