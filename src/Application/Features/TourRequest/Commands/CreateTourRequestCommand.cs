using Application.Common.Constant;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.UnitOfWork;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourRequest.Commands;

public sealed record CreateTourRequestCommand(
    string Destination,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int NumberOfParticipants,
    decimal BudgetPerPersonUsd,
    List<string> TravelInterests,
    string? PreferredAccommodation = null,
    string? TransportationPreference = null,
    string? SpecialRequests = null) : ICommand<ErrorOr<Guid>>;

public sealed class CreateTourRequestCommandValidator : AbstractValidator<CreateTourRequestCommand>
{
    private static readonly HashSet<string> AllowedTravelInterests =
    [
        "Adventure",
        "CultureAndHistory",
        "NatureAndWildlife",
        "FoodAndCulinary",
        "RelaxationAndWellness"
    ];

    public CreateTourRequestCommandValidator()
    {
        RuleFor(x => x.Destination)
            .NotEmpty().WithMessage(ValidationMessages.TourRequestDestinationRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourRequestDestinationMaxLength500);

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage(ValidationMessages.TourRequestStartDateRequired);

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage(ValidationMessages.TourRequestEndDateRequired)
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage(ValidationMessages.TourRequestEndDateAfterOrEqualStartDate);

        RuleFor(x => x.NumberOfParticipants)
            .GreaterThan(0).WithMessage(ValidationMessages.TourRequestParticipantsGreaterThanZero);

        RuleFor(x => x.BudgetPerPersonUsd)
            .GreaterThan(0).WithMessage(ValidationMessages.TourRequestBudgetGreaterThanZero);

        RuleFor(x => x.TravelInterests)
            .NotNull().WithMessage(ValidationMessages.TourRequestTravelInterestsRequired)
            .Must(interests => interests.Count > 0).WithMessage(ValidationMessages.TourRequestTravelInterestsRequired);

        RuleForEach(x => x.TravelInterests)
            .Must(BeValidTravelInterest)
            .WithMessage(ValidationMessages.TourRequestTravelInterestInvalid);

        RuleFor(x => x.PreferredAccommodation)
            .MaximumLength(500).WithMessage(ValidationMessages.TourRequestPreferredAccommodationMaxLength500)
            .When(x => !string.IsNullOrWhiteSpace(x.PreferredAccommodation));

        RuleFor(x => x.TransportationPreference)
            .MaximumLength(500).WithMessage(ValidationMessages.TourRequestTransportationPreferenceMaxLength500)
            .When(x => !string.IsNullOrWhiteSpace(x.TransportationPreference));

        RuleFor(x => x.SpecialRequests)
            .MaximumLength(2000).WithMessage(ValidationMessages.TourRequestSpecialRequestsMaxLength2000)
            .When(x => !string.IsNullOrWhiteSpace(x.SpecialRequests));
    }

    private static bool BeValidTravelInterest(string interest)
    {
        return !string.IsNullOrWhiteSpace(interest)
            && AllowedTravelInterests.Contains(interest.Trim());
    }
}

public sealed class CreateTourRequestCommandHandler(
    IUser user,
    IUserRepository userRepository,
    ITourRequestRepository tourRequestRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<CreateTourRequestCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourRequestCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(user.Id) || !Guid.TryParse(user.Id, out var userId))
        {
            return Error.Unauthorized(ErrorConstants.User.UnauthorizedCode, ErrorConstants.User.UnauthorizedDescription);
        }

        var userEntity = await userRepository.FindById(userId);
        if (userEntity is null)
        {
            return Error.NotFound(ErrorConstants.User.NotFoundCode, ErrorConstants.User.NotFoundDescription);
        }

        var requestEntity = TourRequestEntity.Create(
            customerName: string.IsNullOrWhiteSpace(userEntity.FullName) ? userEntity.Username : userEntity.FullName,
            customerPhone: userEntity.PhoneNumber ?? string.Empty,
            destination: request.Destination,
            departureDate: request.StartDate,
            numberAdult: request.NumberOfParticipants,
            performedBy: userEntity.Id.ToString(),
            userId: userEntity.Id,
            customerEmail: userEntity.Email,
            returnDate: request.EndDate,
            budget: request.BudgetPerPersonUsd,
            travelInterests: request.TravelInterests,
            preferredAccommodation: request.PreferredAccommodation,
            transportationPreference: request.TransportationPreference,
            specialRequirements: request.SpecialRequests);

        await tourRequestRepository.AddAsync(requestEntity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return requestEntity.Id;
    }
}
