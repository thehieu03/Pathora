using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Contracts.Interfaces;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.TourInstance.Commands;

public sealed record UpdateTourInstanceCommand(
    Guid Id,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int MinParticipants,
    int MaxParticipants,
    decimal Price,
    decimal SalePrice,
    string? Location = null,
    string? Category = null,
    DateTimeOffset? ConfirmationDeadline = null,
    List<string>? IncludedServices = null,
    TourInstanceGuideDto? Guide = null,
    List<DynamicPricingDto>? DynamicPricing = null) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class UpdateTourInstanceCommandValidator : AbstractValidator<UpdateTourInstanceCommand>
{
    public UpdateTourInstanceCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceIdRequired);

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceStartDateRequired);

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceEndDateRequired)
            .GreaterThan(x => x.StartDate).WithMessage(ValidationMessages.TourInstanceEndDateAfterStart);

        RuleFor(x => x.MaxParticipants)
            .GreaterThan(0).WithMessage(ValidationMessages.TourInstanceMaxParticipantsGreaterThanZero);

        RuleFor(x => x.MinParticipants)
            .GreaterThanOrEqualTo(0).WithMessage(ValidationMessages.TourInstanceMinParticipantsNonNegative);
    }
}

public sealed class UpdateTourInstanceCommandHandler(ITourInstanceService tourInstanceService)
    : ICommandHandler<UpdateTourInstanceCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourInstanceCommand request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.Update(request);
    }
}
