using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.DeleteUser;

public sealed record DeleteUserCommand(Guid Id) : ICommand<ErrorOr<Success>>;
