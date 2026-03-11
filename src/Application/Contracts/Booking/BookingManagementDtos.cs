using Domain.Enums;

namespace Application.Contracts.Booking;

public sealed record SupplierDto(
    Guid SupplierId,
    string SupplierCode,
    SupplierType SupplierType,
    string Name,
    string? TaxCode,
    string? Phone,
    string? Email,
    string? Address,
    string? Note,
    bool IsActive
);

public sealed record CreateSupplierDto(
    string SupplierCode,
    SupplierType SupplierType,
    string Name,
    string? TaxCode,
    string? Phone,
    string? Email,
    string? Address,
    string? Note
);

public sealed record UpdateSupplierDto(
    Guid SupplierId,
    string SupplierCode,
    SupplierType SupplierType,
    string Name,
    string? TaxCode,
    string? Phone,
    string? Email,
    string? Address,
    string? Note,
    bool IsActive
);

public sealed record BookingActivityReservationDto(
    Guid BookingActivityReservationId,
    Guid BookingId,
    Guid? SupplierId,
    int Order,
    string ActivityType,
    string Title,
    string? Description,
    DateTimeOffset? StartTime,
    DateTimeOffset? EndTime,
    decimal TotalServicePrice,
    decimal TotalServicePriceAfterTax,
    ReservationStatus Status,
    string? Note
);

public sealed record TransportDetailDto(
    Guid BookingTransportDetailId,
    Guid BookingActivityReservationId,
    Guid? SupplierId,
    TransportType TransportType,
    DateTimeOffset? DepartureAt,
    DateTimeOffset? ArrivalAt,
    string? TicketNumber,
    string? ETicketNumber,
    string? SeatNumber,
    int SeatCapacity,
    string? SeatClass,
    string? VehicleNumber,
    decimal BuyPrice,
    decimal TaxRate,
    decimal TotalBuyPrice,
    bool IsTaxable,
    string? FileUrl,
    string? SpecialRequest,
    ReservationStatus Status,
    string? Note
);

public sealed record CreateTransportDetailDto(
    Guid BookingActivityReservationId,
    Guid? SupplierId,
    TransportType TransportType,
    DateTimeOffset? DepartureAt,
    DateTimeOffset? ArrivalAt,
    string? TicketNumber,
    string? ETicketNumber,
    string? SeatNumber,
    int SeatCapacity,
    string? SeatClass,
    string? VehicleNumber,
    decimal BuyPrice,
    decimal TaxRate,
    bool IsTaxable,
    string? FileUrl,
    string? SpecialRequest,
    string? Note
);

public sealed record AccommodationDetailDto(
    Guid BookingAccommodationDetailId,
    Guid BookingActivityReservationId,
    Guid? SupplierId,
    string AccommodationName,
    RoomType RoomType,
    int RoomCount,
    string? BedType,
    string? Address,
    string? ContactPhone,
    DateTimeOffset? CheckInAt,
    DateTimeOffset? CheckOutAt,
    decimal BuyPrice,
    decimal TaxRate,
    decimal TotalBuyPrice,
    bool IsTaxable,
    string? ConfirmationCode,
    string? FileUrl,
    string? SpecialRequest,
    ReservationStatus Status,
    string? Note
);

public sealed record CreateAccommodationDetailDto(
    Guid BookingActivityReservationId,
    Guid? SupplierId,
    string AccommodationName,
    RoomType RoomType,
    int RoomCount,
    string? BedType,
    string? Address,
    string? ContactPhone,
    DateTimeOffset? CheckInAt,
    DateTimeOffset? CheckOutAt,
    decimal BuyPrice,
    decimal TaxRate,
    bool IsTaxable,
    string? ConfirmationCode,
    string? FileUrl,
    string? SpecialRequest,
    string? Note
);

public sealed record PassportDto(
    Guid PassportId,
    Guid BookingParticipantId,
    string PassportNumber,
    string? Nationality,
    DateTimeOffset? IssuedAt,
    DateTimeOffset? ExpiresAt,
    string? FileUrl
);

public sealed record CreatePassportDto(
    Guid BookingParticipantId,
    string PassportNumber,
    string? Nationality,
    DateTimeOffset? IssuedAt,
    DateTimeOffset? ExpiresAt,
    string? FileUrl
);

public sealed record VisaDto(
    Guid VisaId,
    Guid VisaApplicationId,
    string? VisaNumber,
    string? Country,
    VisaStatus Status,
    VisaEntryType? EntryType,
    DateTimeOffset? IssuedAt,
    DateTimeOffset? ExpiresAt,
    string? FileUrl
);

public sealed record VisaApplicationDto(
    Guid VisaApplicationId,
    Guid BookingParticipantId,
    Guid PassportId,
    string DestinationCountry,
    VisaStatus Status,
    DateTimeOffset? MinReturnDate,
    string? RefusalReason,
    string? VisaFileUrl,
    VisaDto? Visa
);

public sealed record ParticipantDto(
    Guid ParticipantId,
    Guid BookingId,
    string ParticipantType,
    string FullName,
    DateTimeOffset? DateOfBirth,
    GenderType? Gender,
    string? Nationality,
    ReservationStatus Status,
    PassportDto? Passport,
    List<VisaApplicationDto> VisaApplications
);

public sealed record CreateParticipantDto(
    Guid BookingId,
    string ParticipantType,
    string FullName,
    DateTimeOffset? DateOfBirth,
    GenderType? Gender,
    string? Nationality
);

public sealed record SupplierReceiptDto(
    Guid SupplierReceiptId,
    Guid SupplierPayableId,
    decimal Amount,
    DateTimeOffset PaidAt,
    PaymentMethod PaymentMethod,
    string? TransactionRef,
    string? Note
);

public sealed record SupplierPayableDto(
    Guid SupplierPayableId,
    Guid BookingId,
    Guid SupplierId,
    decimal ExpectedAmount,
    decimal PaidAmount,
    DateTimeOffset? DueAt,
    PaymentStatus Status,
    string? Note,
    List<SupplierReceiptDto> Receipts
);

public sealed record CreateBookingRequest(
    Guid TourInstanceId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int NumberAdult,
    int NumberChild,
    int NumberInfant,
    decimal TotalPrice,
    PaymentMethod PaymentMethod,
    bool IsFullPay,
    List<CreateParticipantDto>? Participants
);

public sealed record BookingDetailResponse(
    Guid BookingId,
    Guid TourInstanceId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int NumberAdult,
    int NumberChild,
    int NumberInfant,
    decimal TotalPrice,
    BookingStatus Status,
    List<BookingActivityReservationDto> ActivityReservations,
    List<TransportDetailDto> TransportDetails,
    List<AccommodationDetailDto> AccommodationDetails,
    List<ParticipantDto> Participants,
    List<SupplierPayableDto> SupplierPayables
);
