-- Script xóa dữ liệu bảng Tour và TourInstance
-- Thứ tự xóa từ bảng con đến bảng cha (theo foreign key constraints)
-- Chạy script này trong transaction để đảm bảo toàn vẹn dữ liệu

BEGIN;

-- ============================================
-- XÓA DỮ LIỆU TOURINSTANCE VÀ CÁC BẢNG PHỤ THUỘC
-- ============================================

-- 1. Xóa TourInstanceImages (phụ thuộc TourInstances)
DELETE FROM "TourInstanceImages";

-- 2. Xóa TourInstancePricingTiers (tên bảng thực tế)
DELETE FROM "TourInstancePricingTiers";

-- 3. Xóa BookingActivityReservations (phụ thuộc Booking)
DELETE FROM "BookingActivityReservations";

-- 4. Xóa BookingParticipants (phụ thuộc Bookings)
DELETE FROM "BookingParticipants";

-- 5. Xóa BookingTourGuides (phụ thuộc Bookings)
DELETE FROM "BookingTourGuides";

-- 6. Xóa TourDayActivityStatuses (phụ thuộc Booking)
DELETE FROM "TourDayActivityStatuses";

-- 7. Xóa PaymentTransactions trước
DELETE FROM "PaymentTransactions";

-- 8. Xóa CustomerPayments trước CustomerDeposits
DELETE FROM "CustomerPayments";
DELETE FROM "CustomerDeposits";

-- 9. Xóa SupplierPayables (phụ thuộc Bookings)
DELETE FROM "SupplierPayables";

-- 10. Xóa Bookings (phụ thuộc TourInstances)
DELETE FROM "Bookings";

-- 11. Xóa TourRequests có TourInstanceId
DELETE FROM "TourRequests" WHERE "TourInstanceId" IS NOT NULL;

-- 12. Xóa TourInstances
DELETE FROM "TourInstances";

-- ============================================
-- XÓA DỮ LIỆU TOUR VÀ CÁC BẢNG PHỤ THUỘC
-- ============================================

-- 13. Xóa TourPlanLocations (phụ thuộc TourDayActivities)
DELETE FROM "TourPlanLocations";

-- 14. Xóa TourPlanAccommodations (phụ thuộc TourDayActivities)
DELETE FROM "TourPlanAccommodations";

-- 15. Xóa TourPlanRoutes (phụ thuộc TourDayActivities)
DELETE FROM "TourPlanRoutes";

-- 16. Xóa TourDayActivityGuides (phụ thuộc TourDayActivities)
DELETE FROM "TourDayActivityGuides";

-- 17. Xóa TourDayActivities (phụ thuộc TourDays)
DELETE FROM "TourDayActivities";

-- 18. Xóa TourDays (phụ thuộc TourClassifications)
DELETE FROM "TourDays";

-- 19. Xóa TourInsurances (phụ thuộc TourClassifications)
DELETE FROM "TourInsurances";

-- 20. Xóa Reviews (phụ thuộc Tours)
DELETE FROM "Reviews";

-- 21. Xóa TourImages (phụ thuộc Tours)
DELETE FROM "TourImages";

-- 22. Xóa TourClassifications (phụ thuộc Tours)
DELETE FROM "TourClassifications";

-- 23. Xóa Tours (bảng cha cuối cùng)
DELETE FROM "Tours";

COMMIT;

-- ============================================
-- VERIFY KẾT QUẢ
-- ============================================
SELECT 'Tours' as TableName, COUNT(*) as RemainingRows FROM "Tours"
UNION ALL
SELECT 'TourInstances', COUNT(*) FROM "TourInstances"
UNION ALL
SELECT 'TourClassifications', COUNT(*) FROM "TourClassifications"
UNION ALL
SELECT 'TourDays', COUNT(*) FROM "TourDays"
UNION ALL
SELECT 'TourDayActivities', COUNT(*) FROM "TourDayActivities"
UNION ALL
SELECT 'TourInsurances', COUNT(*) FROM "TourInsurances"
UNION ALL
SELECT 'Bookings', COUNT(*) FROM "Bookings"
UNION ALL
SELECT 'Reviews', COUNT(*) FROM "Reviews"
UNION ALL
SELECT 'TourImages', COUNT(*) FROM "TourImages"
UNION ALL
SELECT 'TourInstanceImages', COUNT(*) FROM "TourInstanceImages";
