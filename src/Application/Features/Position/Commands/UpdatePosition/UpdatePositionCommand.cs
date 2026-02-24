using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Commands.UpdatePosition;

public sealed record UpdatePositionCommand(Guid Id, string Name, int Level, string? Note, int? Type) : ICommand<ErrorOr<Success>>;
