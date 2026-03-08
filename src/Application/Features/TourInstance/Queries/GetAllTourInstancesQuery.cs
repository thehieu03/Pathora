using Contracts;
using Application.Dtos;
using BuildingBlocks.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed record GetAllTourInstancesQuery(
    string? SearchText,
    TourInstanceStatus? Status = null,
    int PageNumber = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<TourInstanceVm>>>;
