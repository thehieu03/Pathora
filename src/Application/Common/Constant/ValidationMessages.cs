namespace Application.Common.Constant;

/// <summary>
/// Centralized validation messages used across FluentValidation validators.
/// </summary>
public static class ValidationMessages
{
    // ── Common ──────────────────────────────────────────────────────────
    public const string DescriptionMaxLength250 = "Description must not exceed 250 characters.";

    // ── Email ───────────────────────────────────────────────────────────
    public const string EmailRequired = "Email is required.";
    public const string EmailInvalid = "Invalid email address.";

    // ── Password ────────────────────────────────────────────────────────
    public const string PasswordRequired = "Password is required.";
    public const string PasswordMinLength6 = "Password must be at least 6 characters.";
    public const string PasswordInvalidFormat = "Invalid password format.";
    public const string PasswordSqlInjectionDetected = "Password contains invalid SQL pattern.";
    public const string NewPasswordRequired = "New password is required.";
    public const string OldPasswordRequired = "Old password is required.";
    public const string PasswordComplexity =
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    public const string NewPasswordMustDiffer = "New password must not be the same as the old password.";

    // ── User / Identity ─────────────────────────────────────────────────
    public const string PhoneNumberInvalid = "Invalid phone number format.";
    public const string AddressTooLong = "Address must not exceed 500 characters.";
    public const string FullNameRequired = "Name is required.";
    public const string FullNameAndLastNameRequired = "Full name is required.";
    public const string FullNameTooLong = "Full name is too long.";
    public const string UsernameRequired = "Username is required.";
    public const string UserIdRequired = "User ID is required.";
    public const string AvatarTooLong = "Avatar URL is too long.";
    public const string ProviderKeyRequired = "ProviderKey is required.";
    public const string ProviderEmailRequired = "Email is required.";
    public const string ProviderEmailInvalid = "Invalid email address.";

    // ── Role ────────────────────────────────────────────────────────────
    public const string RoleNameRequired = "Role name is required.";
    public const string RoleNameMaxLength100 = "Role name must not exceed 100 characters.";
    public const string RoleStatusInvalid = "Invalid role status.";

    // ── Department ──────────────────────────────────────────────────────
    public const string DepartmentNameRequired = "Department name is required.";
    public const string DepartmentNameMaxLength100 = "Department name must not exceed 100 characters.";

    // ── Position ────────────────────────────────────────────────────────
    public const string PositionNameRequired = "Position name is required.";
    public const string PositionNameMaxLength255 = "Position name must not exceed 255 characters.";
    public const string NoteMaxLength255 = "Note must not exceed 255 characters.";

    // ── Tour ────────────────────────────────────────────────────────────
    public const string TourCodeRequired = "Tour code is required.";
    public const string TourNameRequired = "Tour name is required.";
    public const string TourNameMaxLength500 = "Tour name must not exceed 500 characters.";
    public const string ShortDescriptionRequired = "Short description is required.";
    public const string ShortDescriptionMaxLength250 = "Short description must not exceed 250 characters.";
    public const string LongDescriptionRequired = "Long description is required.";
    public const string LongDescriptionMaxLength5000 = "Long description must not exceed 5000 characters.";
    public const string SEOTitleMaxLength70 = "SEO title must not exceed 70 characters.";
    public const string SEODescriptionMaxLength320 = "SEO description must not exceed 320 characters.";
    public const string TourStatusInvalid = "Invalid tour status.";
    public const string ThumbnailRequired = "Thumbnail image is required.";
    public const string ImagesRequired = "Tour images are required.";
    public const string ImagesAtLeastOne = "Tour must have at least one image.";

    // ── TourInstance ────────────────────────────────────────────────────
    public const string TourInstanceTourIdRequired = "Tour ID is required.";
    public const string TourInstanceClassificationIdRequired = "Classification ID is required.";
    public const string TourInstanceStartDateRequired = "Start date is required.";
    public const string TourInstanceEndDateRequired = "End date is required.";
    public const string TourInstanceEndDateAfterStart = "End date must be after start date.";
    public const string TourInstanceMaxParticipantsGreaterThanZero = "Max participants must be greater than 0.";
    public const string TourInstanceMinParticipantsNonNegative = "Min participants must not be negative.";
    public const string TourInstanceStatusRequired = "Status is required.";
    public const string TourInstanceIdRequired = "Tour instance ID is required.";
    public const string TourInstanceTitleRequired = "Title is required.";
    public const string TourInstanceBasePriceNonNegative = "Base price must not be negative.";
    public const string TourInstanceSellingPriceNonNegative = "Selling price must not be negative.";
    public const string TourInstanceOperatingCostNonNegative = "Operating cost must not be negative.";
    public const string TourInstanceDepositPerPersonNonNegative = "Deposit per person must not be negative.";
    public const string DynamicPricingMinParticipantsGreaterThanZero = "Min participants must be greater than 0.";
    public const string DynamicPricingMaxParticipantsGreaterThanOrEqualMin = "Max participants must be greater than or equal to min participants.";
    public const string DynamicPricingPricePerPersonNonNegative = "Price per person must not be negative.";
    public const string DynamicPricingRangeMustNotOverlap = "Dynamic pricing ranges must not overlap.";

    // ── Public Search ──────────────────────────────────────────
    public const string SearchToursPageMinimum1 = "Page must be greater than or equal to 1.";
    public const string SearchToursPageSizeRange = "Page size must be between 1 and 50.";
    public const string SearchToursPeopleRange = "People must be between 1 and 50.";
    public const string SearchToursMinPriceMinimum0 = "Min price must be greater than or equal to 0.";
    public const string SearchToursMaxPriceMinimum0 = "Max price must be greater than or equal to 0.";
    public const string SearchToursMaxPriceGreaterThanOrEqualMinPrice = "Max price must be greater than or equal to min price.";
    public const string SearchToursMinDaysMinimum1 = "Min days must be greater than or equal to 1.";
    public const string SearchToursMaxDaysMinimum1 = "Max days must be greater than or equal to 1.";
    public const string SearchToursMaxDaysGreaterThanOrEqualMinDays = "Max days must be greater than or equal to min days.";

    // ── Public Query ───────────────────────────────────────────
    public const string PublicQueryLimitRange1To50 = "Limit must be between 1 and 50.";

    // ── Booking Management ─────────────────────────────────────
    public const string TourGuideRequiredForRole = "Tour guide is required when assigning TourGuide role.";
    public const string SupplierPayablePaidAmountMustNotExceedExpected = "Paid amount must not exceed expected amount.";

    // ── TourRequest ─────────────────────────────────────────────
    public const string TourRequestIdRequired = "Tour request ID is required.";
    public const string TourRequestDestinationRequired = "Destination is required.";
    public const string TourRequestDestinationMaxLength500 = "Destination must not exceed 500 characters.";
    public const string TourRequestStartDateRequired = "Start date is required.";
    public const string TourRequestEndDateRequired = "End date is required.";
    public const string TourRequestEndDateAfterOrEqualStartDate = "End date must be greater than or equal to start date.";
    public const string TourRequestParticipantsGreaterThanZero = "Number of participants must be greater than 0.";
    public const string TourRequestBudgetGreaterThanZero = "Budget per person must be greater than 0.";
    public const string TourRequestTravelInterestsRequired = "At least one travel interest is required.";
    public const string TourRequestTravelInterestInvalid = "Travel interest is invalid.";
    public const string TourRequestPreferredAccommodationMaxLength500 = "Preferred accommodation must not exceed 500 characters.";
    public const string TourRequestTransportationPreferenceMaxLength500 = "Transportation preference must not exceed 500 characters.";
    public const string TourRequestSpecialRequestsMaxLength2000 = "Special requests must not exceed 2000 characters.";
    public const string TourRequestReviewStatusRequired = "Review status is required.";
    public const string TourRequestReviewStatusInvalid = "Review status must be Approved or Rejected.";
    public const string TourRequestAdminNoteMaxLength2000 = "Admin note must not exceed 2000 characters.";
}
