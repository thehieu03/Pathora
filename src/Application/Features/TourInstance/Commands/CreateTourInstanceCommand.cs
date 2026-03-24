using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Contracts.Interfaces;
using BuildingBlocks.CORS;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.TourInstance.Commands;

public sealed record CreateTourInstanceCommand(
    Guid TourId,
    Guid ClassificationId,
    string Title,
    TourType InstanceType,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int MaxParticipation,
    string? Location = null,
    DateTimeOffset? ConfirmationDeadline = null,
    List<string>? IncludedServices = null,
    List<Guid>? GuideUserIds = null,
    List<Guid>? ManagerUserIds = null) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class CreateTourInstanceCommandValidator : AbstractValidator<CreateTourInstanceCommand>
{
    public CreateTourInstanceCommandValidator()
    {
        RuleFor(x => x.TourId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceTourIdRequired);

        RuleFor(x => x.ClassificationId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceClassificationIdRequired);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceTitleRequired);

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceStartDateRequired);

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceEndDateRequired)
            .GreaterThan(x => x.StartDate).WithMessage(ValidationMessages.TourInstanceEndDateAfterStart);

        RuleFor(x => x.MaxParticipation)
            .GreaterThan(0).WithMessage(ValidationMessages.TourInstanceMaxParticipantsGreaterThanZero);

        RuleFor(x => x.GuideUserIds)
            .Must(ids => ids == null || ids.Distinct().Count() == ids.Count)
            .WithMessage("Guide IDs không được trùng nhau")
            .When(x => x.GuideUserIds is { Count: > 0 });

        RuleFor(x => x.ManagerUserIds)
            .Must(ids => ids == null || ids.Distinct().Count() == ids.Count)
            .WithMessage("Manager IDs không được trùng nhau")
            .When(x => x.ManagerUserIds is { Count: > 0 });

        RuleFor(x => x)
            .Must(x => x.GuideUserIds == null || x.ManagerUserIds == null ||
                       !x.GuideUserIds.Any(g => x.ManagerUserIds.Contains(g)))
            .WithMessage("Một user không thể vừa là Guide vừa là Manager");
    }
}

public sealed class CreateTourInstanceCommandHandler(ITourInstanceService tourInstanceService)
    : ICommandHandler<CreateTourInstanceCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourInstanceCommand request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.Create(request);
    }
}
