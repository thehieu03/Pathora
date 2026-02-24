using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Commands.DeletePosition;

public sealed record DeletePositionCommand(Guid Id) : ICommand<ErrorOr<Success>>;
