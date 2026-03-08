using Application.Dtos;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetPublicTourInstanceDetailQuery(Guid Id) : IQuery<ErrorOr<TourInstanceDto>>;
