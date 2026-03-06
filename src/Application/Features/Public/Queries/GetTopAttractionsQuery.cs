using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetTopAttractionsQuery(int Limit = 8) : IQuery<ErrorOr<List<TopAttractionVm>>>;
