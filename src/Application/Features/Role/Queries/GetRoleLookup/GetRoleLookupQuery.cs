using Application.Common.Contracts;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries.GetRoleLookup;

public sealed record GetRoleLookupQuery() : IQuery<ErrorOr<List<LookupVm>>>;
