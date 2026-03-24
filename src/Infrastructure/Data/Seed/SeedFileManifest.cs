namespace Infrastructure.Data.Seed;

internal static class SeedFileManifest
{
    public static IReadOnlyList<SeedFileDefinition> Definitions { get; } =
    [
        new("BookingAccommodationDetailContextSeed", "booking-accommodation-detail.json", ["Id", "BookingActivityReservationId", "AccommodationName", "RoomType"], null, ["BookingActivityReservationId"]),
        new("BookingActivityReservationContextSeed", "booking-activity-reservation.json", ["Id", "BookingId", "Order", "ActivityType", "Title"], "Id", ["BookingId"]),
        new("CancellationPolicyContextSeed", "cancellation-policy.json", ["Id", "PolicyCode", "TourScope", "Status"], "Id", null),
        new("BookingContextSeed", "booking.json", ["Id", "TourInstanceId", "CustomerName", "CustomerPhone", "NumberAdult", "TotalPrice"], "Id", ["TourInstanceId"]),
        new("BookingParticipantContextSeed", "booking-participant.json", ["Id", "BookingId", "ParticipantType", "FullName"], "Id", ["BookingId"]),
        new("BookingTourGuideContextSeed", "booking-tour-guide.json", ["Id", "BookingId", "UserId", "AssignedRole"], "Id", ["BookingId", "UserId"]),
        new("BookingTransportDetailContextSeed", "booking-transport-detail.json", ["Id", "BookingActivityReservationId", "TransportType"], "Id", ["BookingActivityReservationId"]),
        new("CustomerDepositContextSeed", "customer-deposit.json", ["Id", "BookingId", "ExpectedAmount", "Status"], "Id", ["BookingId"]),
        new("CustomerPaymentContextSeed", "customer-payment.json", ["Id", "BookingId", "Amount", "PaymentMethod", "PaidAt"], "Id", ["BookingId"]),
        new("DepartmentContextSeed", "department.json", ["Id", "Name", "Level"], "Id", null),
        new("DynamicPricingTierContextSeed", "dynamic-pricing-tier.json", ["Id", "MinParticipants", "MaxParticipants", "PricePerPerson"], "Id", null),
        new("FileMetadataContextSeed", "file-metadata.json", ["Id", "OriginalFileName", "StoredFileName", "Url"], "Id", null),
        new("OtpContextSeed", "otp.json", ["Id", "Code", "Email"], "Id", null),
        new("PassportContextSeed", "passport.json", ["Id", "BookingParticipantId", "PassportNumber"], "Id", ["BookingParticipantId"]),
        new("PositionContextSeed", "position.json", ["Id", "Name", "Level"], "Id", null),
        new("RefreshTokenContextSeed", "refresh-token.json", ["Id", "UserId", "Token"], "Id", ["UserId"]),
        new("RegisterContextSeed", "register.json", ["Id", "Username", "Email", "Password"], "Id", null),
        new("ReviewContextSeed", "review.json", ["Id", "TourId", "UserId", "Rating"], "Id", ["TourId", "UserId"]),
        new("RoleContextSeed", "role.json", ["Id", "Name", "Type", "Status"], "Id", null),
        new("SupplierContextSeed", "supplier.json", ["Id", "SupplierCode", "SupplierType", "Name"], "Id", null),
        new("SupplierPayableContextSeed", "supplier-payable.json", ["Id", "BookingId", "SupplierId", "ExpectedAmount", "Status"], "Id", ["BookingId", "SupplierId"]),
        new("SupplierReceiptContextSeed", "supplier-receipt.json", ["Id", "SupplierPayableId", "Amount", "PaymentMethod", "PaidAt"], "Id", ["SupplierPayableId"]),
        new("TourClassificationContextSeed", "tour-classification.json", ["Id", "TourId", "Name", "BasePrice"], "Id", ["TourId"]),
        new("TourContextSeed", "tour.json", ["Id", "TourCode", "TourName", "Status"], "Id", null),
        new("TourDayActivityContextSeed", "tour-day-activity.json", ["Id", "TourDayId", "ActivityType", "Title"], "Id", ["TourDayId"]),
        new("TourDayActivityGuideContextSeed", "tour-day-activity-guide.json", ["Id", "TourDayActivityStatusId", "TourGuideId", "Role"], "Id", ["TourDayActivityStatusId", "TourGuideId"]),
        new("TourDayActivityStatusContextSeed", "tour-day-activity-status.json", ["Id", "BookingId", "TourDayId", "ActivityStatus"], "Id", ["BookingId", "TourDayId"]),
        new("TourDayContextSeed", "tour-day.json", ["Id", "TourId", "DayNumber", "Title"], "Id", ["TourId"]),
        new("TourGuideContextSeed", "tour-guide.json", ["Id", "FullName", "LicenseNumber"], "Id", null),
        new("TourInstanceContextSeed", "tour-instance.json", ["Id", "TourId", "ClassificationId", "TourInstanceCode", "Title", "StartDate", "EndDate"], "Id", ["TourId", "ClassificationId"]),
        new("TourInsuranceContextSeed", "tour-insurance.json", ["Id", "TourClassificationId", "InsuranceName", "InsuranceType", "CoverageAmount", "CoverageFee"], "Id", ["TourClassificationId"]),
        new("TourPlanAccommodationContextSeed", "tour-plan-accommodation.json", ["Id", "AccommodationName", "RoomType", "RoomCapacity"], "Id", null),
        new("TourPlanLocationContextSeed", "tour-plan-location.json", ["Id", "LocationName", "LocationType"], "Id", null),
        new("TourPlanRouteContextSeed", "tour-plan-route.json", ["Id", "Order", "TransportationType"], "Id", null),
        new("TourRequestContextSeed", "tour-request.json", ["Id", "CustomerName", "CustomerPhone", "Destination", "DepartureDate", "NumberAdult"], "Id", null),
        new("UserContextSeed", "user.json", ["Id", "Username", "Email", "Status", "VerifyStatus"], "Id", null),
        new("UserRoleContextSeed", "user-role.json", ["UserId", "RoleId"], null, ["UserId", "RoleId"]),
        new("VisaApplicationContextSeed", "visa-application.json", ["Id", "BookingParticipantId", "PassportId", "DestinationCountry", "Status"], "Id", ["BookingParticipantId", "PassportId"]),
        new("VisaContextSeed", "visa.json", ["Id", "VisaApplicationId", "Status"], "Id", ["VisaApplicationId"])
    ];
}

internal sealed record SeedFileDefinition(
    string ContextSeedClass,
    string FileName,
    IReadOnlyList<string> RequiredFields,
    string? IdField = null,
    IReadOnlyList<string>? ReferenceFields = null);
