using Application.Common.Constant;
using FluentValidation;

namespace Application.Contracts.Identity;

public record ForgotPasswordRequest(string Code, string Email, string NewPassword);

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage(ValidationMessages.NewPasswordRequired)
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")
            .WithMessage(ValidationMessages.PasswordComplexity);
    }
}

