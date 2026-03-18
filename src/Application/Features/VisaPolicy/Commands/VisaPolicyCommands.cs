using Application.Common;
using Application.Contracts.VisaPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;

namespace Application.Features.VisaPolicy.Commands;

public sealed record CreateVisaPolicyCommand(
    string Region,
    int ProcessingDays,
    int BufferDays,
    bool FullPaymentRequired
) : ICommand<ErrorOr<Guid>>;

public sealed class CreateVisaPolicyCommandValidator : AbstractValidator<CreateVisaPolicyCommand>
{
    public CreateVisaPolicyCommandValidator()
    {
        RuleFor(x => x.Region)
            .NotEmpty().WithMessage("Region is required.")
            .MaximumLength(100).WithMessage("Region must not exceed 100 characters.");
        RuleFor(x => x.ProcessingDays)
            .GreaterThan(0).WithMessage("Processing days must be greater than 0.");
        RuleFor(x => x.BufferDays)
            .GreaterThanOrEqualTo(0).WithMessage("Buffer days cannot be negative.");
    }
}

public sealed class CreateVisaPolicyCommandHandler(IVisaPolicyService visaPolicyService)
    : ICommandHandler<CreateVisaPolicyCommand, ErrorOr<Guid>>
{
    private readonly IVisaPolicyService _visaPolicyService = visaPolicyService;

    public async Task<ErrorOr<Guid>> Handle(CreateVisaPolicyCommand request, CancellationToken cancellationToken)
    {
        return await _visaPolicyService.Create(new CreateVisaPolicyRequest(
            request.Region,
            request.ProcessingDays,
            request.BufferDays,
            request.FullPaymentRequired
        ));
    }
}

public sealed record UpdateVisaPolicyCommand(
    Guid Id,
    string Region,
    int ProcessingDays,
    int BufferDays,
    bool FullPaymentRequired,
    bool IsActive
) : ICommand<ErrorOr<Success>>;

public sealed class UpdateVisaPolicyCommandValidator : AbstractValidator<UpdateVisaPolicyCommand>
{
    public UpdateVisaPolicyCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID is required.");
        RuleFor(x => x.Region)
            .NotEmpty().WithMessage("Region is required.")
            .MaximumLength(100).WithMessage("Region must not exceed 100 characters.");
        RuleFor(x => x.ProcessingDays)
            .GreaterThan(0).WithMessage("Processing days must be greater than 0.");
        RuleFor(x => x.BufferDays)
            .GreaterThanOrEqualTo(0).WithMessage("Buffer days cannot be negative.");
    }
}

public sealed class UpdateVisaPolicyCommandHandler(IVisaPolicyService visaPolicyService)
    : ICommandHandler<UpdateVisaPolicyCommand, ErrorOr<Success>>
{
    private readonly IVisaPolicyService _visaPolicyService = visaPolicyService;

    public async Task<ErrorOr<Success>> Handle(UpdateVisaPolicyCommand request, CancellationToken cancellationToken)
    {
        return await _visaPolicyService.Update(new UpdateVisaPolicyRequest(
            request.Id,
            request.Region,
            request.ProcessingDays,
            request.BufferDays,
            request.FullPaymentRequired,
            request.IsActive
        ));
    }
}

public sealed record DeleteVisaPolicyCommand(Guid Id) : ICommand<ErrorOr<Success>>;

public sealed class DeleteVisaPolicyCommandValidator : AbstractValidator<DeleteVisaPolicyCommand>
{
    public DeleteVisaPolicyCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID is required.");
    }
}

public sealed class DeleteVisaPolicyCommandHandler(IVisaPolicyService visaPolicyService)
    : ICommandHandler<DeleteVisaPolicyCommand, ErrorOr<Success>>
{
    private readonly IVisaPolicyService _visaPolicyService = visaPolicyService;

    public async Task<ErrorOr<Success>> Handle(DeleteVisaPolicyCommand request, CancellationToken cancellationToken)
    {
        return await _visaPolicyService.Delete(request.Id);
    }
}
