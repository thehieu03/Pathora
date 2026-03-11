namespace Domain.Entities;

public class BookingAccommodationDetailEntity : Aggregate<Guid>
{
    public Guid BookingActivityReservationId { get; set; }
    public virtual BookingActivityReservationEntity BookingActivityReservation { get; set; } = null!;
    public Guid? SupplierId { get; set; }
    public virtual SupplierEntity? Supplier { get; set; }

    public string AccommodationName { get; set; } = null!;
    public RoomType RoomType { get; set; }
    public string? BedType { get; set; }
    public string? Address { get; set; }
    public string? ContactPhone { get; set; }
    public DateTimeOffset? CheckInAt { get; set; }
    public DateTimeOffset? CheckOutAt { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TotalBuyPrice { get; set; }
    public bool IsTaxable { get; set; }
    public string? ConfirmationCode { get; set; }
    public string? FileUrl { get; set; }
    public string? SpecialRequest { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
    public string? Note { get; set; }

    public static BookingAccommodationDetailEntity Create(
        Guid bookingActivityReservationId,
        string accommodationName,
        RoomType roomType,
        string performedBy,
        Guid? supplierId = null,
        string? bedType = null,
        string? address = null,
        string? contactPhone = null,
        DateTimeOffset? checkInAt = null,
        DateTimeOffset? checkOutAt = null,
        decimal buyPrice = 0,
        decimal taxRate = 0,
        bool isTaxable = true,
        string? confirmationCode = null,
        string? fileUrl = null,
        string? specialRequest = null,
        string? note = null)
    {
        EnsureValidTimeRange(checkInAt, checkOutAt);
        EnsureNonNegative(buyPrice, nameof(buyPrice));
        EnsureNonNegative(taxRate, nameof(taxRate));

        var totalBuyPrice = isTaxable ? buyPrice + (buyPrice * taxRate / 100) : buyPrice;

        return new BookingAccommodationDetailEntity
        {
            Id = Guid.CreateVersion7(),
            BookingActivityReservationId = bookingActivityReservationId,
            SupplierId = supplierId,
            AccommodationName = accommodationName,
            RoomType = roomType,
            BedType = bedType,
            Address = address,
            ContactPhone = contactPhone,
            CheckInAt = checkInAt,
            CheckOutAt = checkOutAt,
            BuyPrice = buyPrice,
            TaxRate = taxRate,
            TotalBuyPrice = totalBuyPrice,
            IsTaxable = isTaxable,
            ConfirmationCode = confirmationCode,
            FileUrl = fileUrl,
            SpecialRequest = specialRequest,
            Status = ReservationStatus.Pending,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        string accommodationName,
        RoomType roomType,
        string performedBy,
        Guid? supplierId = null,
        string? bedType = null,
        string? address = null,
        string? contactPhone = null,
        DateTimeOffset? checkInAt = null,
        DateTimeOffset? checkOutAt = null,
        decimal? buyPrice = null,
        decimal? taxRate = null,
        bool? isTaxable = null,
        string? confirmationCode = null,
        string? fileUrl = null,
        string? specialRequest = null,
        ReservationStatus? status = null,
        string? note = null)
    {
        EnsureValidTimeRange(checkInAt, checkOutAt);

        if (buyPrice.HasValue)
        {
            EnsureNonNegative(buyPrice.Value, nameof(buyPrice));
            BuyPrice = buyPrice.Value;
        }

        if (taxRate.HasValue)
        {
            EnsureNonNegative(taxRate.Value, nameof(taxRate));
            TaxRate = taxRate.Value;
        }

        AccommodationName = accommodationName;
        RoomType = roomType;
        SupplierId = supplierId;
        BedType = bedType;
        Address = address;
        ContactPhone = contactPhone;
        CheckInAt = checkInAt;
        CheckOutAt = checkOutAt;
        IsTaxable = isTaxable ?? IsTaxable;
        TotalBuyPrice = IsTaxable ? BuyPrice + (BuyPrice * TaxRate / 100) : BuyPrice;
        ConfirmationCode = confirmationCode;
        FileUrl = fileUrl;
        SpecialRequest = specialRequest;
        Status = status ?? Status;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    private static void EnsureValidTimeRange(DateTimeOffset? checkInAt, DateTimeOffset? checkOutAt)
    {
        if (checkInAt.HasValue && checkOutAt.HasValue && checkOutAt.Value < checkInAt.Value)
        {
            throw new ArgumentException("CheckOutAt phải lớn hơn hoặc bằng CheckInAt.", nameof(checkOutAt));
        }
    }

    private static void EnsureNonNegative(decimal value, string paramName)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(paramName, "Giá trị không được âm.");
        }
    }
}
