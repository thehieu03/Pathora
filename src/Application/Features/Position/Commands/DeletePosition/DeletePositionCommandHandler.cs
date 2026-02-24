using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Commands.DeletePosition;

public sealed class DeletePositionCommandHandler(IPositionService positionService)
    : ICommandHandler<DeletePositionCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeletePositionCommand request, CancellationToken cancellationToken)
    {
        return await positionService.DeleteAsync(request.Id);
    }
}
