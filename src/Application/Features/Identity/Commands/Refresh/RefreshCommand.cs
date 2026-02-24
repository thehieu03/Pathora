using Application.Contracts.Identity;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Refresh;

public sealed record RefreshCommand(string RefreshToken) : ICommand<ErrorOr<RefreshTokenResponse>>;
