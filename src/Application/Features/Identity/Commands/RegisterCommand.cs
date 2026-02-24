using Domain.CORS;
using ErrorOr;
using FluentValidation;
using Application.Contracts.Identity;
using Application.Services;

namespace Application.Features.Identity.Commands;

public sealed record RegisterCommand(string Username, string FullName, string Email, string Password) : ICommand<ErrorOr<Success>>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Địa chỉ email không hợp lệ");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Tên không được để trống");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Tên người dùng không được để trống");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu là bắt buộc")
            .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự");
    }
}

public sealed class RegisterCommandHandler(IIdentityService identityService)
    : ICommandHandler<RegisterCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return await identityService.Register(new RegisterRequest(request.Username, request.FullName, request.Email, request.Password));
    }
}


