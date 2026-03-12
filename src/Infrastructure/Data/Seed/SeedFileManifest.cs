namespace Infrastructure.Data.Seed;

internal static class SeedFileManifest
{
    private static readonly IReadOnlyList<string> TourBilingualFields =
    [
        "Translations.vi.TourName",
        "Translations.vi.ShortDescription",
        "Translations.vi.LongDescription",
        "Translations.vi.SEOTitle",
        "Translations.vi.SEODescription",
        "Translations.en.TourName",
        "Translations.en.ShortDescription",
        "Translations.en.LongDescription",
        "Translations.en.SEOTitle",
        "Translations.en.SEODescription"
    ];

    private static readonly IReadOnlyList<string> TourClassificationBilingualFields =
    [
        "Translations.vi.Name",
        "Translations.vi.Description",
        "Translations.en.Name",
        "Translations.en.Description"
    ];

    private static readonly IReadOnlyList<string> TourInstanceBilingualFields =
    [
        "Translations.vi.Title",
        "Translations.vi.TourName",
        "Translations.vi.Location",
        "Translations.vi.ClassificationName",
        "Translations.en.Title",
        "Translations.en.TourName",
        "Translations.en.Location",
        "Translations.en.ClassificationName"
    ];

    private static readonly IReadOnlyList<string> TourDayBilingualFields =
    [
        "Translations.vi.Title",
        "Translations.vi.Description",
        "Translations.en.Title",
        "Translations.en.Description"
    ];

    private static readonly IReadOnlyList<string> TourDayActivityBilingualFields =
    [
        "Translations.vi.Title",
        "Translations.vi.Description",
        "Translations.en.Title",
        "Translations.en.Description"
    ];

    private static readonly IReadOnlyList<string> TourPlanLocationBilingualFields =
    [
        "Translations.vi.LocationName",
        "Translations.vi.LocationDescription",
        "Translations.en.LocationName",
        "Translations.en.LocationDescription"
    ];

    public static IReadOnlyList<SeedFileDefinition> Definitions { get; } =
    [
        new("BookingAccommodationDetailContextSeed", "booking-accommodation-detail.json", ["Id", "BookingActivityReservationId", "AccommodationName", "RoomType"]),
        new("BookingActivityReservationContextSeed", "booking-activity-reservation.json", ["Id", "BookingId", "Order", "ActivityType", "Title"]),
        new("BookingContextSeed", "booking.json", ["Id", "TourInstanceId", "CustomerName", "CustomerPhone", "NumberAdult", "TotalPrice"]),
        new("BookingParticipantContextSeed", "booking-participant.json", ["Id", "BookingId", "ParticipantType", "FullName"]),
        new("BookingTourGuideContextSeed", "booking-tour-guide.json", ["Id", "BookingId", "UserId", "AssignedRole"]),
        new("BookingTransportDetailContextSeed", "booking-transport-detail.json", ["Id", "BookingActivityReservationId", "TransportType"]),
        new("CustomerDepositContextSeed", "customer-deposit.json", ["Id", "BookingId", "ExpectedAmount", "Status"]),
        new("CustomerPaymentContextSeed", "customer-payment.json", ["Id", "BookingId", "Amount", "PaymentMethod", "PaidAt"]),
        new("DepartmentContextSeed", "department.json", ["Id", "Name", "Level"]),
        new("DynamicPricingTierContextSeed", "dynamic-pricing-tier.json", ["Id", "MinParticipants", "MaxParticipants", "PricePerPerson"]),
        new("FileMetadataContextSeed", "file-metadata.json", ["Id", "OriginalFileName", "StoredFileName", "Url"]),
        new("FunctionContextSeed", "function.json", ["Id", "ApiUrl", "CategoryId"]),
        new("OtpContextSeed", "otp.json", ["Id", "Code", "Email"]),
        new("PassportContextSeed", "passport.json", ["Id", "BookingParticipantId", "PassportNumber"]),
        new("PositionContextSeed", "position.json", ["Id", "Name", "Level"]),
        new("RefreshTokenContextSeed", "refresh-token.json", ["Id", "UserId", "Token"]),
        new("RegisterContextSeed", "register.json", ["Id", "Username", "Email", "Password"]),
        new("ReviewContextSeed", "review.json", ["Id", "TourId", "UserId", "Rating"]),
        new("RoleContextSeed", "role.json", ["Id", "Name", "Type", "Status"]),
        new("RoleFunctionContextSeed", "role-function.json", ["RoleId", "FunctionId"]),
        new("SupplierContextSeed", "supplier.json", ["Id", "SupplierCode", "SupplierType", "Name"]),
        new("SupplierPayableContextSeed", "supplier-payable.json", ["Id", "BookingId", "SupplierId", "ExpectedAmount", "Status"]),
        new("SupplierReceiptContextSeed", "supplier-receipt.json", ["Id", "SupplierPayableId", "Amount", "PaymentMethod", "PaidAt"]),
        new("TourClassificationContextSeed", "tour-classification.json", ["Id", "TourId", "Name", "AdultPrice", "ChildPrice", "InfantPrice"], TourClassificationBilingualFields),
        new("TourContextSeed", "tour.json", ["Id", "TourCode", "TourName", "Status"], TourBilingualFields),
        new("TourDayActivityContextSeed", "tour-day-activity.json", ["Id", "TourDayId", "ActivityType", "Title"], TourDayActivityBilingualFields),
        new("TourDayActivityGuideContextSeed", "tour-day-activity-guide.json", ["Id", "TourDayActivityStatusId", "TourGuideId", "Role"]),
        new("TourDayActivityStatusContextSeed", "tour-day-activity-status.json", ["Id", "BookingId", "TourDayId", "ActivityStatus"]),
        new("TourDayContextSeed", "tour-day.json", ["Id", "TourId", "DayNumber", "Title"], TourDayBilingualFields),
        new("TourGuideContextSeed", "tour-guide.json", ["Id", "FullName", "LicenseNumber"]),
        new("TourInstanceContextSeed", "tour-instance.json", ["Id", "TourId", "ClassificationId", "TourInstanceCode", "Title", "StartDate", "EndDate"], TourInstanceBilingualFields),
        new("TourInsuranceContextSeed", "tour-insurance.json", ["Id", "TourClassificationId", "InsuranceName", "InsuranceType", "CoverageAmount", "CoverageFee"]),
        new("TourPlanAccommodationContextSeed", "tour-plan-accommodation.json", ["Id", "AccommodationName", "RoomType", "RoomCapacity"]),
        new("TourPlanLocationContextSeed", "tour-plan-location.json", ["Id", "LocationName", "LocationType"], TourPlanLocationBilingualFields),
        new("TourPlanRouteContextSeed", "tour-plan-route.json", ["Id", "Order", "TransportationType"]),
        new("TourRequestContextSeed", "tour-request.json", ["Id", "CustomerName", "CustomerPhone", "Destination", "DepartureDate", "NumberAdult"]),
        new("UserContextSeed", "user.json", ["Id", "Username", "Email", "Status", "VerifyStatus"]),
        new("UserRoleContextSeed", "user-role.json", ["UserId", "RoleId"]),
        new("VisaApplicationContextSeed", "visa-application.json", ["Id", "BookingParticipantId", "PassportId", "DestinationCountry", "Status"]),
        new("VisaContextSeed", "visa.json", ["Id", "VisaApplicationId", "Status"])
    ];
}

internal sealed record SeedFileDefinition(
    string ContextSeedClass,
    string FileName,
    IReadOnlyList<string> RequiredFields,
    IReadOnlyList<string>? RequiredBilingualFields = null)
{
    public IReadOnlyList<string> EffectiveRequiredFieldPaths => RequiredBilingualFields is { Count: > 0 }
        ? [.. RequiredFields, .. RequiredBilingualFields]
        : RequiredFields;
}
