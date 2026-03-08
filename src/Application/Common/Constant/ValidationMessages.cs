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
    public const string NewPasswordRequired = "New password is required.";
    public const string OldPasswordRequired = "Old password is required.";
    public const string PasswordComplexity =
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    public const string NewPasswordMustDiffer = "New password must not be the same as the old password.";

    // ── User / Identity ─────────────────────────────────────────────────
    public const string FullNameRequired = "Name is required.";
    public const string FullNameAndLastNameRequired = "Full name is required.";
    public const string FullNameTooLong = "Full name is too long.";
    public const string UsernameRequired = "Username is required.";
    public const string UserIdRequired = "User ID is required.";
    public const string AvatarTooLong = "Avatar URL is too long.";

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
}
