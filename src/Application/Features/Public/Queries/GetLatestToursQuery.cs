using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetLatestToursQuery(int Limit = 6) : IQuery<ErrorOr<List<LatestTourVm>>>;
