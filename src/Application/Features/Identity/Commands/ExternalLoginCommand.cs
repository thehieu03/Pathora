using Application.Contracts.Identity;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;

namespace Application.Features.Identity.Commands;

public sealed record ExternalLoginCommand(
    string ProviderKey,
    string ProviderEmail,
    string FullName) : ICommand<ErrorOr<ExternalLoginResponse>>;

public sealed class ExternalLoginCommandValidator : AbstractValidator<ExternalLoginCommand>
{
    public ExternalLoginCommandValidator()
    {
        RuleFor(x => x.ProviderKey)
            .NotEmpty().WithMessage("ProviderKey không được để trống");

        RuleFor(x => x.ProviderEmail)
            .NotEmpty().WithMessage("Email không được để trống")
            .EmailAddress().WithMessage("Email không hợp lệ");
    }
}

public sealed class ExternalLoginCommandHandler(IIdentityService identityService)
    : ICommandHandler<ExternalLoginCommand, ErrorOr<ExternalLoginResponse>>
{
    public async Task<ErrorOr<ExternalLoginResponse>> Handle(
        ExternalLoginCommand request,
        CancellationToken cancellationToken)
    {
        return await identityService.ExternalLogin(
            new ExternalLoginRequest("Google", request.ProviderKey, request.ProviderEmail, request.FullName));
    }
}
