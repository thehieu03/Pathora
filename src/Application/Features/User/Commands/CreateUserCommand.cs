using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.User.Commands;

public sealed record CreateUserCommand(
    List<UserDepartmentInfo> Departments,
    List<Guid> RoleIds,
    string Email,
    string FullName,
    string Avatar) : ICommand<ErrorOr<Guid>>;

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

public sealed class CreateUserCommandHandler(IUserService userService)
    : ICommandHandler<CreateUserCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        return await userService.Create(new CreateUserRequest(
            request.Departments, request.RoleIds, request.Email, request.FullName, request.Avatar));
    }
}


