using FluentValidation;

namespace Application.Contracts.Identity;

public sealed record RegisterRequest(
    string Username,
    string FullName,
    string Email,
    string Password
);

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Địa chỉ email không hợp lệ");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Tên không được để trống");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Tên người dùng không được để trống");
    }
}