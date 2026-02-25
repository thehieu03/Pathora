using Application.Common.Contracts;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries;

public sealed record GetPositionComboBoxQuery() : IQuery<ErrorOr<List<LookupVm>>>;

