using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.User.Commands;

public sealed record UpdateUserCommand(
    Guid Id,
    List<UserDepartmentInfo> Departments,
    List<Guid> RoleIds,
    string FullName,
    string Avatar) : ICommand<ErrorOr<Success>>;

public sealed class UpdateUserCommandHandler(IUserService userService)
    : ICommandHandler<UpdateUserCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        return await userService.Update(new UpdateUserRequest(
            request.Id, request.Departments, request.RoleIds, request.FullName, request.Avatar));
    }
}


