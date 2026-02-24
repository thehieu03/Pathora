using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Commands.CreateRole;

public sealed record CreateRoleCommand(string Name, string Description, int Type, IEnumerable<int> FunctionIds) : ICommand<ErrorOr<Guid>>;
