using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetTopReviewsQueryHandler(IReviewRepository reviewRepository) 
    : IQueryHandler<GetTopReviewsQuery, ErrorOr<List<TopReviewVm>>>
{
    private readonly IReviewRepository _reviewRepository = reviewRepository;

    public async Task<ErrorOr<List<TopReviewVm>>> Handle(GetTopReviewsQuery request, CancellationToken cancellationToken)
    {
        var reviews = await _reviewRepository.GetTopReviews(request.Limit);

        var result = reviews.Select(r => new TopReviewVm(
            r.User.Username,
            r.User.AvatarUrl,
            r.Tour.TourName,
            r.Rating,
            r.Comment,
            r.CreatedOnUtc)).ToList();

        return result;
    }
}
