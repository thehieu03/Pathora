using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Commands.DeleteTour;

public sealed class DeleteTourCommandHandler(ITourService tourService)
    : ICommandHandler<DeleteTourCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Delete(request.Id);
    }
}
