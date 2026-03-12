using Application.Common.Constant;
using Application.Dtos;
using BuildingBlocks.CORS;
using Contracts;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourRequest.Queries;

public sealed record GetMyTourRequestsQuery(
    int PageNumber = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<TourRequestVm>>>;

public sealed class GetMyTourRequestsQueryValidator : AbstractValidator<GetMyTourRequestsQuery>
{
    public GetMyTourRequestsQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0).WithMessage("Page number must be greater than 0.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100).WithMessage("Page size must be between 1 and 100.");
    }
}

public sealed class GetMyTourRequestsQueryHandler(
    IUser user,
    ITourRequestRepository tourRequestRepository)
    : IQueryHandler<GetMyTourRequestsQuery, ErrorOr<PaginatedList<TourRequestVm>>>
{
    public async Task<ErrorOr<PaginatedList<TourRequestVm>>> Handle(GetMyTourRequestsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(user.Id) || !Guid.TryParse(user.Id, out var currentUserId))
        {
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);
        }

        var entities = await tourRequestRepository.GetByUserIdAsync(currentUserId, request.PageNumber, request.PageSize, asNoTracking: true);
        var total = await tourRequestRepository.CountByUserIdAsync(currentUserId);

        return new PaginatedList<TourRequestVm>(total, entities.Select(x => x.ToVm()).ToList());
    }
}
