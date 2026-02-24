using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.CreateUser;

public sealed record CreateUserCommand(
    List<UserDepartmentInfo> Departments,
    List<Guid> RoleIds,
    string Email,
    string FullName,
    string Avatar) : ICommand<ErrorOr<Guid>>;
