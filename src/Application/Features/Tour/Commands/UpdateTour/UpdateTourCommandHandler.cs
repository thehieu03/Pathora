using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Commands.UpdateTour;

public sealed class UpdateTourCommandHandler(ITourService tourService)
    : ICommandHandler<UpdateTourCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Update(request);
    }
}
