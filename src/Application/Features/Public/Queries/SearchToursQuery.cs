using Application.Common.Contracts;
using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record SearchToursQuery(
    string? Destination,
    string? Classification,
    DateOnly? Date,
    int? People,
    int Page = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<SearchTourVm>>>;
