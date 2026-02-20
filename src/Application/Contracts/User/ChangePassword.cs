using FluentValidation;

namespace Application.Contracts.User;

public sealed record ChangePasswordRequest(Guid UserId);

public sealed class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId không được để trống");
    }
}