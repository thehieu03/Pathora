using Application.Contracts.Position;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Commands.CreatePosition;

public sealed class CreatePositionCommandHandler(IPositionService positionService)
    : ICommandHandler<CreatePositionCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(CreatePositionCommand request, CancellationToken cancellationToken)
    {
        return await positionService.CreateAsync(new CreatePositionRequest(request.Name, request.Level, request.Note, request.Type));
    }
}
