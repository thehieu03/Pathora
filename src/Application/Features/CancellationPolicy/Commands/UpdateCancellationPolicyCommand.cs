using System.Text.Json.Serialization;
using Application.Contracts.CancellationPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Entities.Translations;
using Domain.Enums;
using Domain.ValueObjects;
using ErrorOr;
using FluentValidation;

namespace Application.Features.CancellationPolicy.Commands;

public sealed record UpdateCancellationPolicyCommand(
    Guid Id,
    TourScope TourScope,
    List<CancellationPolicyTier> Tiers,
    CancellationPolicyStatus Status = CancellationPolicyStatus.Active,
    [property: JsonPropertyName("translations")]
    Dictionary<string, CancellationPolicyTranslationData>? Translations = null
) : ICommand<ErrorOr<CancellationPolicyResponse>>;

public sealed class UpdateCancellationPolicyCommandValidator : AbstractValidator<UpdateCancellationPolicyCommand>
{
    public UpdateCancellationPolicyCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID is required");

        RuleFor(x => x.TourScope)
            .IsInEnum().WithMessage("Invalid tour scope");

        RuleFor(x => x.Tiers)
            .NotNull().WithMessage("Tiers are required")
            .NotEmpty().WithMessage("At least one tier is required");

        RuleForEach(x => x.Tiers).ChildRules(tier =>
        {
            tier.RuleFor(t => t.MinDaysBeforeDeparture)
                .GreaterThanOrEqualTo(0).WithMessage("Min days must be >= 0");
            tier.RuleFor(t => t.MaxDaysBeforeDeparture)
                .GreaterThanOrEqualTo(t => t.MinDaysBeforeDeparture)
                .WithMessage("Max days must be >= min days");
            tier.RuleFor(t => t.PenaltyPercentage)
                .InclusiveBetween(0, 100).WithMessage("Penalty percentage must be between 0 and 100");
        });

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status");
    }
}

public sealed class UpdateCancellationPolicyCommandHandler(ICancellationPolicyService service)
    : ICommandHandler<UpdateCancellationPolicyCommand, ErrorOr<CancellationPolicyResponse>>
{
    public async Task<ErrorOr<CancellationPolicyResponse>> Handle(
        UpdateCancellationPolicyCommand request,
        CancellationToken cancellationToken)
    {
        var updateRequest = new UpdateCancellationPolicyRequest(
            request.Id,
            request.TourScope,
            request.Tiers,
            request.Status,
            request.Translations
        );

        return await service.Update(updateRequest);
    }
}
