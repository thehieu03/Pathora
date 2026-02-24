using Application.Contracts.Identity;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Login;

public sealed record LoginCommand(string Email, string Password) : ICommand<ErrorOr<LoginResponse>>;
