using Application.Dtos;
using Application.Features.Tour.Commands;
using FluentValidation;

namespace Application.Features.Tour.Validators;

public sealed class ImageInputDtoValidator : AbstractValidator<ImageInputDto>
{
    public ImageInputDtoValidator()
    {
        RuleFor(x => x.FileId)
            .NotEmpty().WithMessage("Thumbnail file ID is required.");

        RuleFor(x => x.OriginalFileName)
            .NotEmpty().WithMessage("Original file name is required.");

        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("File name is required.");

        RuleFor(x => x.PublicURL)
            .NotEmpty().WithMessage("Public URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Public URL must be a valid URL.");
    }
}

public sealed class ClassificationDtoValidator : AbstractValidator<ClassificationDto>
{
    public ClassificationDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Classification name is required.")
            .MaximumLength(200).WithMessage("Classification name must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Classification description must not exceed 1000 characters.");

        RuleFor(x => x.AdultPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Adult price must be greater than or equal to 0.");

        RuleFor(x => x.ChildPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Child price must be greater than or equal to 0.");

        RuleFor(x => x.InfantPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Infant price must be greater than or equal to 0.");

        RuleFor(x => x.NumberOfDay)
            .GreaterThan(0).WithMessage("Number of days must be greater than 0.");

        RuleFor(x => x.NumberOfNight)
            .GreaterThanOrEqualTo(0).WithMessage("Number of nights must be greater than or equal to 0.");

        RuleForEach(x => x.Plans)
            .SetValidator(new DayPlanDtoValidator())
            .When(x => x.Plans != null && x.Plans.Any());

        RuleForEach(x => x.Insurances)
            .SetValidator(new InsuranceDtoValidator())
            .When(x => x.Insurances != null && x.Insurances.Any());
    }
}

public sealed class DayPlanDtoValidator : AbstractValidator<DayPlanDto>
{
    public DayPlanDtoValidator()
    {
        RuleFor(x => x.DayNumber)
            .GreaterThan(0).WithMessage("Day number must be greater than 0.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Day plan title is required.")
            .MaximumLength(200).WithMessage("Day plan title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Day plan description must not exceed 2000 characters.");

        RuleForEach(x => x.Activities)
            .SetValidator(new ActivityDtoValidator())
            .When(x => x.Activities != null && x.Activities.Any());
    }
}

public sealed class ActivityDtoValidator : AbstractValidator<ActivityDto>
{
    public ActivityDtoValidator()
    {
        RuleFor(x => x.ActivityType)
            .NotEmpty().WithMessage("Activity type is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Activity title is required.")
            .MaximumLength(200).WithMessage("Activity title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Activity description must not exceed 1000 characters.");

        RuleFor(x => x.EstimatedCost)
            .GreaterThanOrEqualTo(0).WithMessage("Estimated cost must be greater than or equal to 0.");

        RuleForEach(x => x.Routes)
            .SetValidator(new RouteDtoValidator())
            .When(x => x.Routes != null && x.Routes.Any());

        RuleFor(x => x.Accommodation)
            .SetValidator(new AccommodationDtoValidator()!)
            .When(x => x.Accommodation != null);
    }
}

public sealed class RouteDtoValidator : AbstractValidator<RouteDto>
{
    public RouteDtoValidator()
    {
        RuleFor(x => x.FromLocationName)
            .NotEmpty().WithMessage("From location is required.");

        RuleFor(x => x.ToLocationName)
            .NotEmpty().WithMessage("To location is required.");

        RuleFor(x => x.TransportationType)
            .NotEmpty().WithMessage("Transportation type is required.");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Route price must be greater than or equal to 0.");
    }
}

public sealed class AccommodationDtoValidator : AbstractValidator<AccommodationDto>
{
    public AccommodationDtoValidator()
    {
        RuleFor(x => x.AccommodationName)
            .NotEmpty().WithMessage("Accommodation name is required.")
            .MaximumLength(200).WithMessage("Accommodation name must not exceed 200 characters.");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

        RuleFor(x => x.ContactPhone)
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Invalid phone number format.")
            .When(x => !string.IsNullOrEmpty(x.ContactPhone));

        RuleFor(x => x.CheckInTime)
            .MaximumLength(50).WithMessage("Check-in time must not exceed 50 characters.");

        RuleFor(x => x.CheckOutTime)
            .MaximumLength(50).WithMessage("Check-out time must not exceed 50 characters.");
    }
}

public sealed class InsuranceDtoValidator : AbstractValidator<InsuranceDto>
{
    public InsuranceDtoValidator()
    {
        RuleFor(x => x.InsuranceName)
            .NotEmpty().WithMessage("Insurance name is required.")
            .MaximumLength(200).WithMessage("Insurance name must not exceed 200 characters.");

        RuleFor(x => x.InsuranceType)
            .NotEmpty().WithMessage("Insurance type is required.");

        RuleFor(x => x.InsuranceProvider)
            .MaximumLength(200).WithMessage("Insurance provider must not exceed 200 characters.");

        RuleFor(x => x.CoverageDescription)
            .MaximumLength(1000).WithMessage("Coverage description must not exceed 1000 characters.");

        RuleFor(x => x.CoverageAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Coverage amount must be greater than or equal to 0.");

        RuleFor(x => x.CoverageFee)
            .GreaterThanOrEqualTo(0).WithMessage("Coverage fee must be greater than or equal to 0.");
    }
}
