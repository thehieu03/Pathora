using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Logout;

public sealed record LogoutCommand(string RefreshToken) : ICommand<ErrorOr<Success>>;
