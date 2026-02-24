using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Commands.DeleteRole;

public sealed record DeleteRoleCommand(string RoleId) : ICommand<ErrorOr<Success>>;
