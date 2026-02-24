using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Register;

public sealed record RegisterCommand(string Username, string FullName, string Email, string Password) : ICommand<ErrorOr<Success>>;
