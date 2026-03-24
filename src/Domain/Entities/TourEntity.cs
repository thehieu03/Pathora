namespace Domain.Entities;

using Domain.Entities.Translations;

public class TourEntity : Aggregate<Guid>
{
    /// <summary>
    /// Bộ đếm sequence dùng để tạo mã tour duy nhất, an toàn khi chạy đa luồng.
    /// Được khởi tạo ngẫu nhiên từ 0 đến 100,000 để tránh trùng lặp khi
    /// nhiều instance ứng dụng khởi động cùng lúc.
    /// </summary>
    private static int _tourCodeSequence = Random.Shared.Next(0, 100000);

    /// <summary>
    /// Mã định danh duy nhất của tour, hiển thị cho người dùng.
    /// Định dạng: TOUR-YYYYMMDD-NNNNN (ví dụ: TOUR-20260319-00042).
    /// Được tạo tự động bằng <see cref="GenerateTourCode"/>.
    /// </summary>
    public string TourCode { get; set; } = null!;

    /// <summary>
    /// Tên hiển thị/cuốn hút của tour du lịch. Được sử dụng xuyên suốt
    /// ứng dụng trong danh sách tour, kết quả tìm kiếm và các nhãn UI.
    /// </summary>
    public string TourName { get; set; } = null!;

    /// <summary>
    /// Mô tả ngắn gọn, một dòng về tour. Thường dùng trên các card
    /// hiển thị tour và phần xem trước. Độ dài khoảng 100-200 ký tự.
    /// Hiển thị trong kết quả tìm kiếm và danh sách tour.
    /// </summary>
    public string ShortDescription { get; set; } = null!;

    /// <summary>
    /// Mô tả chi tiết đầy đủ về tour du lịch. Hỗ trợ nội dung phong phú
    /// bao gồm lịch trình, điểm nổi bật, bao gồm/không bao gồm, v.v.
    /// Được hiển thị trên trang chi tiết tour.
    /// </summary>
    public string LongDescription { get; set; } = null!;

    /// <summary>
    /// Cờ xóa mềm (soft-delete). Khi là true, tour bị xóa logic và bị
    /// loại khỏi tất cả các truy vấn. Dữ liệu vẫn được giữ trong CSDL
    /// để phục vụ mục đích kiểm toán/lịch sử.
    /// </summary>
    public bool IsDeleted { get; set; } = false;

    /// <summary>
    /// Tiêu đề trang tùy chỉnh dành cho SEO (Search Engine Optimization).
    /// Nếu null, mặc định sẽ dùng <see cref="TourName"/>. Hiển thị trên
    /// tab trình duyệt và kết quả tìm kiếm.
    /// </summary>
    public string? SEOTitle { get; set; }

    /// <summary>
    /// Mô tả meta tùy chỉnh dành cho SEO. Nếu null, mặc định sẽ dùng
    /// <see cref="ShortDescription"/>. Hiển thị làm đoạn trích trong
    /// kết quả tìm kiếm của Google.
    /// </summary>
    public string? SEODescription { get; set; }

    /// <summary>
    /// Trạng thái workflow hiện tại của tour (ví dụ: Đang chờ duyệt, Đã
    /// xuất bản, Bản nháp, Đã lưu trữ). Kiểm soát khả năng hiển thị và
    /// chỉnh sửa tour trong hệ thống. Mặc định là
    /// <see cref="TourStatus.Pending"/>.
    /// </summary>
    public TourStatus Status { get; set; } = TourStatus.Pending;

    /// <summary>
    /// Phạm vi địa lý của tour. Xác định tour trong nước (một quốc gia)
    /// hay quốc tế. Ảnh hưởng đến yêu cầu chính sách visa và tuân thủ
    /// quy định. Mặc định là <see cref="TourScope.Domestic"/> (trong nước).
    /// </summary>
    public TourScope TourScope { get; set; } = TourScope.Domestic;

    /// <summary>
    /// Phân khúc khách hàng mục tiêu cho tour này (ví dụ: Nhóm, Cá
    /// nhân, Gia đình, Doanh nghiệp). Dùng để lọc, gợi ý tour và xây
    /// dựng chiến lược giá. Mặc định là
    /// <see cref="CustomerSegment.Group"/> (theo nhóm).
    /// </summary>
    public CustomerSegment CustomerSegment { get; set; } = CustomerSegment.Group;

    /// <summary>
    /// Ảnh thumbnail chính, hiển thị trong danh sách tour và kết quả
    /// tìm kiếm. Là hình ảnh đại diện cho tour trên các card, carousel
    /// và khi chia sẻ lên mạng xã hội.
    /// </summary>
    public ImageEntity Thumbnail { get; set; } = null!;

    /// <summary>
    /// Danh sách các ảnh gallery bổ sung cho trang chi tiết tour.
    /// Hiển thị dạng carousel hoặc bộ sưu tập ảnh. Không bao gồm
    /// thumbnail, vì thumbnail được lưu riêng.
    /// </summary>
    public List<ImageEntity> Images { get; set; } = [];

    /// <summary>
    /// Từ điển chứa nội dung đa ngôn ngữ, khóa là mã ngôn ngữ
    /// (ví dụ: "en", "vi"). Lưu trữ các bản dịch của tên tour, mô
    /// tả và các văn bản hiển thị cho người dùng khác ngôn ngữ.
    /// </summary>
    public Dictionary<string, TourTranslationData> Translations { get; set; } = [];

    /// <summary>
    /// Navigation property đến danh sách phân loại danh mục của tour.
    /// Mỗi phân loại liên kết tour với một <see cref="TourCategoryEntity"/>
    /// (ví dụ: Phiêu lưu, Văn hóa, Biển). Dùng để lọc và duyệt tour.
    /// </summary>
    public virtual List<TourClassificationEntity> Classifications { get; set; } = [];
    public virtual List<TourResourceEntity> Resources { get; set; } = [];

    /// <summary>
    /// Khóa ngoại tham chiếu đến chính sách visa áp dụng cho tour quốc
    /// tế. Null đối với tour trong nước. Định nghĩa yêu cầu visa, thời
    /// gian xử lý và thông tin liên quan cho khách du lịch.
    /// </summary>
    public Guid? VisaPolicyId { get; set; }

    /// <summary>
    /// Navigation property đến <see cref="VisaPolicyEntity"/> liên kết.
    /// Được lazy-load bởi EF Core. Chứa yêu cầu và quy trình xin visa
    /// cho tour quốc tế.
    /// </summary>
    public virtual VisaPolicyEntity? VisaPolicy { get; set; }

    /// <summary>
    /// Khóa ngoại tham chiếu đến chính sách đặt cọc để đặt tour này.
    /// Định nghĩa số tiền đặt cọc bắt buộc và thời hạn thanh toán
    /// trước khi xác nhận tour.
    /// </summary>
    public Guid? DepositPolicyId { get; set; }

    /// <summary>
    /// Navigation property đến <see cref="DepositPolicyEntity"/> liên kết.
    /// Được lazy-load bởi EF Core. Chứa các điều khoản và điều kiện đặt cọc.
    /// </summary>
    public virtual DepositPolicyEntity? DepositPolicy { get; set; }

    /// <summary>
    /// Khóa ngoại tham chiếu đến chính sách giá cho tour này.
    /// Định nghĩa các bậc giá, điều chỉnh theo mùa và quy tắc giảm giá.
    /// </summary>
    public Guid? PricingPolicyId { get; set; }

    /// <summary>
    /// Navigation property đến <see cref="PricingPolicy"/> liên kết.
    /// Được lazy-load bởi EF Core. Chứa các quy tắc giá động và điều kiện.
    /// </summary>
    public virtual PricingPolicy? PricingPolicy { get; set; }

    /// <summary>
    /// Khóa ngoại tham chiếu đến chính sách hủy tour. Định nghĩa các
    /// điều khoản hoàn tiền, thời hạn hủy và mức phạt.
    /// </summary>
    public Guid? CancellationPolicyId { get; set; }

    /// <summary>
    /// Navigation property đến <see cref="CancellationPolicyEntity"/> liên kết.
    /// Được lazy-load bởi EF Core. Chứa các điều kiện hủy tour và hoàn tiền.
    /// </summary>
    public virtual CancellationPolicyEntity? CancellationPolicy { get; set; }

    /// <summary>
    /// Tạo mã tour duy nhất, có thể đọc được theo định dạng
    /// TOUR-YYYYMMDD-NNNNN. Phần sequence tăng atomic, an toàn đa luồng.
    /// Quay về 0 sau khi đạt 99,999 để đảm bảo mã luôn đúng định dạng.
    /// </summary>
    /// <returns>Chuỗi mã tour đã định dạng.</returns>
    public static string GenerateTourCode()
    {
        var datePart = DateTimeOffset.UtcNow.ToString("yyyyMMdd");
        var sequence = Interlocked.Increment(ref _tourCodeSequence) % 100000;
        return $"TOUR-{datePart}-{sequence:00000}";
    }

    /// <summary>
    /// Factory method tạo một Tour entity mới với đầy đủ các trường bắt
    /// buộc. Gán <see cref="Id"/> duy nhất qua Guid.CreateVersion7(),
    /// tạo <see cref="TourCode"/> tự động, timestamp kiểm toán và giá trị
    /// mặc định cho trạng thái cùng phạm vi.
    /// </summary>
    /// <param name="tourName">Tên hiển thị của tour.</param>
    /// <param name="shortDescription">Mô tả ngắn cho danh sách tour.</param>
    /// <param name="longDescription">Mô tả chi tiết đầy đủ.</param>
    /// <param name="performedBy">Tên đăng nhập của admin tạo tour.</param>
    /// <param name="status">Trạng thái workflow. Mặc định: Đang chờ duyệt.</param>
    /// <param name="tourScope">Phạm vi địa lý. Mặc định: Trong nước.</param>
    /// <param name="customerSegment">Phân khúc khách hàng. Mặc định: Theo nhóm.</param>
    /// <param name="seoTitle">Tiêu đề SEO tùy chỉnh. Tùy chọn.</param>
    /// <param name="seoDescription">Mô tả meta SEO. Tùy chọn.</param>
    /// <param name="thumbnail">Ảnh thumbnail chính. Tùy chọn.</param>
    /// <param name="images">Ảnh gallery. Tùy chọn.</param>
    /// <param name="visaPolicyId">Chính sách visa liên kết. Tùy chọn.</param>
    /// <param name="depositPolicyId">Chính sách đặt cọc liên kết. Tùy chọn.</param>
    /// <param name="pricingPolicyId">Chính sách giá liên kết. Tùy chọn.</param>
    /// <param name="cancellationPolicyId">Chính sách hủy liên kết. Tùy chọn.</param>
    /// <returns>Instance <see cref="TourEntity"/> đã khởi tạo đầy đủ.</returns>
    public static TourEntity Create(string tourName, string shortDescription, string longDescription, string performedBy, TourStatus status = TourStatus.Pending, TourScope tourScope = TourScope.Domestic, CustomerSegment customerSegment = CustomerSegment.Group, string? seoTitle = null, string? seoDescription = null, ImageEntity? thumbnail = null, List<ImageEntity>? images = null, Guid? visaPolicyId = null, Guid? depositPolicyId = null, Guid? pricingPolicyId = null, Guid? cancellationPolicyId = null)
    {
        return new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = GenerateTourCode(),
            TourName = tourName,
            ShortDescription = shortDescription,
            LongDescription = longDescription,
            SEOTitle = seoTitle,
            SEODescription = seoDescription,
            Status = status,
            TourScope = tourScope,
            CustomerSegment = customerSegment,
            Thumbnail = thumbnail ?? new ImageEntity(),
            Images = images ?? [],
            VisaPolicyId = visaPolicyId,
            DepositPolicyId = depositPolicyId,
            PricingPolicyId = pricingPolicyId,
            CancellationPolicyId = cancellationPolicyId,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    /// <summary>
    /// Cập nhật các thuộc tính có thể thay đổi của tour và làm mới
    /// timestamp kiểm toán. Chỉ cập nhật collection ảnh thumbnail
    /// và images khi có giá trị mới được truyền vào (ngữ nghĩa partial update).
    /// </summary>
    /// <param name="tourName">Tên hiển thị mới.</param>
    /// <param name="shortDescription">Mô tả ngắn mới.</param>
    /// <param name="longDescription">Mô tả chi tiết mới.</param>
    /// <param name="status">Trạng thái workflow mới.</param>
    /// <param name="performedBy">Tên đăng nhập của admin cập nhật.</param>
    /// <param name="tourScope">Phạm vi địa lý mới.</param>
    /// <param name="customerSegment">Phân khúc khách hàng mới.</param>
    /// <param name="seoTitle">Tiêu đề SEO mới.</param>
    /// <param name="seoDescription">Mô tả SEO mới.</param>
    /// <param name="thumbnail">Thumbnail mới. Nếu có, sẽ thay thế ảnh cũ.</param>
    /// <param name="images">Ảnh gallery mới. Nếu có, sẽ thay toàn bộ collection.</param>
    /// <param name="visaPolicyId">Tham chiếu chính sách visa mới.</param>
    /// <param name="depositPolicyId">Tham chiếu chính sách đặt cọc mới.</param>
    /// <param name="pricingPolicyId">Tham chiếu chính sách giá mới.</param>
    /// <param name="cancellationPolicyId">Tham chiếu chính sách hủy mới.</param>
    public void Update(string tourName, string shortDescription, string longDescription, TourStatus status, string performedBy, TourScope tourScope = TourScope.Domestic, CustomerSegment customerSegment = CustomerSegment.Group, string? seoTitle = null, string? seoDescription = null, ImageEntity? thumbnail = null, List<ImageEntity>? images = null, Guid? visaPolicyId = null, Guid? depositPolicyId = null, Guid? pricingPolicyId = null, Guid? cancellationPolicyId = null)
    {
        TourName = tourName;
        ShortDescription = shortDescription;
        LongDescription = longDescription;
        SEOTitle = seoTitle;
        SEODescription = seoDescription;
        Status = status;
        TourScope = tourScope;
        CustomerSegment = customerSegment;
        if (thumbnail is not null)
        {
            Thumbnail ??= new ImageEntity();
            Thumbnail.FileId = thumbnail.FileId;
            Thumbnail.OriginalFileName = thumbnail.OriginalFileName;
            Thumbnail.FileName = thumbnail.FileName;
            Thumbnail.PublicURL = thumbnail.PublicURL;
        }
        if (images is not null)
        {
            Images.Clear();
            Images.AddRange(images);
        }
        VisaPolicyId = visaPolicyId;
        DepositPolicyId = depositPolicyId;
        PricingPolicyId = pricingPolicyId;
        CancellationPolicyId = cancellationPolicyId;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Thực hiện xóa mềm tour bằng cách đặt <see cref="IsDeleted"/> = true.
    /// Bản ghi vẫn tồn tại trong CSDL để phục vụ lịch sử kiểm toán
    /// nhưng bị loại khỏi mọi truy vấn thông thường.
    /// </summary>
    /// <param name="performedBy">Tên đăng nhập của admin thực hiện xóa.</param>
    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
