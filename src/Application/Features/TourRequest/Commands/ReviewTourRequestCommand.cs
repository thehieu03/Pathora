using Application.Common.Constant;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourRequest.Commands;

public sealed record ReviewTourRequestCommand(
    Guid Id,
    TourRequestStatus Status,
    string? AdminNote = null) : ICommand<ErrorOr<Success>>;

public sealed class ReviewTourRequestCommandValidator : AbstractValidator<ReviewTourRequestCommand>
{
    public ReviewTourRequestCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(ValidationMessages.TourRequestIdRequired);

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage(ValidationMessages.TourRequestReviewStatusRequired)
            .Must(status => status is TourRequestStatus.Approved or TourRequestStatus.Rejected)
            .WithMessage(ValidationMessages.TourRequestReviewStatusInvalid);

        RuleFor(x => x.AdminNote)
            .MaximumLength(2000).WithMessage(ValidationMessages.TourRequestAdminNoteMaxLength2000)
            .When(x => !string.IsNullOrWhiteSpace(x.AdminNote));
    }
}

public sealed class ReviewTourRequestCommandHandler(
    IUser user,
    IRoleRepository roleRepository,
    ITourRequestRepository tourRequestRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<ReviewTourRequestCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(ReviewTourRequestCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(user.Id) || !Guid.TryParse(user.Id, out var currentUserId))
        {
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);
        }

        var adminCheck = await EnsureAdminAsync(currentUserId);
        if (adminCheck.IsError)
        {
            return adminCheck.Errors;
        }

        var requestEntity = await tourRequestRepository.GetByIdAsync(request.Id);
        if (requestEntity is null)
        {
            return Error.NotFound(ErrorConstants.TourRequest.NotFoundCode, ErrorConstants.TourRequest.NotFoundDescription);
        }

        try
        {
            if (request.Status == TourRequestStatus.Approved)
            {
                requestEntity.Approve(currentUserId, currentUserId.ToString(), adminNote: request.AdminNote);
            }
            else
            {
                requestEntity.Reject(currentUserId, currentUserId.ToString(), request.AdminNote);
            }
        }
        catch (InvalidOperationException)
        {
            return Error.Validation(
                ErrorConstants.TourRequest.InvalidStatusTransitionCode,
                ErrorConstants.TourRequest.InvalidStatusTransitionDescription);
        }

        await tourRequestRepository.UpdateAsync(requestEntity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }

    private async Task<ErrorOr<Success>> EnsureAdminAsync(Guid currentUserId)
    {
        var rolesResult = await roleRepository.FindByUserId(currentUserId.ToString());
        if (rolesResult.IsError)
        {
            return rolesResult.Errors;
        }

        var isAdmin = rolesResult.Value.Any(role =>
            role.Type == 9
            || string.Equals(role.Name, "Admin", StringComparison.OrdinalIgnoreCase)
            || string.Equals(role.Name, "SuperAdmin", StringComparison.OrdinalIgnoreCase));

        return isAdmin
            ? Result.Success
            : Error.Forbidden(ErrorConstants.TourRequest.AdminOnlyCode, ErrorConstants.TourRequest.AdminOnlyDescription);
    }
}
