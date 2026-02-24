using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.UpdateUser;

public sealed record UpdateUserCommand(
    Guid Id,
    List<UserDepartmentInfo> Departments,
    List<Guid> RoleIds,
    string FullName,
    string Avatar) : ICommand<ErrorOr<Success>>;
