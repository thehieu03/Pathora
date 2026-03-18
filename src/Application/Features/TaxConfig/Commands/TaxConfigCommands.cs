using Application.Contracts.TaxConfig;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TaxConfig.Commands;

public sealed record CreateTaxConfigCommand(
    string TaxName,
    decimal TaxRate,
    string? Description,
    DateTimeOffset EffectiveDate
) : ICommand<ErrorOr<Guid>>;

public sealed class CreateTaxConfigCommandValidator : AbstractValidator<CreateTaxConfigCommand>
{
    public CreateTaxConfigCommandValidator()
    {
        RuleFor(x => x.TaxName)
            .NotEmpty().WithMessage("Tax name is required.");

        RuleFor(x => x.TaxRate)
            .GreaterThanOrEqualTo(0).WithMessage("Tax rate cannot be negative.")
            .LessThanOrEqualTo(100).WithMessage("Tax rate cannot exceed 100%.");

        RuleFor(x => x.EffectiveDate)
            .NotEmpty().WithMessage("Effective date is required.");
    }
}

public sealed class CreateTaxConfigCommandHandler(ITaxConfigService taxConfigService)
    : ICommandHandler<CreateTaxConfigCommand, ErrorOr<Guid>>
{
    private readonly ITaxConfigService _taxConfigService = taxConfigService;

    public async Task<ErrorOr<Guid>> Handle(CreateTaxConfigCommand request, CancellationToken cancellationToken)
    {
        var result = await _taxConfigService.Create(new CreateTaxConfigRequest(
            request.TaxName,
            request.TaxRate,
            request.Description,
            request.EffectiveDate
        ));
        return result;
    }
}

public sealed record UpdateTaxConfigCommand(
    Guid Id,
    string TaxName,
    decimal TaxRate,
    string? Description,
    DateTimeOffset EffectiveDate,
    bool IsActive
) : ICommand<ErrorOr<Success>>;

public sealed class UpdateTaxConfigCommandValidator : AbstractValidator<UpdateTaxConfigCommand>
{
    public UpdateTaxConfigCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID is required.");

        RuleFor(x => x.TaxName)
            .NotEmpty().WithMessage("Tax name is required.");

        RuleFor(x => x.TaxRate)
            .GreaterThanOrEqualTo(0).WithMessage("Tax rate cannot be negative.")
            .LessThanOrEqualTo(100).WithMessage("Tax rate cannot exceed 100%.");

        RuleFor(x => x.EffectiveDate)
            .NotEmpty().WithMessage("Effective date is required.");
    }
}

public sealed class UpdateTaxConfigCommandHandler(ITaxConfigService taxConfigService)
    : ICommandHandler<UpdateTaxConfigCommand, ErrorOr<Success>>
{
    private readonly ITaxConfigService _taxConfigService = taxConfigService;

    public async Task<ErrorOr<Success>> Handle(UpdateTaxConfigCommand request, CancellationToken cancellationToken)
    {
        var result = await _taxConfigService.Update(new UpdateTaxConfigRequest(
            request.Id,
            request.TaxName,
            request.TaxRate,
            request.Description,
            request.EffectiveDate,
            request.IsActive
        ));
        return result;
    }
}

public sealed record DeleteTaxConfigCommand(Guid Id) : ICommand<ErrorOr<Success>>;

public sealed class DeleteTaxConfigCommandValidator : AbstractValidator<DeleteTaxConfigCommand>
{
    public DeleteTaxConfigCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID is required.");
    }
}

public sealed class DeleteTaxConfigCommandHandler(ITaxConfigService taxConfigService)
    : ICommandHandler<DeleteTaxConfigCommand, ErrorOr<Success>>
{
    private readonly ITaxConfigService _taxConfigService = taxConfigService;

    public async Task<ErrorOr<Success>> Handle(DeleteTaxConfigCommand request, CancellationToken cancellationToken)
    {
        return await _taxConfigService.Delete(request.Id);
    }
}
