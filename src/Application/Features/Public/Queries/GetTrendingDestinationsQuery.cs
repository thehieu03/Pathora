using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetTrendingDestinationsQuery(int Limit = 6) : IQuery<ErrorOr<List<TrendingDestinationVm>>>;
