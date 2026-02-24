using FluentValidation;

namespace Application.Features.User.Commands.CreateUser;

public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Địa chỉ email không hợp lệ");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên là bắt buộc");
    }
}
