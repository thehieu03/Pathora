using Application.Contracts.CancellationPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Enums;
using ErrorOr;
using FluentValidation;

namespace Application.Features.CancellationPolicy.Commands;

public sealed record CreateCancellationPolicyCommand(
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount"
) : ICommand<ErrorOr<CancellationPolicyResponse>>;

public sealed class CreateCancellationPolicyCommandValidator : AbstractValidator<CreateCancellationPolicyCommand>
{
    public CreateCancellationPolicyCommandValidator()
    {
        RuleFor(x => x.TourScope)
            .IsInEnum().WithMessage("Invalid tour scope");

        RuleFor(x => x.MinDaysBeforeDeparture)
            .GreaterThanOrEqualTo(0).WithMessage("Min days must be >= 0");

        RuleFor(x => x.MaxDaysBeforeDeparture)
            .GreaterThanOrEqualTo(x => x.MinDaysBeforeDeparture)
            .WithMessage("Max days must be >= min days");

        RuleFor(x => x.PenaltyPercentage)
            .InclusiveBetween(0, 100).WithMessage("Penalty percentage must be between 0 and 100");

        RuleFor(x => x.ApplyOn)
            .NotEmpty().WithMessage("ApplyOn is required")
            .MaximumLength(50).WithMessage("ApplyOn must not exceed 50 characters");
    }
}

public sealed class CreateCancellationPolicyCommandHandler(ICancellationPolicyService service)
    : ICommandHandler<CreateCancellationPolicyCommand, ErrorOr<CancellationPolicyResponse>>
{
    public async Task<ErrorOr<CancellationPolicyResponse>> Handle(
        CreateCancellationPolicyCommand request,
        CancellationToken cancellationToken)
    {
        var createRequest = new CreateCancellationPolicyRequest(
            request.TourScope,
            request.MinDaysBeforeDeparture,
            request.MaxDaysBeforeDeparture,
            request.PenaltyPercentage,
            request.ApplyOn
        );

        return await service.Create(createRequest);
    }
}
