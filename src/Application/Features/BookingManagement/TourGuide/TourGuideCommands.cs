using Application.Contracts.Booking;
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
    string? Note) : ICommand<ErrorOr<Guid>>;

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

public sealed class CreateTourGuideCommandHandler(ITourGuideRepository tourGuideRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<CreateTourGuideCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourGuideCommand request, CancellationToken cancellationToken)
    {
        var existing = await tourGuideRepository.GetByLicenseNumberAsync(request.LicenseNumber);
        if (existing is not null)
        {
            return Error.Conflict("TourGuide.LicenseExists", "Số giấy phép hướng dẫn viên đã tồn tại.");
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
    string? Note) : ICommand<ErrorOr<Success>>;

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

public sealed class UpdateTourGuideCommandHandler(ITourGuideRepository tourGuideRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateTourGuideCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourGuideCommand request, CancellationToken cancellationToken)
    {
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound("TourGuide.NotFound", "Không tìm thấy hướng dẫn viên.");
        }

        var existing = await tourGuideRepository.GetByLicenseNumberAsync(request.LicenseNumber);
        if (existing is not null && existing.Id != request.TourGuideId)
        {
            return Error.Conflict("TourGuide.LicenseExists", "Số giấy phép hướng dẫn viên đã tồn tại.");
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

public sealed record DeleteTourGuideCommand(Guid TourGuideId) : ICommand<ErrorOr<Success>>;

public sealed class DeleteTourGuideCommandHandler(ITourGuideRepository tourGuideRepository, IUnitOfWork unitOfWork)
    : ICommandHandler<DeleteTourGuideCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteTourGuideCommand request, CancellationToken cancellationToken)
    {
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound("TourGuide.NotFound", "Không tìm thấy hướng dẫn viên.");
        }

        entity.SoftDelete("system");
        tourGuideRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record GetTourGuideByIdQuery(Guid TourGuideId) : IQuery<ErrorOr<TourGuideDto>>;

public sealed class GetTourGuideByIdQueryHandler(ITourGuideRepository tourGuideRepository)
    : IQueryHandler<GetTourGuideByIdQuery, ErrorOr<TourGuideDto>>
{
    public async Task<ErrorOr<TourGuideDto>> Handle(GetTourGuideByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await tourGuideRepository.GetByIdAsync(request.TourGuideId);
        if (entity is null || entity.IsDeleted)
        {
            return Error.NotFound("TourGuide.NotFound", "Không tìm thấy hướng dẫn viên.");
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
    : IQuery<ErrorOr<List<TourGuideDto>>>;

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
    string? Note) : ICommand<ErrorOr<Guid>>;

public sealed class AssignTourGuideToBookingCommandValidator : AbstractValidator<AssignTourGuideToBookingCommand>
{
    public AssignTourGuideToBookingCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.TourGuideId)
            .NotEmpty()
            .When(x => x.AssignedRole == AssignedRole.TourGuide)
            .WithMessage("Cần chọn hướng dẫn viên khi phân vai trò TourGuide.");
    }
}

public sealed class AssignTourGuideToBookingCommandHandler(
    IBookingRepository bookingRepository,
    IUserRepository userRepository,
    ITourGuideRepository tourGuideRepository,
    IBookingTourGuideRepository bookingTourGuideRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<AssignTourGuideToBookingCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(AssignTourGuideToBookingCommand request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound("Booking.NotFound", "Không tìm thấy booking.");
        }

        var user = await userRepository.FindById(request.UserId);
        if (user is null || user.IsDeleted)
        {
            return Error.NotFound("User.NotFound", "Không tìm thấy user được phân công.");
        }

        var existingAssignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (existingAssignment is not null)
        {
            return Error.Conflict("BookingTeam.AssignmentExists", "User đã được phân công trong booking này.");
        }

        TourGuideEntity? tourGuide = null;
        if (request.AssignedRole == AssignedRole.TourGuide)
        {
            if (!request.TourGuideId.HasValue)
            {
                return Error.Validation("BookingTeam.TourGuideRequired", "Thiếu TourGuideId cho vai trò TourGuide.");
            }

            tourGuide = await tourGuideRepository.GetByIdAsync(request.TourGuideId.Value);
            if (tourGuide is null || tourGuide.IsDeleted || !tourGuide.IsActive)
            {
                return Error.NotFound("TourGuide.NotFound", "Không tìm thấy hướng dẫn viên.");
            }

            if (!tourGuide.IsAvailable)
            {
                return Error.Conflict("TourGuide.Unavailable", "Hướng dẫn viên hiện không khả dụng.");
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
    string? Note) : ICommand<ErrorOr<Success>>;

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
    IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateTourGuideAssignmentStatusCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourGuideAssignmentStatusCommand request, CancellationToken cancellationToken)
    {
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound("BookingTeam.AssignmentNotFound", "Không tìm thấy phân công trong booking.");
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

public sealed record GetBookingTeamQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>;

public sealed class GetBookingTeamQueryHandler(IBookingTourGuideRepository bookingTourGuideRepository)
    : IQueryHandler<GetBookingTeamQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingTeamQuery request, CancellationToken cancellationToken)
    {
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

public sealed record GetBookingTourManagerQuery(Guid BookingId) : IQuery<ErrorOr<BookingTeamMemberDto>>;

public sealed class GetBookingTourManagerQueryHandler(IBookingTourGuideRepository bookingTourGuideRepository)
    : IQueryHandler<GetBookingTourManagerQuery, ErrorOr<BookingTeamMemberDto>>
{
    public async Task<ErrorOr<BookingTeamMemberDto>> Handle(GetBookingTourManagerQuery request, CancellationToken cancellationToken)
    {
        var assignments = await bookingTourGuideRepository.GetByBookingIdAsync(request.BookingId);
        var manager = assignments.FirstOrDefault(x => x.AssignedRole == AssignedRole.TourManager);
        if (manager is null)
        {
            return Error.NotFound("BookingTeam.TourManagerNotFound", "Không tìm thấy TourManager cho booking.");
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

public sealed record GetBookingTourOperatorsQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>;

public sealed class GetBookingTourOperatorsQueryHandler(IBookingTourGuideRepository bookingTourGuideRepository)
    : IQueryHandler<GetBookingTourOperatorsQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingTourOperatorsQuery request, CancellationToken cancellationToken)
    {
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

public sealed record GetBookingAssignedTourGuidesQuery(Guid BookingId) : IQuery<ErrorOr<List<BookingTeamMemberDto>>>;

public sealed class GetBookingAssignedTourGuidesQueryHandler(IBookingTourGuideRepository bookingTourGuideRepository)
    : IQueryHandler<GetBookingAssignedTourGuidesQuery, ErrorOr<List<BookingTeamMemberDto>>>
{
    public async Task<ErrorOr<List<BookingTeamMemberDto>>> Handle(GetBookingAssignedTourGuidesQuery request, CancellationToken cancellationToken)
    {
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
    string? Note) : ICommand<ErrorOr<Success>>;

public sealed class UpdateTeamMemberAssignmentCommandValidator : AbstractValidator<UpdateTeamMemberAssignmentCommand>
{
    public UpdateTeamMemberAssignmentCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.TourGuideId)
            .NotEmpty()
            .When(x => x.AssignedRole == AssignedRole.TourGuide)
            .WithMessage("Cần chọn hướng dẫn viên khi phân vai trò TourGuide.");
    }
}

public sealed class UpdateTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound("BookingTeam.AssignmentNotFound", "Không tìm thấy phân công trong booking.");
        }

        var previousTourGuideId = assignment.TourGuideId;
        Guid? nextTourGuideId = request.AssignedRole == AssignedRole.TourGuide ? request.TourGuideId : null;

        if (nextTourGuideId.HasValue && previousTourGuideId != nextTourGuideId)
        {
            var nextTourGuide = await tourGuideRepository.GetByIdAsync(nextTourGuideId.Value);
            if (nextTourGuide is null || nextTourGuide.IsDeleted || !nextTourGuide.IsActive)
            {
                return Error.NotFound("TourGuide.NotFound", "Không tìm thấy hướng dẫn viên.");
            }

            if (!nextTourGuide.IsAvailable)
            {
                return Error.Conflict("TourGuide.Unavailable", "Hướng dẫn viên hiện không khả dụng.");
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

public sealed record DeleteTeamMemberAssignmentCommand(Guid BookingId, Guid UserId) : ICommand<ErrorOr<Success>>;

public sealed class DeleteTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    ITourGuideRepository tourGuideRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<DeleteTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound("BookingTeam.AssignmentNotFound", "Không tìm thấy phân công trong booking.");
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

public sealed record ConfirmTeamMemberAssignmentCommand(Guid BookingId, Guid UserId) : ICommand<ErrorOr<Success>>;

public sealed class ConfirmTeamMemberAssignmentCommandHandler(
    IBookingTourGuideRepository bookingTourGuideRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<ConfirmTeamMemberAssignmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(ConfirmTeamMemberAssignmentCommand request, CancellationToken cancellationToken)
    {
        var assignment = await bookingTourGuideRepository.GetByBookingIdAndUserIdAsync(request.BookingId, request.UserId);
        if (assignment is null)
        {
            return Error.NotFound("BookingTeam.AssignmentNotFound", "Không tìm thấy phân công trong booking.");
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
