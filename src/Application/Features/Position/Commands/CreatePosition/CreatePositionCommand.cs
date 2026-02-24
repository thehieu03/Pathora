using Domain.CORS;
using ErrorOr;

namespace Application.Features.Position.Commands.CreatePosition;

public sealed record CreatePositionCommand(string Name, int Level, string? Note, int? Type) : ICommand<ErrorOr<Success>>;
