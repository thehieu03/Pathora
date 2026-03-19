# Chú thích các bảng trong `src/Domain/Entities`

Tài liệu này mô tả công dụng của các entity trong thư mục `panthora_be/src/Domain/Entities` (quy chiếu theo tên bảng phổ biến trong hệ thống).

## Nhóm Tour và lịch trình

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `TourEntity.cs` | `Tours` | Lưu thông tin tour gốc, trạng thái xuất bản và các liên kết policy chính. |
| `TourClassificationEntity.cs` | `TourClassifications` | Lưu các phân loại/biến thể của tour (giá, đặc tính áp dụng). |
| `TourInstanceEntity.cs` | `TourInstances` | Lưu từng đợt khởi hành cụ thể của tour (ngày đi, sức chứa, giá). |
| `TourDayEntity.cs` | `TourDays` | Lưu lịch trình theo ngày của một phân loại tour. |
| `TourDayActivityEntity.cs` | `TourDayActivities` | Lưu hoạt động chi tiết theo từng ngày tour. |
| `TourPlanLocationEntity.cs` | `TourPlanLocations` | Lưu điểm đến/địa điểm trong kế hoạch hoạt động tour. |
| `TourPlanRouteEntity.cs` | `TourPlanRoutes` | Lưu chặng di chuyển giữa các điểm trong kế hoạch tour. |
| `TourPlanAccommodationEntity.cs` | `TourPlanAccommodations` | Lưu kế hoạch lưu trú cho hoạt động/lịch trình tour. |
| `TourInsuranceEntity.cs` | `TourInsurances` | Lưu gói bảo hiểm áp dụng cho tour/phân loại tour. |
| `TourRequestEntity.cs` | `TourRequests` | Lưu yêu cầu thiết kế/chào tour riêng từ khách hàng. |
| `TourGuideEntity.cs` | `TourGuides` | Lưu hồ sơ hướng dẫn viên và trạng thái khả dụng. |
| `TourDayActivityStatusEntity.cs` | `TourDayActivityStatuses` | Lưu trạng thái thực thi activity theo booking và ngày tour. |
| `TourDayActivityGuideEntity.cs` | `TourDayActivityGuides` | Lưu phân công hướng dẫn viên cho từng activity status. |

## Nhóm Booking, khách tham gia và reservation

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `BookingEntity.cs` | `Bookings` | Lưu đơn đặt tour, trạng thái đặt chỗ và thanh toán của khách. |
| `BookingParticipantEntity.cs` | `BookingParticipants` | Lưu danh sách người tham gia trong một booking. |
| `BookingTourGuideEntity.cs` | `BookingTourGuides` | Lưu phân công user/hướng dẫn viên vào booking theo vai trò. |
| `BookingActivityReservationEntity.cs` | `BookingActivityReservations` | Lưu các hạng mục dịch vụ/hoạt động được đặt theo booking. |
| `BookingAccommodationDetailEntity.cs` | `BookingAccommodationDetails` | Lưu chi tiết đặt phòng lưu trú cho booking/activity. |
| `BookingTransportDetailEntity.cs` | `BookingTransportDetails` | Lưu chi tiết đặt dịch vụ vận chuyển cho booking/activity. |
| `ReviewEntity.cs` | `Reviews` | Lưu đánh giá, nhận xét và rating của khách cho tour. |

## Nhóm thanh toán, công nợ và chính sách tài chính

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `PaymentEntity.cs` | `Payments` | Lưu bản ghi thanh toán tổng quát (người trả, số tiền, thuế, thông tin chuyển khoản). |
| `PaymentTransactionEntity.cs` | `PaymentTransactions` | Lưu transaction thanh toán chi tiết (trạng thái, metadata webhook, amount). |
| `CustomerDepositEntity.cs` | `CustomerDeposits` | Lưu các đợt cọc phải thu và trạng thái cọc theo booking. |
| `CustomerPaymentEntity.cs` | `CustomerPayments` | Lưu khoản tiền khách đã thanh toán cho booking/đợt cọc. |
| `SupplierPayableEntity.cs` | `SupplierPayables` | Lưu công nợ phải trả cho nhà cung cấp theo booking. |
| `SupplierReceiptEntity.cs` | `SupplierReceipts` | Lưu chứng từ chi tiền/thanh toán cho nhà cung cấp. |
| `TaxConfigEntity.cs` | `TaxConfigs` | Lưu cấu hình thuế có hiệu lực theo mốc thời gian. |
| `PricingPolicy.cs` | `PricingPolicies` | Lưu bộ chính sách giá động theo loại tour và tier giá. |
| `DynamicPricingTierEntity.cs` | `DynamicPricingTiers` | Lưu từng bậc giá theo số lượng khách trong chính sách giá động. |
| `DepositPolicyEntity.cs` | `DepositPolicies` | Lưu quy tắc đặt cọc (kiểu cọc, ngưỡng thời gian, phạm vi áp dụng). |
| `CancellationEntity.cs` | `CancellationPolicies` | Lưu chính sách hủy tour theo mốc ngày và phần trăm phạt. |

## Nhóm Visa và giấy tờ

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `VisaPolicyEntity.cs` | `VisaPolicies` | Lưu chính sách visa theo khu vực/thời gian xử lý. |
| `VisaApplicationEntity.cs` | `VisaApplications` | Lưu hồ sơ xin visa của người tham gia tour. |
| `VisaEntity.cs` | `Visas` | Lưu kết quả visa phát hành gắn với hồ sơ xin visa. |
| `PassportEntity.cs` | `Passports` | Lưu dữ liệu hộ chiếu phục vụ xác minh và xử lý visa. |

## Nhóm người dùng, phân quyền và tổ chức

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `UserEntity.cs` | `Users` | Lưu tài khoản người dùng, thông tin đăng nhập và trạng thái xác thực. |
| `RoleEntity.cs` | `Roles` | Lưu danh mục vai trò trong hệ thống. |
| `UserRoleEntity.cs` | `UserRoles` | Bảng nối user-role để gán quyền theo vai trò. |
| `RoleFunctionEntity.cs` | `RoleFunctions` | Bảng nối role-function để phân quyền chức năng chi tiết. |
| `DepartmentEntity.cs` | `Departments` | Lưu cơ cấu phòng ban (có thể theo mô hình phân cấp). |
| `PositionEntity.cs` | `Positions` | Lưu chức danh/cấp bậc nội bộ. |
| `RegisterEntity.cs` | `Registers` | Lưu thông tin đăng ký tài khoản tạm/chờ xác thực. |
| `OtpEntity.cs` | `Otps` | Lưu OTP xác thực, trạng thái hết hạn và lockout khi nhập sai nhiều lần. |
| `RefreshTokenEntity.cs` | `RefreshTokens` | Lưu refresh token phục vụ đăng nhập phiên dài hạn. |
| `PasswordResetTokenEntity.cs` | `PasswordResetTokens` | Lưu token reset mật khẩu (đã băm), hạn dùng và trạng thái đã dùng. |

## Nhóm nội dung hệ thống và tệp

| File | Bảng/Entity | Công dụng |
|---|---|---|
| `SiteContentEntity.cs` | `SiteContents` | Lưu nội dung CMS theo `PageKey`/`ContentKey` (dạng JSON). |
| `FileMetadataEntity.cs` | `FileMetadatas` | Lưu metadata tệp tải lên và liên kết thực thể liên quan. |
| `SupplierEntity.cs` | `Suppliers` | Lưu thông tin nhà cung cấp dịch vụ (lưu trú, vận chuyển, hoạt động...). |
| `OutboxMessage.cs` | `OutboxMessages` | Lưu message outbox để xử lý bất đồng bộ và retry an toàn. |

## File trong `Entities` nhưng không phải bảng DB độc lập

| File | Loại | Công dụng |
|---|---|---|
| `ImageEntity.cs` | Value object/owned type | Mô tả dữ liệu ảnh; thường được nhúng/owned bởi entity khác, không nhất thiết có DbSet độc lập. |
| `SiteContentValueCodec.cs` | Utility + record hỗ trợ | Chuẩn hóa/parse nội dung JSON đa ngôn ngữ cho Site Content. |
| `Translations/TranslationData.cs` | DTO translation | Định nghĩa cấu trúc dữ liệu dịch lưu trong JSONB. |
| `Translations/TranslationResolutionExtensions.cs` | Extension helper | Hỗ trợ resolve/apply bản dịch theo ngôn ngữ. |

## Ghi chú

- Tên bảng thực tế có thể được tùy biến ở layer `Infrastructure` (EF Core mapping).
- Tài liệu này dùng để hiểu nhanh vai trò nghiệp vụ của từng entity trong `Domain`.
