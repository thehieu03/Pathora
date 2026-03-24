using Application.Common;
using Application.Common.Constant;
using Application.Contracts.Booking;
using Application.Services;
using Contracts.Interfaces;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using FluentValidation;

namespace Application.Features.BookingManagement.TourGuide;

public sealed record CreateTourGuideCommand(
    string FullName,
    string LicenseNumber,
    string? NickName,
    GenderType? Gender,
    DateTimeOffset? DateOfBirth,
    string? PhoneNumber,
    string? Email,
    string? Address,
    DateTimeOffset? LicenseExpiryDate,
    string? Languages,
    string? Specializations,
    string? ProfileImageUrl,
    int YearsOfExperience,
    decimal? Rating,
    bool IsAvailable,
    bool IsActive,
    string? Note) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class CreateTourGuideCommandValidator : AbstractValidator<CreateTourGuideCommand>
{
    public CreateTourGuideCommandValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.LicenseNumber).NotEmpty().MaximumLength(100);
        RuleFor(x => x.YearsOfExperience).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5).When(x => x.Rating.HasValue);
    }
}

public sealed class CreateTourGuideCommandHandler(
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<CreateTourGuideCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourGuideCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var existing = await tourGuideRepository.GetByLicenseNumberAsync(request.LicenseNumber);
        if (existing is not null)
        {
            return Error.Conflict(
                ErrorConstants.TourGuide.LicenseExistsCode,
                ErrorConstants.TourGuide.LicenseExistsDescription.Resolve(lang));
        }

        var entity = TourGuideEntity.Create(
            request.FullName,
            request.LicenseNumber,
            performedBy: "system",
            request.NickName,
            request.Gender,
            request.DateOfBirth,
            request.PhoneNumber,
            request.Email,
            request.Address,
            request.LicenseExpiryDate,
            request.Languages,
            request.Specializations,
            request.ProfileImageUrl,
            request.YearsOfExperience,
            request.Rating,
            request.IsAvailable,
            request.IsActive,
            request.Note);

        await tourGuideRepository.AddAsync(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return entity.Id;
    }
}

public sealed record UpdateTourGuideCommand(
    Guid TourGuideId,
    string FullName,
    string LicenseNumber,
    string? NickName,
    GenderType? Gender,
    DateTimeOffset? DateOfBirth,
    string? PhoneNumber,
    string? Email,
    string? Address,
    DateTimeOffset? LicenseExpiryDate,
    string? Languages,
    string? Specializations,
    string? ProfileImageUrl,
    int YearsOfExperience,
    decimal? Rating,
    bool IsAvailable,
    bool IsActive,
    string? Note) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class UpdateTourGuideCommandValidator : AbstractValidator<UpdateTourGuideCommand>
{
    public UpdateTourGuideCommandValidator()
    {
        RuleFor(x => x.TourGuideId).NotEmpty();
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.LicenseNumber).NotEmpty().MaximumLength(100);
        RuleFor(x => x.YearsOfExperience).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Rating).InclusiveBetween(0, 5).When(x => x.Rating.HasValue);
    }
}

public sealed class UpdateTourGuideCommandHandler(
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<UpdateTourGuideCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourGuideCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound(
                ErrorConstants.TourGuide.NotFoundCode,
                ErrorConstants.TourGuide.NotFoundDescription.Resolve(lang));
        }

        var existing = await tourGuideRepository.GetByLicenseNumberAsync(request.LicenseNumber);
        if (existing is not null && existing.Id != request.TourGuideId)
        {
            return Error.Conflict(
                ErrorConstants.TourGuide.LicenseExistsCode,
                ErrorConstants.TourGuide.LicenseExistsDescription.Resolve(lang));
        }

        entity.Update(
            request.FullName,
            request.LicenseNumber,
            performedBy: "system",
            request.NickName,
            request.Gender,
            request.DateOfBirth,
            request.PhoneNumber,
            request.Email,
            request.Address,
            request.LicenseExpiryDate,
            request.Languages,
            request.Specializations,
            request.ProfileImageUrl,
            request.YearsOfExperience,
            request.Rating,
            request.IsAvailable,
            request.IsActive,
            request.Note);

        tourGuideRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record DeleteTourGuideCommand(Guid TourGuideId) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class DeleteTourGuideCommandHandler(
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<DeleteTourGuideCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteTourGuideCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound(
                ErrorConstants.TourGuide.NotFoundCode,
                ErrorConstants.TourGuide.NotFoundDescription.Resolve(lang));
        }

        entity.SoftDelete("system");
        tourGuideRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record GetTourGuideByIdQuery(Guid TourGuideId) : IQuery<ErrorOr<TourGuideDto>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:tour-guide:{TourGuideId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetTourGuideByIdQueryHandler(
    ITourGuideRepository tourGuideRepository,
    ILanguageContext? languageContext = null)
    : IQueryHandler<GetTourGuideByIdQuery, ErrorOr<TourGuideDto>>
{
    public async Task<ErrorOr<TourGuideDto>> Handle(GetTourGuideByIdQuery request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound(
                ErrorConstants.TourGuide.NotFoundCode,
                ErrorConstants.TourGuide.NotFoundDescription.Resolve(lang));
        }

        return ToDto(entity);
    }

    private static TourGuideDto ToDto(TourGuideEntity entity)
    {
        return new TourGuideDto(
            entity.Id,
            entity.FullName,
            entity.NickName,
            entity.Gender,
            entity.DateOfBirth,
            entity.PhoneNumber,
            entity.Email,
            entity.Address,
            entity.LicenseNumber,
            entity.LicenseExpiryDate,
            entity.Languages,
            entity.Specializations,
            entity.ProfileImageUrl,
            entity.YearsOfExperience,
            entity.Rating,
            entity.IsAvailable,
            entity.IsActive,
            entity.Note);
    }
}

public sealed record GetTourGuidesQuery(bool? IsAvailable = null, string? Language = null, string? Specialization = null)
    : IQuery<ErrorOr<List<TourGuideDto>>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:tour-guides:{IsAvailable}:{Language}:{Specialization}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetTourGuidesQueryHandler(ITourGuideRepository tourGuideRepository)
    : IQueryHandler<GetTourGuidesQuery, ErrorOr<List<TourGuideDto>>>
{
    public async Task<ErrorOr<List<TourGuideDto>>> Handle(GetTourGuidesQuery request, CancellationToken cancellationToken)
    {
        var entities = await tourGuideRepository.SearchAsync(request.IsAvailable, request.Language, request.Specialization);

        return entities.Select(x => new TourGuideDto(
                x.Id,
                x.FullName,
                x.NickName,
                x.Gender,
                x.DateOfBirth,
                x.PhoneNumber,
                x.Email,
                x.Address,
                x.LicenseNumber,
                x.LicenseExpiryDate,
                x.Languages,
                x.Specializations,
                x.ProfileImageUrl,
                x.YearsOfExperience,
                x.Rating,
                x.IsAvailable,
                x.IsActive,
                x.Note))
            .ToList();
    }
}

public sealed record AssignTourGuideToBookingCommand(
    Guid BookingId,
    Guid UserId,
    AssignedRole AssignedRole,
    bool IsLead,
    Guid? TourGuideId,
    Guid? AssignedBy,
    string? Note) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class AssignTourGuideToBookingCommandValidator : AbstractValidator<AssignTourGuideToBookingCommand>
{
    public AssignTourGuideToBookingCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.TourGuideId)
            .NotEmpty()
            .When(x => x.AssignedRole == AssignedRole.TourGuide)
            .WithMessage(ValidationMessages.TourGuideRequiredForRole);
    }
}

public sealed class AssignTourGuideToBookingCommandHandler(
    IBookingRepository bookingRepository,
    IUserRepository userRepository,
    ITourGuideRepository tourGuideRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<AssignTourGuideToBookingCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(AssignTourGuideToBookingCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound(
                ErrorConstants.Booking.NotFoundCode,
                ErrorConstants.Booking.NotFoundDescription.Resolve(lang));
        }

        var user = await userRepository.FindById(request.UserId);
        if (user is null || user.IsDeleted)
        {
            return Error.NotFound(
                ErrorConstants.User.NotFoundCode,
                ErrorConstants.User.AssignedUserNotFoundDescription.Resolve(lang));
        }

        var existingAssignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (existingAssignment is not null)
        {
            return Error.Conflict(
                ErrorConstants.BookingTeam.AssignmentExistsCode,
                ErrorConstants.BookingTeam.AssignmentExistsDescription.Resolve(lang));
        }

        TourGuideEntity? tourGuide = null;
        if (request.AssignedRole == AssignedRole.TourGuide)
        {
            if (!request.TourGuideId.HasValue)
            {
                return Error.Validation(
                    ErrorConstants.BookingTeam.TourGuideRequiredCode,
                    ErrorConstants.BookingTeam.TourGuideRequiredDescription.Resolve(lang));
            }

            tourGuide = await tourGuideRepository.GetByIdAsync(request.TourGuideId.Value);
            if (tourGuide is null || tourGuide.IsDeleted || !tourGuide.IsActive)
            {
                return Error.NotFound(
                    ErrorConstants.TourGuide.NotFoundCode,
                    ErrorConstants.TourGuide.NotFoundDescription.Resolve(lang));
            }

            if (!tourGuide.IsAvailable)
            {
                return Error.Conflict(
                    ErrorConstants.TourGuide.UnavailableCode,
                    ErrorConstants.TourGuide.UnavailableDescription.Resolve(lang));
            }
        }

        var entity = BookingTourGuideEntity.Create(
            request.BookingId,
            request.UserId,
            request.AssignedRole,
            performedBy: "system",
            request.TourGuideId,
            request.IsLead,
            request.AssignedBy,
            request.Note);

        await bookingTourGuideRepository.AddAsync(entity);

        if (tourGuide is not null)
        {
            tourGuide.SetAvailability(false, "system");
            tourGuideRepository.Update(tourGuide);
        }

        await unitOfWork.SaveChangeAsync(cancellationToken);

        return entity.Id;
    }
}

public sealed record UpdateTourGuideAssignmentStatusCommand(
    Guid BookingId,
    Guid UserId,
    AssignmentStatus Status,
    string? Note) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class UpdateTourGuideAssignmentStatusCommandValidator : AbstractValidator<UpdateTourGuideAssignmentStatusCommand>
{
    public UpdateTourGuideAssignmentStatusCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public sealed class UpdateTourGuideAssignmentStatusCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<UpdateTourGuideAssignmentStatusCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourGuideAssignmentStatusCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound(
                ErrorConstants.BookingTeam.AssignmentNotFoundCode,
                ErrorConstants.BookingTeam.AssignmentNotFoundDescription.Resolve(lang));
        }

        assignment.Update(
            assignment.AssignedRole,
            performedBy: "system",
            assignment.TourGuideId,
            assignment.IsLead,
            request.Status,
            request.Note);

        bookingTourGuideRepository.Update(assignment);

        if (assignment.TourGuideId.HasValue)
        {
            var tourGuide = await tourGuideRepository.GetByIdAsync(assignment.TourGuideId.Value);
            if (tourGuide is not null && !tourGuide.IsDeleted)
            {
                var isAvailable = request.Status is AssignmentStatus.Completed or AssignmentStatus.Cancelled;
                tourGuide.SetAvailability(isAvailable, "system");
                tourGuideRepository.Update(tourGuide);
            }
        }

        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record GetBookingTeamQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:team:{BookingId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetBookingTeamQueryHandler(
    IBookingRepository bookingRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IOwnershipValidator ownershipValidator)
    : IQueryHandler<GetBookingTeamQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingTeamQuery request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        if (!await ownershipValidator.CanAccessAsync(booking.UserId ?? Guid.Empty, cancellationToken))
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        var assignments = await bookingTourGuideRepository.GetByBookingIdAsync(request.BookingId);
        return assignments.Select(ToDto).ToList();
    }

    private static BookingTeamMemberDto ToDto(BookingTourGuideEntity entity)
    {
        return new BookingTeamMemberDto(
            entity.Id,
            entity.BookingId,
            entity.UserId,
            entity.TourGuideId,
            entity.AssignedRole,
            entity.IsLead,
            entity.Status,
            entity.AssignedDate,
            entity.Note);
    }
}

public sealed record GetBookingTourManagerQuery(Guid BookingId) : IQuery<ErrorOr<BookingTeamMemberDto>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:team-manager:{BookingId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetBookingTourManagerQueryHandler(
    IBookingRepository bookingRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IOwnershipValidator ownershipValidator,
    ILanguageContext? languageContext = null)
    : IQueryHandler<GetBookingTourManagerQuery, ErrorOr<BookingTeamMemberDto>>
{
    public async Task<ErrorOr<BookingTeamMemberDto>> Handle(GetBookingTourManagerQuery request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        if (!await ownershipValidator.CanAccessAsync(booking.UserId ?? Guid.Empty, cancellationToken))
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        var lang = languageContext?.CurrentLanguage ?? "vi";
        var assignments = await bookingTourGuideRepository.GetByBookingIdAsync(request.BookingId);
        var manager = assignments.FirstOrDefault(x => x.AssignedRole == AssignedRole.TourManager);
        if (manager is null)
        {
            return Error.NotFound(
                ErrorConstants.BookingTeam.TourManagerNotFoundCode,
                ErrorConstants.BookingTeam.TourManagerNotFoundDescription.Resolve(lang));
        }

        return new BookingTeamMemberDto(
            manager.Id,
            manager.BookingId,
            manager.UserId,
            manager.TourGuideId,
            manager.AssignedRole,
            manager.IsLead,
            manager.Status,
            manager.AssignedDate,
            manager.Note);
    }
}

public sealed record GetBookingTourOperatorsQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:team-operators:{BookingId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetBookingTourOperatorsQueryHandler(
    IBookingRepository bookingRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IOwnershipValidator ownershipValidator)
    : IQueryHandler<GetBookingTourOperatorsQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingTourOperatorsQuery request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        if (!await ownershipValidator.CanAccessAsync(booking.UserId ?? Guid.Empty, cancellationToken))
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        var assignments = await bookingTourGuideRepository.GetByBookingIdAsync(request.BookingId);
        return assignments
            .Where(x => x.AssignedRole == AssignedRole.TourOperator)
            .Select(x => new BookingTeamMemberDto(
                x.Id,
                x.BookingId,
                x.UserId,
                x.TourGuideId,
                x.AssignedRole,
                x.IsLead,
                x.Status,
                x.AssignedDate,
                x.Note))
            .ToList();
    }
}

public sealed record GetBookingAssignedTourGuidesQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>, ICacheable
{
    public string CacheKey => $"{Application.Common.CacheKey.Booking}:team-guides:{BookingId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetBookingAssignedTourGuidesQueryHandler(
    IBookingRepository bookingRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IOwnershipValidator ownershipValidator)
    : IQueryHandler<GetBookingAssignedTourGuidesQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingAssignedTourGuidesQuery request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        if (!await ownershipValidator.CanAccessAsync(booking.UserId ?? Guid.Empty, cancellationToken))
        {
            return Error.NotFound(ErrorConstants.Booking.NotFoundCode, ErrorConstants.Booking.NotFoundDescription);
        }

        var assignments = await bookingTourGuideRepository.GetByBookingIdAsync(request.BookingId);
        return assignments
            .Where(x => x.AssignedRole == AssignedRole.TourGuide)
            .Select(x => new BookingTeamMemberDto(
                x.Id,
                x.BookingId,
                x.UserId,
                x.TourGuideId,
                x.AssignedRole,
                x.IsLead,
                x.Status,
                x.AssignedDate,
                x.Note))
            .ToList();
    }
}

public sealed record UpdateTeamMemberAssignmentCommand(
    Guid BookingId,
    Guid UserId,
    AssignedRole AssignedRole,
    bool IsLead,
    Guid? TourGuideId,
    string? Note) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class UpdateTeamMemberAssignmentCommandValidator : AbstractValidator<UpdateTeamMemberAssignmentCommand>
{
    public UpdateTeamMemberAssignmentCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.TourGuideId)
            .NotEmpty()
            .When(x => x.AssignedRole == AssignedRole.TourGuide)
            .WithMessage(ValidationMessages.TourGuideRequiredForRole);
    }
}

public sealed class UpdateTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<UpdateTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound(
                ErrorConstants.BookingTeam.AssignmentNotFoundCode,
                ErrorConstants.BookingTeam.AssignmentNotFoundDescription.Resolve(lang));
        }

        var previousTourGuideId = assignment.TourGuideId;
        Guid? nextTourGuideId = request.AssignedRole == AssignedRole.TourGuide ? request.TourGuideId : null;

        if (nextTourGuideId.HasValue && previousTourGuideId != nextTourGuideId)
        {
            var nextTourGuide = await tourGuideRepository.GetByIdAsync(nextTourGuideId.Value);
            if (nextTourGuide is null || nextTourGuide.IsDeleted || !nextTourGuide.IsActive)
            {
                return Error.NotFound(
                    ErrorConstants.TourGuide.NotFoundCode,
                    ErrorConstants.TourGuide.NotFoundDescription.Resolve(lang));
            }

            if (!nextTourGuide.IsAvailable)
            {
                return Error.Conflict(
                    ErrorConstants.TourGuide.UnavailableCode,
                    ErrorConstants.TourGuide.UnavailableDescription.Resolve(lang));
            }

            nextTourGuide.SetAvailability(false, "system");
            tourGuideRepository.Update(nextTourGuide);
        }

        if (previousTourGuideId.HasValue && previousTourGuideId != nextTourGuideId)
        {
            var previousGuide = await tourGuideRepository.GetByIdAsync(previousTourGuideId.Value);
            if (previousGuide is not null && !previousGuide.IsDeleted)
            {
                previousGuide.SetAvailability(true, "system");
                tourGuideRepository.Update(previousGuide);
            }
        }

        assignment.Update(
            request.AssignedRole,
            performedBy: "system",
            nextTourGuideId,
            request.IsLead,
            assignment.Status,
            request.Note);

        bookingTourGuideRepository.Update(assignment);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record DeleteTeamMemberAssignmentCommand(Guid BookingId, Guid UserId) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class DeleteTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<DeleteTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound(
                ErrorConstants.BookingTeam.AssignmentNotFoundCode,
                ErrorConstants.BookingTeam.AssignmentNotFoundDescription.Resolve(lang));
        }

        if (assignment.TourGuideId.HasValue)
        {
            var guide = await tourGuideRepository.GetByIdAsync(assignment.TourGuideId.Value);
            if (guide is not null && !guide.IsDeleted)
            {
                guide.SetAvailability(true, "system");
                tourGuideRepository.Update(guide);
            }
        }

        bookingTourGuideRepository.Delete(assignment);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record ConfirmTeamMemberAssignmentCommand(Guid BookingId, Guid UserId) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Booking];
}

public sealed class ConfirmTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    IUnitOfWork unitOfWork,
    ILanguageContext? languageContext = null)
    : ICommandHandler<ConfirmTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(ConfirmTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var lang = languageContext?.CurrentLanguage ?? "vi";
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound(
                ErrorConstants.BookingTeam.AssignmentNotFoundCode,
                ErrorConstants.BookingTeam.AssignmentNotFoundDescription.Resolve(lang));
        }

        assignment.Update(
            assignment.AssignedRole,
            performedBy: "system",
            assignment.TourGuideId,
            assignment.IsLead,
            AssignmentStatus.Confirmed,
            assignment.Note);

        bookingTourGuideRepository.Update(assignment);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}
