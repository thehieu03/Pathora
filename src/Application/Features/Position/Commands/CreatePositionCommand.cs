using Domain.CORS;
using ErrorOr;
using FluentValidation;
using Application.Contracts.Position;
using Application.Services;

namespace Application.Features.Position.Commands;

public sealed record CreatePositionCommand(string Name, int Level, string? Note, int? Type) : ICommand<ErrorOr<Success>>;

public sealed class CreatePositionCommandValidator : AbstractValidator<CreatePositionCommand>
{
    public CreatePositionCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên chức vụ không được để trống")
            .MaximumLength(255).WithMessage("Tên chức vụ không được quá 255 ký tự");
    }
}

public sealed class CreatePositionCommandHandler(IPositionService positionService)
    : ICommandHandler<CreatePositionCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(CreatePositionCommand request, CancellationToken cancellationToken)
    {
        return await positionService.CreateAsync(new CreatePositionRequest(request.Name, request.Level, request.Note, request.Type));
    }
}


