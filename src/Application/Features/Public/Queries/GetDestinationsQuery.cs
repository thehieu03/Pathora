using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetDestinationsQuery : IQuery<ErrorOr<List<string>>>;

