using Application.Common.Contracts;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Queries.GetPositionComboBox;

public sealed record GetPositionComboBoxQuery() : IQuery<ErrorOr<List<LookupVm>>>;
