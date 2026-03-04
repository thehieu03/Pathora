using Application.Contracts.Public;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetHomeStatsQuery : IQuery<ErrorOr<HomeStatsVm>>;
