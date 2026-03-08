using Application.Dtos;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed record GetTourInstanceStatsQuery() : IQuery<ErrorOr<TourInstanceStatsDto>>;
