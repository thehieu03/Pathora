using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Commands.CreateTour;

public sealed class CreateTourCommandHandler(ITourService tourService)
    : ICommandHandler<CreateTourCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Create(request);
    }
}
