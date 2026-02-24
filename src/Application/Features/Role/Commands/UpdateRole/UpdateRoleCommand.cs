using Domain.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Role.Commands.UpdateRole;

public sealed record UpdateRoleCommand(string RoleId, string Name, string Description, RoleStatus Status, int Type, IEnumerable<int> FunctionIds) : ICommand<ErrorOr<Success>>;
