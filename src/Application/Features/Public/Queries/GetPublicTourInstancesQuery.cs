using Contracts;
using Application.Dtos;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetPublicTourInstancesQuery(
    string? Destination = null,
    int Page = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<TourInstanceVm>>>;
