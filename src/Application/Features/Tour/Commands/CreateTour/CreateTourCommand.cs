using Domain.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Tour.Commands.CreateTour;

public sealed record CreateTourCommand(
    string TourCode,
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status) : ICommand<ErrorOr<Guid>>;
