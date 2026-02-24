using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.ChangePassword;

public sealed record ChangePasswordCommand(Guid UserId) : ICommand<ErrorOr<Success>>;
