-- ============================================================
-- SEED DATA - Pathora / Panthora
-- PostgreSQL
-- Bilingual: Vietnamese (VN) + English (EN)
-- All passwords: Admin@123 (BCrypt cost 11)
-- ============================================================

-- ============================================================
-- CLEANUP: Delete all data EXCEPT account tables
--   Kept: Users, Roles, UserRoles, RefreshTokens, Registers,
--         Functions, SystemKeys, RoleFunctions, Otps
-- ============================================================
DELETE FROM "TourPlanRoutes";
DELETE FROM "TourPlanLocations";
DELETE FROM "TourPlanAccommodations";
DELETE FROM "TourDayActivities";
DELETE FROM "TourInsurances";
DELETE FROM "TourDays";
DELETE FROM "TourClassifications";
DELETE FROM "Reviews";
DELETE FROM "TourImages";
DELETE FROM "Tours";
DELETE FROM "Departments";
DELETE FROM "Positions";
DELETE FROM "FileMetadatas";
DELETE FROM "Mails";
DELETE FROM "logErrors";

-- ------------------------------------------------------------
-- 1. Departments
-- ------------------------------------------------------------
INSERT INTO "Departments" ("Id", "ParentId", "Name", "Level", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000020', NULL                                       'Công ty TNHH Pathora', 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000021', '019527a0-0000-7000-8000-000000000020'     'Phòng Kinh doanh', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000022', '019527a0-0000-7000-8000-000000000020'     'Phòng Kỹ thuật', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000023', '019527a0-0000-7000-8000-000000000020'     'Phòng Hành chính - HR', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000024', '019527a0-0000-7000-8000-000000000020'     'Phòng Kế toán', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000025', '019527a0-0000-7000-8000-000000000020'     'Phòng Tour & Điều hành', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000026', '019527a0-0000-7000-8000-000000000020'     'Phòng Marketing', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000027', '019527a0-0000-7000-8000-000000000021'     'Tổ Kinh doanh trong nước', 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000028', '019527a0-0000-7000-8000-000000000021'     'Tổ Kinh doanh quốc tế', 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000029', '019527a0-0000-7000-8000-000000000025'     'Tổ Điều hành tour', 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-00000000002a', '019527a0-0000-7000-8000-000000000025'     'Tổ Hướng dẫn viên', 3, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 2. Positions
-- ------------------------------------------------------------
INSERT INTO "Positions" ("Id", "Name", "Level", "Note", "Type", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000030', 'Giám đốc', 1, NULL, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000031', 'Phó giám đốc', 2, NULL, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000032', 'Trưởng phòng', 3, NULL, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000033', 'Phó phòng', 4, NULL, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000034', 'Nhân viên kinh doanh', 5, 'Phụ trách bán tour', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000035', 'Nhân viên điều hành', 5, 'Phụ trách vận hành tour', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000036', 'Hướng dẫn viên', 5, 'HDV nội địa & quốc tế', 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000037', 'Nhân viên kế toán', 5, NULL, 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000038', 'Nhân viên IT', 5, NULL, 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000039', 'Nhân viên marketing', 5, NULL, 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000040', 'Thực tập sinh', 6, NULL, 2, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 3. Roles
-- ------------------------------------------------------------
INSERT INTO "Roles" ("Id", "Name", "Description", "Type", "Status", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000011', 'Administrator', 'Quản trị viên hệ thống', 1, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000012', 'Staff', 'Nhân viên nghiệp vụ', 2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000013', 'View Only', 'Chỉ xem, không chỉnh sửa', 2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000014', 'Tour Manager', 'Quản lý tour & điều hành', 2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000015', 'Sales', 'Nhân viên kinh doanh bán tour', 2, 1, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4. Users (password: Admin@123)
-- ------------------------------------------------------------
INSERT INTO "Users" ("Id", "Username", "FullName", "Email", "Password", "AvatarUrl", "ForcePasswordChange", "IsDeleted", "VerifyStatus", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000001', 'admin', 'Super Admin', 'admin@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000002', 'nguyen.van.a', 'Nguyễn Văn An', 'nguyen.van.a@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000003', 'tran.thi.b', 'Trần Thị Bình', 'tran.thi.b@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000004', 'le.van.c', 'Lê Văn Cường', 'le.van.c@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000005', 'pham.thi.d', 'Phạm Thị Dung', 'pham.thi.d@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000006', 'hoang.van.e', 'Hoàng Văn Em', 'hoang.van.e@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000007', 'nguyen.thi.f', 'Nguyễn Thị Phương', 'nguyen.thi.f@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000008', 'do.van.g', 'Đỗ Văn Giang', 'do.van.g@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000009', 'vu.thi.h', 'Vũ Thị Hoa', 'vu.thi.h@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 1, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-00000000000a', 'bui.van.i', 'Bùi Văn Ích', 'bui.van.i@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, TRUE, FALSE, 1, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 5. UserRoles
-- ------------------------------------------------------------
INSERT INTO "UserRoles" ("UserId", "RoleId")
VALUES
    ('019527a0-0000-7000-8000-000000000001', '019c91cd-29d3-7969-a60c-60b9677ac385'),
    ('019527a0-0000-7000-8000-000000000002', '019527a0-0000-7000-8000-000000000011'),
    ('019527a0-0000-7000-8000-000000000003', '019527a0-0000-7000-8000-000000000011'),
    ('019527a0-0000-7000-8000-000000000004', '019527a0-0000-7000-8000-000000000014'),
    ('019527a0-0000-7000-8000-000000000005', '019527a0-0000-7000-8000-000000000014'),
    ('019527a0-0000-7000-8000-000000000006', '019527a0-0000-7000-8000-000000000015'),
    ('019527a0-0000-7000-8000-000000000007', '019527a0-0000-7000-8000-000000000015'),
    ('019527a0-0000-7000-8000-000000000008', '019527a0-0000-7000-8000-000000000012'),
    ('019527a0-0000-7000-8000-000000000009', '019527a0-0000-7000-8000-000000000012'),
    ('019527a0-0000-7000-8000-00000000000a', '019527a0-0000-7000-8000-000000000013')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 6. Tours (5 Vietnamese + 3 English)
-- ------------------------------------------------------------
INSERT INTO "Tours" ("Id", "TourCode", "TourName", "ShortDescription", "LongDescription", "Status", "IsDeleted", "SEOTitle", "SEODescription", "Thumbnail_FileId", "Thumbnail_OriginalFileName", "Thumbnail_FileName", "Thumbnail_PublicURL", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527b0-0000-7000-8000-000000000001',
     'VN-HN-HL-3N2D',
     'Hà Nội - Hạ Long 3 Ngày 2 Đêm',
     'Khám phá vịnh Hạ Long huyền bí với hàng nghìn đảo đá vôi kỳ vĩ.',
     'Tour Hà Nội - Hạ Long 3N2Đ đưa bạn qua cung đường ven biển thơ mộng, thăm các hang động nổi tiếng như hang Sửng Sốt, Thiên Cung, trải nghiệm chèo kayak và tắm biển tại bãi Ti Tốp.',
     'Active', FALSE,
     'Tour Hà Nội Hạ Long 3N2Đ - Khám phá vịnh di sản',
     'Tour Hà Nội - Hạ Long 3 ngày 2 đêm giá tốt. Ngủ thuyền, khám phá hang động, chèo kayak.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000002',
     'VN-DN-HA-4N3D',
     'Đà Nẵng - Hội An - Bà Nà 4 Ngày 3 Đêm',
     'Hành trình miền Trung quyến rũ: phố cổ Hội An, cầu Vàng Bà Nà và biển Mỹ Khê.',
     'Khởi hành từ Đà Nẵng, tour đưa du khách tham quan cầu Vàng trên đỉnh Bà Nà Hills, dạo phố cổ Hội An về đêm lung linh đèn lồng, thăm thánh địa Mỹ Sơn và thư giãn tại biển Mỹ Khê.',
     'Active', FALSE,
     'Tour Đà Nẵng Hội An 4N3Đ - Cầu Vàng & Phố cổ',
     'Tour Đà Nẵng - Hội An 4 ngày 3 đêm. Cầu Vàng Bà Nà, phố cổ Hội An, biển Mỹ Khê.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000003',
     'VN-PQ-5N4D',
     'Phú Quốc Đảo Ngọc 5 Ngày 4 Đêm',
     'Thiên đường biển đảo Phú Quốc - biển xanh, cát trắng, nắng vàng.',
     'Tour Phú Quốc 5N4Đ bao gồm tham quan Vinpearl Safari, lặn ngắm san hô tại quần đảo An Thới, thăm làng chài Hàm Ninh. Nghỉ dưỡng resort 4 sao ven biển.',
     'Active', FALSE,
     'Tour Phú Quốc 5N4Đ - Đảo Ngọc nghỉ dưỡng',
     'Tour Phú Quốc 5 ngày 4 đêm. Safari, lặn biển, resort 4 sao.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000004',
     'VN-SP-3N2D',
     'Sapa - Bản Cát Cát - Fansipan 3 Ngày 2 Đêm',
     'Chinh phục nóc nhà Đông Dương, trekking bản làng và ngắm ruộng bậc thang.',
     'Tour Sapa 3N2Đ chinh phục đỉnh Fansipan bằng cáp treo, trekking bản Cát Cát ngắm thác nước, tham quan ruộng bậc thang Mường Hoa mùa lúa chín.',
     'Active', FALSE,
     'Tour Sapa Fansipan 3N2Đ - Trekking bản làng',
     'Tour Sapa 3 ngày 2 đêm. Fansipan cáp treo, bản Cát Cát, ruộng bậc thang.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000005',
     'VN-HCM-CT-PQ-5N4D',
     'TP.HCM - Cần Thơ - Phú Quốc 5 Ngày 4 Đêm',
     'Hành trình miền Tây sông nước kết hợp nghỉ dưỡng đảo ngọc Phú Quốc.',
     'Tour kết hợp khám phá miền Tây sông nước: chợ nổi Cái Răng, vườn trái cây, làng nghề đan lát và chèo xuồng trên kênh rạch. Bay ra Phú Quốc nghỉ dưỡng.',
     'Pending', FALSE,
     'Tour TP.HCM Cần Thơ Phú Quốc 5N4Đ',
     'Tour miền Tây + Phú Quốc 5 ngày 4 đêm. Chợ nổi Cái Răng, resort biển.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000006',
     'TH-BKK-PTY-4D3N',
     'Bangkok - Pattaya 4 Days 3 Nights',
     'Explore the vibrant Thai capital and the stunning beaches of Pattaya.',
     'Discover Bangkoks magnificent Grand Palace and Wat Pho, shop at Chatuchak Weekend Market, then head to Pattaya for beach relaxation and Coral Island adventures.',
     'Active', FALSE,
     'Bangkok Pattaya Tour 4D3N - Temples & Beaches',
     'Bangkok Pattaya 4 days 3 nights tour. Grand Palace, Coral Island, Thai street food.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000007',
     'JP-TKO-OSK-5D4N',
     'Tokyo - Osaka Cherry Blossom 5 Days 4 Nights',
     'Experience Japans iconic cherry blossoms from Tokyo to Osaka via Shinkansen.',
     'Visit Sensō-ji Temple, Tokyo Skytree, Meiji Shrine, take a day trip to Mount Fuji, then ride the bullet train to Osaka for castle visits and Kyoto temples.',
     'Active', FALSE,
     'Tokyo Osaka Cherry Blossom Tour 5D4N',
     'Japan tour 5 days. Tokyo, Mount Fuji, Shinkansen, Osaka Castle, Kyoto temples.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000008',
     'KR-SEL-JEJ-4D3N',
     'Seoul - Jeju Island 4 Days 3 Nights',
     'Discover Seouls royal palaces and Jejus volcanic landscapes.',
     'Explore Gyeongbokgung Palace and Myeongdong shopping in Seoul, then fly to Jeju Island for Hallasan National Park and Seongsan Ilchulbong sunrise peak.',
     'Active', FALSE,
     'Seoul Jeju Tour 4D3N - Palaces & Volcanic Island',
     'Korea tour 4 days. Seoul palaces, Myeongdong, Jeju Hallasan, Seongsan peak.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 7. TourClassifications (2 per tour)
-- ------------------------------------------------------------
INSERT INTO "TourClassifications" ("Id", "TourId", "Name", "Price", "SalePrice", "Description", "DurationDays", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527c0-0000-7000-8000-000000000001', '019527b0-0000-7000-8000-000000000001', 'Tiêu chuẩn', 3500000, 3200000, 'Phòng đôi tiêu chuẩn trên tàu 3 sao, bữa ăn theo chương trình.', 3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000001', 'Cao cấp', 5500000, 5000000, 'Cabin đôi deluxe trên tàu 5 sao, bữa ăn cao cấp, spa trên tàu.', 3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000002', 'Tiêu chuẩn', 4200000, 3900000, 'Khách sạn 3 sao trung tâm Đà Nẵng, bữa sáng.', 4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000002', 'Cao cấp', 6800000, 6200000, 'Resort 5 sao Đà Nẵng, bữa sáng buffet, đón tiễn riêng.', 4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000003', 'Tiêu chuẩn', 5800000, 5500000, 'Resort 3 sao Phú Quốc, bữa sáng.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000003', 'Hạng sang', 9500000, 8800000, 'Resort 5 sao beachfront, bán trú + tối, dịch vụ butler.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000004', 'Tiêu chuẩn', 2800000, 2500000, 'Khách sạn 3 sao Sapa Town, bữa sáng.', 3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000004', 'Cao cấp', 4500000, 4200000, 'Khách sạn 4 sao view núi, bữa sáng + tối, cáp treo Fansipan.', 3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000009', '019527b0-0000-7000-8000-000000000005', 'Tiêu chuẩn', 6200000, 5800000, 'Khách sạn 3 sao, bữa sáng, vé máy bay HCM - Phú Quốc.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000a', '019527b0-0000-7000-8000-000000000005', 'Cao cấp', 9800000, 9000000, 'Resort 4 sao Phú Quốc, bán trú, vé máy bay, chuyên xe.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000b', '019527b0-0000-7000-8000-000000000006', 'Standard', 4500000, 4200000, '3-star hotel in Bangkok & Pattaya, breakfast included, group transport.', 4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000c', '019527b0-0000-7000-8000-000000000006', 'Premium', 7200000, 6800000, '5-star resort, all meals, private transfers, spa voucher.', 4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000d', '019527b0-0000-7000-8000-000000000007', 'Standard', 18500000, 17500000, '3-star hotel, breakfast, JR Pass, airport transfer.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000e', '019527b0-0000-7000-8000-000000000007', 'Premium', 28000000, 26000000, '5-star hotel, all meals, private guide, Green Car Shinkansen.', 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000f', '019527b0-0000-7000-8000-000000000008', 'Standard', 12500000, 11800000, '3-star hotel, breakfast, domestic flight Seoul-Jeju included.', 4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000010', '019527b0-0000-7000-8000-000000000008', 'Premium', 19800000, 18500000, '5-star hotel, all meals, private guide, flight + transfers.', 4, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 8. TourDays
-- ------------------------------------------------------------
INSERT INTO "TourDays" ("Id", "TourClassificationId", "DayNumber", "Title", "Description", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527d0-0000-7000-8000-000000000001', '019527c0-0000-7000-8000-000000000001', 1, 'Hà Nội → Hạ Long', 'Di chuyển Hà Nội - Hạ Long, tham quan hang Sửng Sốt', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000002', '019527c0-0000-7000-8000-000000000001', 2, 'Khám phá vịnh Hạ Long', 'Chèo kayak, tắm biển Bãi Ti Tốp, hang Thiên Cung', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000003', '019527c0-0000-7000-8000-000000000001', 3, 'Hạ Long → Hà Nội', 'Trả phòng tàu, về Hà Nội', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000004', '019527c0-0000-7000-8000-000000000003', 1, 'Đà Nẵng', 'Bãi biển Mỹ Khê, Cầu Rồng', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000005', '019527c0-0000-7000-8000-000000000003', 2, 'Bà Nà Hills', 'Cầu Vàng, khu vui chơi Bà Nà', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000006', '019527c0-0000-7000-8000-000000000003', 3, 'Hội An', 'Phố cổ Hội An, chợ đêm, ẩm thực', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000007', '019527c0-0000-7000-8000-000000000003', 4, 'Ngũ Hành Sơn & Về', 'Ngũ Hành Sơn, Chùa Linh Ứng', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000008', '019527c0-0000-7000-8000-00000000000b', 1, 'Bangkok', 'Grand Palace, Wat Pho', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000009', '019527c0-0000-7000-8000-00000000000b', 2, 'Bangkok → Pattaya', 'Chatuchak Market, transfer to Pattaya', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000a', '019527c0-0000-7000-8000-00000000000b', 3, 'Pattaya', 'Coral Island, Walking Street', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000b', '019527c0-0000-7000-8000-00000000000b', 4, 'Pattaya → Bangkok', 'Return to Bangkok, departure', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000c', '019527c0-0000-7000-8000-00000000000d', 1, 'Tokyo - Asakusa & Skytree', 'Sensō-ji Temple, Tokyo Skytree', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000d', '019527c0-0000-7000-8000-00000000000d', 2, 'Tokyo - Shibuya & Harajuku', 'Meiji Shrine, Shibuya Crossing', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000e', '019527c0-0000-7000-8000-00000000000d', 3, 'Mount Fuji Day Trip', 'Mount Fuji 5th Station', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000000f', '019527c0-0000-7000-8000-00000000000d', 4, 'Tokyo → Osaka', 'Shinkansen, Osaka Castle, Dotonbori', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000010', '019527c0-0000-7000-8000-00000000000d', 5, 'Kyoto Day Trip', 'Fushimi Inari, Kinkaku-ji', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000011', '019527c0-0000-7000-8000-000000000005', 1, 'Đến Phú Quốc', 'Bãi Sao, nghỉ dưỡng', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000012', '019527c0-0000-7000-8000-000000000005', 2, 'Vinpearl Safari', 'Tham quan Vinpearl Safari Phú Quốc', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000013', '019527c0-0000-7000-8000-000000000005', 3, 'Lặn biển An Thới', 'Lặn san hô quần đảo An Thới', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000014', '019527c0-0000-7000-8000-000000000007', 1, 'Sapa Town', 'Trekking bản Cát Cát', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000015', '019527c0-0000-7000-8000-000000000007', 2, 'Fansipan & Mường Hoa', 'Chinh phục Fansipan, ruộng bậc thang', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000016', '019527c0-0000-7000-8000-000000000009', 1, 'TP. Hồ Chí Minh', 'Dinh Độc Lập, Nhà thờ Đức Bà', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000017', '019527c0-0000-7000-8000-000000000009', 2, 'Cần Thơ', 'Chợ nổi Cái Răng', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000018', '019527c0-0000-7000-8000-00000000000f', 1, 'Seoul', 'Gyeongbokgung Palace, Myeongdong', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-000000000019', '019527c0-0000-7000-8000-00000000000f', 2, 'Seoul', 'N Seoul Tower', 'system', NOW(), 'system', NOW()),
    ('019527d0-0000-7000-8000-00000000001a', '019527c0-0000-7000-8000-00000000000f', 3, 'Jeju Island', 'Hallasan, Seongsan Ilchulbong', 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 9. TourDayActivities
-- ------------------------------------------------------------
INSERT INTO "TourDayActivities" ("Id", "TourDayId", "Order", "ActivityType", "Title", "Description", "IsOptional", "StartTime", "EndTime", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527e0-0000-7000-8000-000000000001', '019527d0-0000-7000-8000-000000000001', 1, 'Sightseeing', 'Di chuyển Hà Nội - Hạ Long', NULL, FALSE, '07:00', '10:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000002', '019527d0-0000-7000-8000-000000000001', 2, 'Sightseeing', 'Tham quan Hang Sửng Sốt', NULL, FALSE, '14:00', '16:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000003', '019527d0-0000-7000-8000-000000000001', 3, 'Accommodation', 'Nghỉ đêm trên tàu', NULL, FALSE, '18:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000004', '019527d0-0000-7000-8000-000000000002', 1, 'Adventure', 'Chèo kayak Bãi Ti Tốp', NULL, FALSE, '08:00', '10:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000005', '019527d0-0000-7000-8000-000000000002', 2, 'Sightseeing', 'Hang Thiên Cung', NULL, FALSE, '14:00', '15:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000006', '019527d0-0000-7000-8000-000000000002', 3, 'Accommodation', 'Nghỉ đêm trên tàu', NULL, FALSE, '18:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000007', '019527d0-0000-7000-8000-000000000003', 1, 'Transportation', 'Về Hà Nội', NULL, FALSE, '08:00', '11:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000008', '019527d0-0000-7000-8000-000000000004', 1, 'Sightseeing', 'Bãi biển Mỹ Khê', NULL, FALSE, '09:00', '11:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000009', '019527d0-0000-7000-8000-000000000004', 2, 'Sightseeing', 'Cầu Rồng', NULL, FALSE, '19:00', '21:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000a', '019527d0-0000-7000-8000-000000000004', 3, 'Accommodation', 'Khách sạn Đà Nẵng', NULL, FALSE, '21:30', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000b', '019527d0-0000-7000-8000-000000000005', 1, 'Sightseeing', 'Cầu Vàng & Bà Nà Hills', NULL, FALSE, '08:00', '16:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000c', '019527d0-0000-7000-8000-000000000005', 2, 'Accommodation', 'Khách sạn Đà Nẵng', NULL, FALSE, '18:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000d', '019527d0-0000-7000-8000-000000000006', 1, 'Cultural', 'Phố cổ Hội An', NULL, FALSE, '09:00', '17:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000e', '019527d0-0000-7000-8000-000000000006', 2, 'Dining', 'Ẩm thực Hội An', 'Thưởng thức cao lầu, mì Quảng, bánh mì Phượng', FALSE, '18:00', '20:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000000f', '019527d0-0000-7000-8000-000000000007', 1, 'Sightseeing', 'Ngũ Hành Sơn & Chùa Linh Ứng', NULL, FALSE, '08:00', '12:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000010', '019527d0-0000-7000-8000-000000000008', 1, 'Cultural', 'Grand Palace & Wat Phra Kaew', 'Explore the magnificent Grand Palace complex', FALSE, '09:00', '12:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000011', '019527d0-0000-7000-8000-000000000008', 2, 'Cultural', 'Wat Pho', 'Visit the Temple of the Reclining Buddha', FALSE, '13:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000012', '019527d0-0000-7000-8000-000000000008', 3, 'Accommodation', 'Bangkok City Hotel', NULL, FALSE, '18:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000013', '019527d0-0000-7000-8000-000000000009', 1, 'Shopping', 'Chatuchak Weekend Market', 'One of the largest markets in the world', TRUE, '09:00', '12:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000014', '019527d0-0000-7000-8000-000000000009', 2, 'Transportation', 'Transfer to Pattaya', NULL, FALSE, '13:00', '15:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000015', '019527d0-0000-7000-8000-000000000009', 3, 'Accommodation', 'Pattaya Beach Resort', NULL, FALSE, '16:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000016', '019527d0-0000-7000-8000-00000000000a', 1, 'Adventure', 'Coral Island (Koh Larn)', 'Snorkeling and beach activities', FALSE, '09:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000017', '019527d0-0000-7000-8000-00000000000a', 2, 'Sightseeing', 'Walking Street', 'Experience Pattaya nightlife', TRUE, '20:00', '23:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000018', '019527d0-0000-7000-8000-00000000000b', 1, 'Transportation', 'Return to Bangkok', NULL, FALSE, '08:00', '10:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000019', '019527d0-0000-7000-8000-00000000000c', 1, 'Cultural', 'Sensō-ji Temple', 'Tokyos oldest and most significant temple', FALSE, '09:00', '11:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001a', '019527d0-0000-7000-8000-00000000000c', 2, 'Sightseeing', 'Tokyo Skytree', 'Panoramic views from 634m observation deck', FALSE, '13:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001b', '019527d0-0000-7000-8000-00000000000c', 3, 'Accommodation', 'Tokyo Asakusa Hotel', NULL, FALSE, '17:00', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001c', '019527d0-0000-7000-8000-00000000000d', 1, 'Cultural', 'Meiji Shrine', 'Tranquil shrine in the heart of Shibuya', FALSE, '09:00', '11:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001d', '019527d0-0000-7000-8000-00000000000d', 2, 'Sightseeing', 'Shibuya Crossing', 'Worlds busiest pedestrian crossing', FALSE, '11:30', '13:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001e', '019527d0-0000-7000-8000-00000000000e', 1, 'Sightseeing', 'Mount Fuji 5th Station', 'Day trip to Japans iconic mountain', FALSE, '07:00', '17:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000001f', '019527d0-0000-7000-8000-00000000000f', 1, 'Transportation', 'Shinkansen to Osaka', 'Bullet train experience (2.5 hours)', FALSE, '08:00', '10:30', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000020', '019527d0-0000-7000-8000-00000000000f', 2, 'Sightseeing', 'Osaka Castle', 'Historic castle and museum', FALSE, '12:00', '14:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000021', '019527d0-0000-7000-8000-00000000000f', 3, 'Dining', 'Dotonbori', 'Street food paradise: takoyaki, okonomiyaki', FALSE, '18:00', '21:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000022', '019527d0-0000-7000-8000-00000000000f', 4, 'Accommodation', 'Osaka Namba Hotel', NULL, FALSE, '21:30', NULL, 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000023', '019527d0-0000-7000-8000-000000000010', 1, 'Cultural', 'Fushimi Inari Shrine', 'Thousands of vermillion torii gates', FALSE, '08:00', '11:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000024', '019527d0-0000-7000-8000-000000000010', 2, 'Cultural', 'Kinkaku-ji (Golden Pavilion)', 'Iconic gold-leaf covered temple', FALSE, '13:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000025', '019527d0-0000-7000-8000-000000000011', 1, 'Relaxation', 'Bãi Sao', 'Bãi biển đẹp nhất Phú Quốc', FALSE, '10:00', '16:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000026', '019527d0-0000-7000-8000-000000000012', 1, 'Sightseeing', 'Vinpearl Safari Phú Quốc', 'Vườn thú mở lớn nhất Việt Nam', FALSE, '09:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000027', '019527d0-0000-7000-8000-000000000013', 1, 'Adventure', 'Lặn san hô An Thới', 'Ngắm san hô và cá nhiệt đới', FALSE, '08:00', '14:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000028', '019527d0-0000-7000-8000-000000000014', 1, 'Sightseeing', 'Bản Cát Cát', 'Trekking bản làng người HMông', FALSE, '09:00', '15:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000029', '019527d0-0000-7000-8000-000000000015', 1, 'Adventure', 'Chinh phục Fansipan', 'Đỉnh Fansipan 3143m bằng cáp treo', FALSE, '08:00', '12:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002a', '019527d0-0000-7000-8000-000000000015', 2, 'Sightseeing', 'Ruộng bậc thang Mường Hoa', 'Thung lũng Mường Hoa', FALSE, '14:00', '17:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002b', '019527d0-0000-7000-8000-000000000016', 1, 'Sightseeing', 'Dinh Độc Lập', 'Di tích lịch sử quốc gia', FALSE, '09:00', '11:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002c', '019527d0-0000-7000-8000-000000000017', 1, 'Cultural', 'Chợ nổi Cái Răng', 'Chợ nổi truyền thống miền Tây', FALSE, '05:00', '08:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002d', '019527d0-0000-7000-8000-000000000018', 1, 'Cultural', 'Gyeongbokgung Palace', 'Royal palace of the Joseon dynasty', FALSE, '09:00', '12:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002e', '019527d0-0000-7000-8000-000000000018', 2, 'Shopping', 'Myeongdong Shopping Street', 'K-beauty, fashion, and street food', FALSE, '14:00', '18:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-00000000002f', '019527d0-0000-7000-8000-000000000019', 1, 'Sightseeing', 'N Seoul Tower', 'Panoramic views of Seoul', FALSE, '10:00', '13:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000030', '019527d0-0000-7000-8000-00000000001a', 1, 'Sightseeing', 'Hallasan National Park', 'UNESCO World Heritage volcanic mountain', FALSE, '07:00', '14:00', 'system', NOW(), 'system', NOW()),
    ('019527e0-0000-7000-8000-000000000031', '019527d0-0000-7000-8000-00000000001a', 2, 'Sightseeing', 'Seongsan Ilchulbong', 'UNESCO sunrise peak, volcanic crater', FALSE, '16:00', '18:00', 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 10. TourPlanLocations
-- ------------------------------------------------------------
INSERT INTO "TourPlanLocations" ("Id", "TourDayActivityId", "LocationName", "LocationType", "City", "Country", "Latitude", "Longitude", "EntranceFee", "EstimatedDurationMinutes", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527f0-0000-7000-8000-000000000001', '019527e0-0000-7000-8000-000000000001', 'Phố cổ Hà Nội', 'TouristAttraction', 'Hà Nội', 'Việt Nam', 21.0333000, 105.8500000, NULL, 60, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000002', '019527e0-0000-7000-8000-000000000001', 'Bến tàu Tuần Châu', 'Other', 'Hạ Long', 'Việt Nam', 20.9101000, 107.0480000, NULL, 30, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000003', '019527e0-0000-7000-8000-000000000002', 'Hang Sửng Sốt', 'TouristAttraction', 'Hạ Long', 'Việt Nam', 20.9000000, 107.1000000, 250000, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000004', '019527e0-0000-7000-8000-000000000004', 'Bãi Ti Tốp', 'Beach', 'Hạ Long', 'Việt Nam', 20.9200000, 107.0800000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000005', '019527e0-0000-7000-8000-000000000005', 'Hang Thiên Cung', 'TouristAttraction', 'Hạ Long', 'Việt Nam', 20.9100000, 107.0700000, 200000, 60, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000006', '019527e0-0000-7000-8000-000000000007', 'Sân bay Nội Bài', 'Airport', 'Hà Nội', 'Việt Nam', 21.2187000, 105.8040000, NULL, NULL, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000007', '019527e0-0000-7000-8000-000000000008', 'Bãi biển Mỹ Khê', 'Beach', 'Đà Nẵng', 'Việt Nam', 16.0544000, 108.2472000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000008', '019527e0-0000-7000-8000-000000000009', 'Cầu Rồng', 'TouristAttraction', 'Đà Nẵng', 'Việt Nam', 16.0610000, 108.2278000, NULL, 60, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000009', '019527e0-0000-7000-8000-00000000000b', 'Cầu Vàng - Bà Nà Hills', 'TouristAttraction', 'Đà Nẵng', 'Việt Nam', 15.9977000, 107.9958000, 900000, 300, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000a', '019527e0-0000-7000-8000-00000000000d', 'Phố cổ Hội An', 'TouristAttraction', 'Hội An', 'Việt Nam', 15.8794000, 108.3350000, 120000, 240, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000b', '019527e0-0000-7000-8000-00000000000e', 'Chợ Hội An', 'Market', 'Hội An', 'Việt Nam', 15.8770000, 108.3380000, NULL, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000c', '019527e0-0000-7000-8000-00000000000f', 'Ngũ Hành Sơn', 'TouristAttraction', 'Đà Nẵng', 'Việt Nam', 16.0042000, 108.2630000, 40000, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000d', '019527e0-0000-7000-8000-00000000000f', 'Chùa Linh Ứng', 'Temple', 'Đà Nẵng', 'Việt Nam', 16.0990000, 108.2770000, NULL, 60, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000e', '019527e0-0000-7000-8000-000000000010', 'Grand Palace', 'Temple', 'Bangkok', 'Thailand', 13.7500000, 100.4914000, 500, 150, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000000f', '019527e0-0000-7000-8000-000000000011', 'Wat Pho', 'Temple', 'Bangkok', 'Thailand', 13.7465000, 100.4930000, 300, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000010', '019527e0-0000-7000-8000-000000000013', 'Chatuchak Market', 'Market', 'Bangkok', 'Thailand', 13.7999000, 100.5504000, NULL, 180, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000011', '019527e0-0000-7000-8000-000000000014', 'Pattaya Beach', 'Beach', 'Pattaya', 'Thailand', 12.9236000, 100.8825000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000012', '019527e0-0000-7000-8000-000000000016', 'Coral Island (Koh Larn)', 'Beach', 'Pattaya', 'Thailand', 12.9167000, 100.7833000, 200, 240, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000013', '019527e0-0000-7000-8000-000000000017', 'Walking Street', 'TouristAttraction', 'Pattaya', 'Thailand', 12.9271000, 100.8730000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000014', '019527e0-0000-7000-8000-000000000019', 'Sensō-ji Temple', 'Temple', 'Tokyo', 'Japan', 35.7148000, 139.7967000, NULL, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000015', '019527e0-0000-7000-8000-00000000001a', 'Tokyo Skytree', 'TouristAttraction', 'Tokyo', 'Japan', 35.7101000, 139.8107000, 2100, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000016', '019527e0-0000-7000-8000-00000000001c', 'Meiji Shrine', 'Temple', 'Tokyo', 'Japan', 35.6764000, 139.6993000, NULL, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000017', '019527e0-0000-7000-8000-00000000001d', 'Shibuya Crossing', 'TouristAttraction', 'Tokyo', 'Japan', 35.6595000, 139.7004000, NULL, 30, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000018', '019527e0-0000-7000-8000-00000000001e', 'Mount Fuji 5th Station', 'NationalPark', 'Hakone', 'Japan', 35.3606000, 138.7274000, 1000, 300, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000019', '019527e0-0000-7000-8000-00000000001f', 'Osaka Station', 'TrainStation', 'Osaka', 'Japan', 34.7024000, 135.4959000, NULL, NULL, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001a', '019527e0-0000-7000-8000-000000000020', 'Osaka Castle', 'TouristAttraction', 'Osaka', 'Japan', 34.6873000, 135.5262000, 600, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001b', '019527e0-0000-7000-8000-000000000021', 'Dotonbori', 'Market', 'Osaka', 'Japan', 34.6687000, 135.5013000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001c', '019527e0-0000-7000-8000-000000000023', 'Fushimi Inari Shrine', 'Temple', 'Kyoto', 'Japan', 34.9671000, 135.7727000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001d', '019527e0-0000-7000-8000-000000000024', 'Kinkaku-ji', 'Temple', 'Kyoto', 'Japan', 35.0394000, 135.7292000, 500, 60, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001e', '019527e0-0000-7000-8000-000000000025', 'Bãi Sao', 'Beach', 'Phú Quốc', 'Việt Nam', 10.0415000, 104.0295000, NULL, 240, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000001f', '019527e0-0000-7000-8000-000000000026', 'Vinpearl Safari Phú Quốc', 'TouristAttraction', 'Phú Quốc', 'Việt Nam', 10.3312000, 103.8623000, 650000, 300, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000020', '019527e0-0000-7000-8000-000000000027', 'Quần đảo An Thới', 'Beach', 'Phú Quốc', 'Việt Nam', 9.9500000, 104.0300000, 350000, 240, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000021', '019527e0-0000-7000-8000-000000000028', 'Bản Cát Cát', 'TouristAttraction', 'Sapa', 'Việt Nam', 22.3322000, 103.8374000, 70000, 240, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000022', '019527e0-0000-7000-8000-000000000029', 'Đỉnh Fansipan', 'NationalPark', 'Sapa', 'Việt Nam', 22.3033000, 103.7750000, 700000, 180, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000023', '019527e0-0000-7000-8000-00000000002a', 'Thung lũng Mường Hoa', 'TouristAttraction', 'Sapa', 'Việt Nam', 22.3100000, 103.8600000, NULL, 180, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000024', '019527e0-0000-7000-8000-00000000002b', 'Dinh Độc Lập', 'Museum', 'TP. Hồ Chí Minh', 'Việt Nam', 10.7769000, 106.6953000, 65000, 90, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000025', '019527e0-0000-7000-8000-00000000002c', 'Chợ nổi Cái Răng', 'Market', 'Cần Thơ', 'Việt Nam', 10.0186000, 105.7471000, NULL, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000026', '019527e0-0000-7000-8000-00000000002d', 'Gyeongbokgung Palace', 'Temple', 'Seoul', 'South Korea', 37.5796000, 126.9770000, 3000, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000027', '019527e0-0000-7000-8000-00000000002e', 'Myeongdong Shopping Street', 'Market', 'Seoul', 'South Korea', 37.5636000, 126.9863000, NULL, 180, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000028', '019527e0-0000-7000-8000-00000000002f', 'N Seoul Tower', 'TouristAttraction', 'Seoul', 'South Korea', 37.5512000, 126.9882000, 16000, 120, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-000000000029', '019527e0-0000-7000-8000-000000000030', 'Hallasan National Park', 'NationalPark', 'Jeju', 'South Korea', 33.3617000, 126.5292000, NULL, 360, 'system', NOW(), 'system', NOW()),
    ('019527f0-0000-7000-8000-00000000002a', '019527e0-0000-7000-8000-000000000031', 'Seongsan Ilchulbong', 'TouristAttraction', 'Jeju', 'South Korea', 33.4590000, 126.9425000, 5000, 120, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 11. TourPlanRoutes
-- ------------------------------------------------------------
INSERT INTO "TourPlanRoutes" ("Id", "TourDayActivityId", "Order", "TransportationType", "TransportationName", "FromLocationId", "ToLocationId", "DistanceKm", "DurationMinutes", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('01952800-0000-7000-8000-000000000001', '019527e0-0000-7000-8000-000000000001', 1, 'Bus', 'Xe khách Hà Nội - Hạ Long', '019527f0-0000-7000-8000-000000000001', '019527f0-0000-7000-8000-000000000002', 170, 210, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000002', '019527e0-0000-7000-8000-000000000007', 1, 'Bus', 'Xe khách Hạ Long - Hà Nội', '019527f0-0000-7000-8000-000000000002', '019527f0-0000-7000-8000-000000000006', 170, 210, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000003', '019527e0-0000-7000-8000-00000000000b', 1, 'Bus', 'Xe đưa đón Bà Nà', '019527f0-0000-7000-8000-000000000007', '019527f0-0000-7000-8000-000000000009', 25, 40, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000004', '019527e0-0000-7000-8000-00000000000d', 1, 'Bus', 'Xe Đà Nẵng - Hội An', '019527f0-0000-7000-8000-000000000009', '019527f0-0000-7000-8000-00000000000a', 55, 70, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000005', '019527e0-0000-7000-8000-00000000000f', 1, 'Bus', 'Xe Hội An - Ngũ Hành Sơn', '019527f0-0000-7000-8000-00000000000a', '019527f0-0000-7000-8000-00000000000c', 20, 30, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000006', '019527e0-0000-7000-8000-000000000011', 1, 'Walking', NULL, '019527f0-0000-7000-8000-00000000000e', '019527f0-0000-7000-8000-00000000000f', 1, 15, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000007', '019527e0-0000-7000-8000-000000000014', 1, 'Bus', 'Coach Bangkok - Pattaya', '019527f0-0000-7000-8000-000000000010', '019527f0-0000-7000-8000-000000000011', 150, 150, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000008', '019527e0-0000-7000-8000-000000000016', 1, 'Boat', 'Speedboat to Coral Island', '019527f0-0000-7000-8000-000000000011', '019527f0-0000-7000-8000-000000000012', 7, 30, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000009', '019527e0-0000-7000-8000-000000000018', 1, 'Bus', 'Coach Pattaya - Bangkok', '019527f0-0000-7000-8000-000000000011', '019527f0-0000-7000-8000-00000000000e', 150, 150, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000a', '019527e0-0000-7000-8000-00000000001a', 1, 'Walking', NULL, '019527f0-0000-7000-8000-000000000014', '019527f0-0000-7000-8000-000000000015', 2, 25, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000b', '019527e0-0000-7000-8000-00000000001d', 1, 'Walking', NULL, '019527f0-0000-7000-8000-000000000016', '019527f0-0000-7000-8000-000000000017', 1, 15, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000c', '019527e0-0000-7000-8000-00000000001e', 1, 'Bus', 'Highway bus to Mt. Fuji', '019527f0-0000-7000-8000-000000000015', '019527f0-0000-7000-8000-000000000018', 100, 150, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000d', '019527e0-0000-7000-8000-00000000001e', 2, 'Bus', 'Return from Mt. Fuji', '019527f0-0000-7000-8000-000000000018', '019527f0-0000-7000-8000-000000000015', 100, 150, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000e', '019527e0-0000-7000-8000-00000000001f', 1, 'Train', 'Shinkansen Nozomi', '019527f0-0000-7000-8000-000000000015', '019527f0-0000-7000-8000-000000000019', 515, 150, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-00000000000f', '019527e0-0000-7000-8000-000000000023', 1, 'Train', 'JR Nara Line', '019527f0-0000-7000-8000-000000000019', '019527f0-0000-7000-8000-00000000001c', 50, 40, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000010', '019527e0-0000-7000-8000-000000000024', 1, 'Bus', 'City bus to Kinkaku-ji', '019527f0-0000-7000-8000-00000000001c', '019527f0-0000-7000-8000-00000000001d', 12, 25, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000011', '019527e0-0000-7000-8000-000000000027', 1, 'Boat', 'Tàu ra quần đảo An Thới', '019527f0-0000-7000-8000-00000000001e', '019527f0-0000-7000-8000-000000000020', 15, 30, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000012', '019527e0-0000-7000-8000-00000000002c', 1, 'Bus', 'Xe khách TP.HCM - Cần Thơ', '019527f0-0000-7000-8000-000000000024', '019527f0-0000-7000-8000-000000000025', 170, 210, 'system', NOW(), 'system', NOW()),
    ('01952800-0000-7000-8000-000000000013', '019527e0-0000-7000-8000-000000000030', 1, 'Flight', 'Korean Air Seoul - Jeju', '019527f0-0000-7000-8000-000000000028', '019527f0-0000-7000-8000-000000000029', 450, 70, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 12. TourPlanAccommodations
-- ------------------------------------------------------------
INSERT INTO "TourPlanAccommodations" ("Id", "TourDayActivityId", "AccommodationName", "RoomType", "RoomCapacity", "MealsIncluded", "CheckInTime", "CheckOutTime", "City", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('01952810-0000-7000-8000-000000000001', '019527e0-0000-7000-8000-000000000003', 'Tàu Hạ Long Bay Cruise 3 sao', 'Double', 2, 'BreakfastAndDinner', '18:00', '08:00', 'Hạ Long', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000002', '019527e0-0000-7000-8000-000000000006', 'Tàu Hạ Long Bay Cruise 3 sao', 'Double', 2, 'BreakfastAndDinner', '18:00', '08:00', 'Hạ Long', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000003', '019527e0-0000-7000-8000-00000000000a', 'Mỹ Khê Beach Hotel 3 sao', 'Double', 2, 'Breakfast', '14:00', '12:00', 'Đà Nẵng', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000004', '019527e0-0000-7000-8000-00000000000c', 'Mỹ Khê Beach Hotel 3 sao', 'Double', 2, 'Breakfast', '14:00', '12:00', 'Đà Nẵng', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000005', '019527e0-0000-7000-8000-000000000012', 'Bangkok City Hotel', 'Double', 2, 'Breakfast', '14:00', '12:00', 'Bangkok', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000006', '019527e0-0000-7000-8000-000000000015', 'Pattaya Beach Resort', 'Double', 2, 'Breakfast', '14:00', '12:00', 'Pattaya', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000007', '019527e0-0000-7000-8000-00000000001b', 'Tokyo Asakusa Hotel', 'Double', 2, 'Breakfast', '15:00', '11:00', 'Tokyo', 'system', NOW(), 'system', NOW()),
    ('01952810-0000-7000-8000-000000000008', '019527e0-0000-7000-8000-000000000022', 'Osaka Namba Hotel', 'Double', 2, 'Breakfast', '15:00', '11:00', 'Osaka', 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 13. Reviews (bilingual: VN + EN)
-- ------------------------------------------------------------
INSERT INTO "Reviews" ("Id", "UserId", "TourId", "Rating", "Comment", "IsApproved", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('01952820-0000-7000-8000-000000000001', '019527a0-0000-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000001', 5, 'Vịnh Hạ Long quá đẹp! Tàu sạch sẽ, ăn ngon, hướng dẫn viên nhiệt tình. Chắc chắn sẽ quay lại.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000002', '019527a0-0000-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000002', 4, 'Cầu Vàng Bà Nà thật ấn tượng, phố cổ Hội An lung linh. Hơi nóng nhưng tour tổ chức rất tốt.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000003', '019527a0-0000-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000001', 4, 'Tour Hạ Long 3 ngày 2 đêm trải nghiệm tuyệt vời. Kayak rất vui, hang Sửng Sốt hùng vĩ.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000004', '019527a0-0000-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000003', 5, 'Phú Quốc xứng đáng là đảo ngọc! Bãi Sao cát trắng mịn, nước biển trong vắt, safari thú vị.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000005', '019527a0-0000-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000004', 5, 'Sapa mùa lúa chín đẹp mê hồn. Fansipan hùng vĩ, bản Cát Cát bình yên. Tour rất đáng tiền.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000006', '019527a0-0000-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000002', 5, 'Đà Nẵng - Hội An là chuyến đi đáng nhớ nhất năm. Mỹ Khê bãi biển đẹp, Hội An đêm lung linh.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000007', '019527a0-0000-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000004', 4, 'Sapa trekking rất thú vị, người HMông thân thiện. Cáp treo Fansipan nhanh, view đẹp.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000008', '019527a0-0000-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000003', 5, 'Phú Quốc lặn biển cực đỉnh! San hô đẹp, cá nhiều, resort ven biển thoải mái.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-000000000009', '019527a0-0000-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000006', 4, 'Bangkok was amazing! Grand Palace is breathtaking. Pattaya beach was relaxing. Great value tour.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000a', '019527a0-0000-7000-8000-000000000009', '019527b0-0000-7000-8000-000000000007', 5, 'Best trip ever! Cherry blossoms in Tokyo were magical. Shinkansen was an incredible experience.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000b', '019527a0-0000-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000006', 4, 'Thailand tour was well organized. Coral Island snorkeling was the highlight. Food was excellent.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000c', '019527a0-0000-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000007', 5, 'Mount Fuji day trip was unforgettable. Osaka street food in Dotonbori was delicious. Highly recommend!', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000d', '019527a0-0000-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000008', 4, 'Seoul and Jeju were fantastic! Gyeongbokgung Palace was stunning. Hallasan hike was challenging but rewarding.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000e', '019527a0-0000-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000008', 5, 'Korea exceeded all expectations! Myeongdong shopping was fun, Jejus volcanic landscape is unique.', TRUE, 'system', NOW(), 'system', NOW()),
    ('01952820-0000-7000-8000-00000000000f', '019527a0-0000-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000002', 4, 'Đà Nẵng tour was great, Hội An ancient town at night is magical. Bà Nà Golden Bridge is a must-see!', TRUE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

