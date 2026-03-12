namespace Domain.Entities;

public class TourGuideEntity : Aggregate<Guid>
{
    public TourGuideEntity()
    {
        Id = Guid.CreateVersion7();
        IsAvailable = true;
        IsActive = true;
    }

    public string FullName { get; set; } = null!;
    public string? NickName { get; set; }
    public GenderType? Gender { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string LicenseNumber { get; set; } = null!;
    public DateTimeOffset? LicenseExpiryDate { get; set; }
    public string? Languages { get; set; }
    public string? Specializations { get; set; }
    public string? ProfileImageUrl { get; set; }
    public int YearsOfExperience { get; set; }
    public decimal? Rating { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public string? Note { get; set; }

    public virtual List<BookingTourGuideEntity> BookingTourGuides { get; set; } = [];
    public virtual List<TourDayActivityGuideEntity> ActivityGuides { get; set; } = [];

    public static TourGuideEntity Create(
        string fullName,
        string licenseNumber,
        string performedBy,
        string? nickName = null,
        GenderType? gender = null,
        DateTimeOffset? dateOfBirth = null,
        string? phoneNumber = null,
        string? email = null,
        string? address = null,
        DateTimeOffset? licenseExpiryDate = null,
        string? languages = null,
        string? specializations = null,
        string? profileImageUrl = null,
        int yearsOfExperience = 0,
        decimal? rating = null,
        bool isAvailable = true,
        bool isActive = true,
        string? note = null)
    {
        EnsureNonNegative(yearsOfExperience, nameof(yearsOfExperience));
        EnsureValidRating(rating);

        return new TourGuideEntity
        {
            FullName = fullName,
            NickName = nickName,
            Gender = gender,
            DateOfBirth = dateOfBirth,
            PhoneNumber = phoneNumber,
            Email = email,
            Address = address,
            LicenseNumber = licenseNumber,
            LicenseExpiryDate = licenseExpiryDate,
            Languages = languages,
            Specializations = specializations,
            ProfileImageUrl = profileImageUrl,
            YearsOfExperience = yearsOfExperience,
            Rating = rating,
            IsAvailable = isAvailable,
            IsActive = isActive,
            IsDeleted = false,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        string fullName,
        string licenseNumber,
        string performedBy,
        string? nickName = null,
        GenderType? gender = null,
        DateTimeOffset? dateOfBirth = null,
        string? phoneNumber = null,
        string? email = null,
        string? address = null,
        DateTimeOffset? licenseExpiryDate = null,
        string? languages = null,
        string? specializations = null,
        string? profileImageUrl = null,
        int yearsOfExperience = 0,
        decimal? rating = null,
        bool? isAvailable = null,
        bool? isActive = null,
        string? note = null)
    {
        EnsureNonNegative(yearsOfExperience, nameof(yearsOfExperience));
        EnsureValidRating(rating);

        FullName = fullName;
        NickName = nickName;
        Gender = gender;
        DateOfBirth = dateOfBirth;
        PhoneNumber = phoneNumber;
        Email = email;
        Address = address;
        LicenseNumber = licenseNumber;
        LicenseExpiryDate = licenseExpiryDate;
        Languages = languages;
        Specializations = specializations;
        ProfileImageUrl = profileImageUrl;
        YearsOfExperience = yearsOfExperience;
        Rating = rating;
        IsAvailable = isAvailable ?? IsAvailable;
        IsActive = isActive ?? IsActive;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        IsActive = false;
        IsAvailable = false;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SetAvailability(bool isAvailable, string performedBy)
    {
        IsAvailable = isAvailable;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    private static void EnsureNonNegative(int value, string paramName)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(paramName, "Giá trị không được âm.");
        }
    }

    private static void EnsureValidRating(decimal? rating)
    {
        if (rating.HasValue && (rating.Value < 0 || rating.Value > 5))
        {
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating phải nằm trong khoảng từ 0 đến 5.");
        }
    }
}
