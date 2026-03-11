namespace Infrastructure.Data.Seed;

internal static class SeedFileManifest
{
    public static IReadOnlyList<SeedFileDefinition> Definitions { get; } =
    [
        new("BookingContextSeed", "booking.json", ["Id", "TourInstanceId", "CustomerName", "CustomerPhone", "NumberAdult", "TotalPrice"]),
        new("CustomerDepositContextSeed", "customer-deposit.json", ["Id", "BookingId", "ExpectedAmount", "Status"]),
        new("CustomerPaymentContextSeed", "customer-payment.json", ["Id", "BookingId", "Amount", "PaymentMethod", "PaidAt"]),
        new("DepartmentContextSeed", "department.json", ["Id", "Name", "Level"]),
        new("DynamicPricingTierContextSeed", "dynamic-pricing-tier.json", ["Id", "MinParticipants", "MaxParticipants", "PricePerPerson"]),
        new("FileMetadataContextSeed", "file-metadata.json", ["Id", "OriginalFileName", "StoredFileName", "Url"]),
        new("FunctionContextSeed", "function.json", ["Id", "ApiUrl", "CategoryId"]),
        new("OtpContextSeed", "otp.json", ["Id", "Code", "Email"]),
        new("PositionContextSeed", "position.json", ["Id", "Name", "Level"]),
        new("RefreshTokenContextSeed", "refresh-token.json", ["Id", "UserId", "Token"]),
        new("RegisterContextSeed", "register.json", ["Id", "Username", "Email", "Password"]),
        new("ReviewContextSeed", "review.json", ["Id", "TourId", "UserId", "Rating"]),
        new("RoleContextSeed", "role.json", ["Id", "Name", "Type", "Status"]),
        new("RoleFunctionContextSeed", "role-function.json", ["RoleId", "FunctionId"]),
        new("TourClassificationContextSeed", "tour-classification.json", ["Id", "TourId", "Name", "AdultPrice", "ChildPrice", "InfantPrice"]),
        new("TourContextSeed", "tour.json", ["Id", "TourCode", "TourName", "Status"]),
        new("TourDayActivityContextSeed", "tour-day-activity.json", ["Id", "TourDayId", "ActivityType", "Title"]),
        new("TourDayContextSeed", "tour-day.json", ["Id", "TourId", "DayNumber", "Title"]),
        new("TourInstanceContextSeed", "tour-instance.json", ["Id", "TourId", "ClassificationId", "TourInstanceCode", "Title", "StartDate", "EndDate"]),
        new("TourInsuranceContextSeed", "tour-insurance.json", ["Id", "TourClassificationId", "InsuranceName", "InsuranceType", "CoverageAmount", "CoverageFee"]),
        new("TourPlanAccommodationContextSeed", "tour-plan-accommodation.json", ["Id", "AccommodationName", "RoomType", "RoomCapacity"]),
        new("TourPlanLocationContextSeed", "tour-plan-location.json", ["Id", "LocationName", "LocationType"]),
        new("TourPlanRouteContextSeed", "tour-plan-route.json", ["Id", "Order", "TransportationType"]),
        new("TourRequestContextSeed", "tour-request.json", ["Id", "CustomerName", "CustomerPhone", "Destination", "DepartureDate", "NumberAdult"]),
        new("UserContextSeed", "user.json", ["Id", "Username", "Email", "Status", "VerifyStatus"]),
        new("UserRoleContextSeed", "user-role.json", ["UserId", "RoleId"])
    ];
}

internal sealed record SeedFileDefinition(
    string ContextSeedClass,
    string FileName,
    IReadOnlyList<string> RequiredFields);
