using System.Text.Json.Serialization;
using Application.Contracts.CancellationPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Entities.Translations;
using Domain.Enums;
using ErrorOr;
using FluentValidation;

namespace Application.Features.CancellationPolicy.Commands;

public sealed record UpdateCancellationPolicyCommand(
    Guid Id,
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount",
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
            request.MinDaysBeforeDeparture,
            request.MaxDaysBeforeDeparture,
            request.PenaltyPercentage,
            request.ApplyOn,
            request.Status,
            request.Translations
        );

        return await service.Update(updateRequest);
    }
}
