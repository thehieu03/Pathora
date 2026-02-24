using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Commands.DeleteTour;

public sealed record DeleteTourCommand(Guid Id) : ICommand<ErrorOr<Success>>;
