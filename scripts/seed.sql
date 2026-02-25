-- ============================================================
-- SEED DATA - Pathora / Panthora
-- PostgreSQL
-- Tất cả mật khẩu: Admin@123 (BCrypt cost 11)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Departments
--    Level 1: Công ty
--    Level 2: Phòng ban
--    Level 3: Tổ / Nhóm
-- ------------------------------------------------------------
INSERT INTO "Departments" ("Id", "ParentId", "Name", "Level", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    -- Level 1
    ('019527a0-0000-7000-8000-000000000020', NULL,                                   'Công ty TNHH Pathora',        1, FALSE, 'system', NOW(), 'system', NOW()),
    -- Level 2
    ('019527a0-0000-7000-8000-000000000021', '019527a0-0000-7000-8000-000000000020', 'Phòng Kinh doanh',            2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000022', '019527a0-0000-7000-8000-000000000020', 'Phòng Kỹ thuật',              2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000023', '019527a0-0000-7000-8000-000000000020', 'Phòng Hành chính - HR',       2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000024', '019527a0-0000-7000-8000-000000000020', 'Phòng Kế toán',               2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000025', '019527a0-0000-7000-8000-000000000020', 'Phòng Tour & Điều hành',      2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000026', '019527a0-0000-7000-8000-000000000020', 'Phòng Marketing',             2, FALSE, 'system', NOW(), 'system', NOW()),
    -- Level 3
    ('019527a0-0000-7000-8000-000000000027', '019527a0-0000-7000-8000-000000000021', 'Tổ Kinh doanh trong nước',   3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000028', '019527a0-0000-7000-8000-000000000021', 'Tổ Kinh doanh quốc tế',      3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000029', '019527a0-0000-7000-8000-000000000025', 'Tổ Điều hành tour',          3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-00000000002a', '019527a0-0000-7000-8000-000000000025', 'Tổ Hướng dẫn viên',          3, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 2. Positions
--    Level: 1-6 (cao → thấp)
--    Type: 1 = Quản lý, 2 = Nhân viên
-- ------------------------------------------------------------
INSERT INTO "Positions" ("Id", "Name", "Level", "Note", "Type", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000030', 'Giám đốc',               1, NULL,                        1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000031', 'Phó giám đốc',           2, NULL,                        1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000032', 'Trưởng phòng',           3, NULL,                        1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000033', 'Phó phòng',              4, NULL,                        1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000034', 'Nhân viên kinh doanh',   5, 'Phụ trách bán tour',        2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000035', 'Nhân viên điều hành',    5, 'Phụ trách vận hành tour',   2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000036', 'Hướng dẫn viên',         5, 'HDV nội địa & quốc tế',    2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000037', 'Nhân viên kế toán',      5, NULL,                        2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000038', 'Nhân viên IT',           5, NULL,                        2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000039', 'Nhân viên marketing',    5, NULL,                        2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000040', 'Thực tập sinh',          6, NULL,                        2, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 3. Roles (KHÔNG insert Admin - đã có sẵn với ID: 019c91cd-29d3-7969-a60c-60b9677ac385)
--    Type: 1 = Hệ thống, 2 = Nghiệp vụ
--    Status: 1 = Active, 2 = Inactive
-- ------------------------------------------------------------
INSERT INTO "Roles" ("Id", "Name", "Description", "Type", "Status", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000011', 'Administrator',    'Quản trị viên hệ thống',            1, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000012', 'Staff',            'Nhân viên nghiệp vụ',               2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000013', 'View Only',        'Chỉ xem, không chỉnh sửa',          2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000014', 'Tour Manager',     'Quản lý tour & điều hành',          2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000015', 'Sales',            'Nhân viên kinh doanh bán tour',     2, 1, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4. Users  (password: Admin@123)
-- ------------------------------------------------------------
INSERT INTO "Users" ("Id", "Username", "FullName", "Email", "Password", "Avatar", "ForcePasswordChange", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    -- admin đã có sẵn, bỏ qua nhờ ON CONFLICT
    ('019527a0-0000-7000-8000-000000000001', 'admin',          'Super Admin',           'admin@pathora.vn',        '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    -- Quản lý
    ('019527a0-0000-7000-8000-000000000002', 'nguyen.van.a',   'Nguyễn Văn An',         'nguyen.van.a@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000003', 'tran.thi.b',     'Trần Thị Bình',         'tran.thi.b@pathora.vn',   '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    -- Tour Manager
    ('019527a0-0000-7000-8000-000000000004', 'le.van.c',       'Lê Văn Cường',          'le.van.c@pathora.vn',     '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000005', 'pham.thi.d',     'Phạm Thị Dung',         'pham.thi.d@pathora.vn',   '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    -- Sales
    ('019527a0-0000-7000-8000-000000000006', 'hoang.van.e',    'Hoàng Văn Em',          'hoang.van.e@pathora.vn',  '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000007', 'nguyen.thi.f',   'Nguyễn Thị Phương',     'nguyen.thi.f@pathora.vn', '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    -- Staff
    ('019527a0-0000-7000-8000-000000000008', 'do.van.g',       'Đỗ Văn Giang',          'do.van.g@pathora.vn',     '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000009', 'vu.thi.h',       'Vũ Thị Hoa',            'vu.thi.h@pathora.vn',     '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, FALSE, FALSE, 'system', NOW(), 'system', NOW()),
    -- View Only
    ('019527a0-0000-7000-8000-00000000000a', 'bui.van.i',      'Bùi Văn Ích',           'bui.van.i@pathora.vn',    '$2a$11$eBZuLdJbKfqgCWTcfijXFehZ0.A.NN3KiEjAqAzamOEUGmDajJLCi', NULL, TRUE,  FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 5. UserRoles
-- ------------------------------------------------------------
INSERT INTO "UserRoles" ("UserId", "RoleId")
VALUES
    -- admin → Admin role (ID thật từ DB)
    ('019527a0-0000-7000-8000-000000000001', '019c91cd-29d3-7969-a60c-60b9677ac385'),
    -- Nguyễn Văn An → Administrator
    ('019527a0-0000-7000-8000-000000000002', '019527a0-0000-7000-8000-000000000011'),
    -- Trần Thị Bình → Administrator
    ('019527a0-0000-7000-8000-000000000003', '019527a0-0000-7000-8000-000000000011'),
    -- Lê Văn Cường → Tour Manager
    ('019527a0-0000-7000-8000-000000000004', '019527a0-0000-7000-8000-000000000014'),
    -- Phạm Thị Dung → Tour Manager
    ('019527a0-0000-7000-8000-000000000005', '019527a0-0000-7000-8000-000000000014'),
    -- Hoàng Văn Em → Sales
    ('019527a0-0000-7000-8000-000000000006', '019527a0-0000-7000-8000-000000000015'),
    -- Nguyễn Thị Phương → Sales
    ('019527a0-0000-7000-8000-000000000007', '019527a0-0000-7000-8000-000000000015'),
    -- Đỗ Văn Giang → Staff
    ('019527a0-0000-7000-8000-000000000008', '019527a0-0000-7000-8000-000000000012'),
    -- Vũ Thị Hoa → Staff
    ('019527a0-0000-7000-8000-000000000009', '019527a0-0000-7000-8000-000000000012'),
    -- Bùi Văn Ích → View Only
    ('019527a0-0000-7000-8000-00000000000a', '019527a0-0000-7000-8000-000000000013')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 6. Tours
--    Status: 'Active' | 'Inactive' | 'Pending' | 'Rejected'
-- ------------------------------------------------------------
INSERT INTO "Tours" ("Id", "TourCode", "TourName", "ShortDescription", "LongDescription", "Status", "IsDeleted", "SEOTitle", "SEODescription", "Thumbnail_FileId", "Thumbnail_OriginalFileName", "Thumbnail_FileName", "Thumbnail_PublicURL", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527b0-0000-7000-8000-000000000001',
     'VN-HN-HL-3N2D',
     'Hà Nội - Hạ Long 3 Ngày 2 Đêm',
     'Khám phá vịnh Hạ Long huyền bí với hàng nghìn đảo đá vôi kỳ vĩ.',
     'Tour Hà Nội - Hạ Long 3N2Đ đưa bạn qua cung đường ven biển thơ mộng, thăm các hang động nổi tiếng như hang Sửng Sốt, Thiên Cung, trải nghiệm chèo kayak và tắm biển tại bãi Ti Tốp. Đêm ngủ trên thuyền giữa vịnh là trải nghiệm không thể quên.',
     'Active', FALSE,
     'Tour Hà Nội Hạ Long 3N2Đ - Khám phá vịnh di sản thế giới',
     'Đặt tour Hà Nội - Hạ Long 3 ngày 2 đêm giá tốt. Ngủ thuyền, khám phá hang động, chèo kayak.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000002',
     'VN-DN-HA-4N3D',
     'Đà Nẵng - Hội An - Bà Nà 4 Ngày 3 Đêm',
     'Hành trình miền Trung quyến rũ: phố cổ Hội An, cầu Vàng Bà Nà và biển Mỹ Khê.',
     'Khởi hành từ Đà Nẵng, tour đưa du khách tham quan cầu Vàng trên đỉnh Bà Nà Hills, dạo phố cổ Hội An về đêm lung linh đèn lồng, thăm thánh địa Mỹ Sơn và thư giãn tại bãi biển Mỹ Khê được bình chọn đẹp nhất châu Á.',
     'Active', FALSE,
     'Tour Đà Nẵng Hội An 4N3Đ - Cầu Vàng & Phố cổ',
     'Tour Đà Nẵng - Hội An 4 ngày 3 đêm. Cầu Vàng Bà Nà, phố cổ Hội An, biển Mỹ Khê.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000003',
     'VN-PQ-5N4D',
     'Phú Quốc Đảo Ngọc 5 Ngày 4 Đêm',
     'Thiên đường biển đảo Phú Quốc - biển xanh, cát trắng, nắng vàng.',
     'Tour Phú Quốc 5N4Đ bao gồm tham quan Vinpearl Safari, lặn ngắm san hô tại quần đảo An Thới, thăm làng chài Hàm Ninh, tham quan vườn tiêu và nước mắm nổi tiếng. Nghỉ dưỡng tại resort 4 sao ven biển.',
     'Active', FALSE,
     'Tour Phú Quốc 5N4Đ - Đảo Ngọc nghỉ dưỡng resort',
     'Tour Phú Quốc 5 ngày 4 đêm. Safari, lặn biển, resort 4 sao - trọn gói.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000004',
     'VN-SP-3N2D',
     'Sapa - Bản Cát Cát - Fansipan 3 Ngày 2 Đêm',
     'Chinh phục nóc nhà Đông Dương, trekking bản làng và ngắm ruộng bậc thang.',
     'Tour Sapa 3N2Đ chinh phục đỉnh Fansipan bằng cáp treo, trekking bản Cát Cát ngắm thác nước và nhà cổ người H''Mông, tham quan ruộng bậc thang Mường Hoa mùa lúa chín vàng ươm.',
     'Active', FALSE,
     'Tour Sapa Fansipan 3N2Đ - Trekking bản làng',
     'Tour Sapa 3 ngày 2 đêm. Fansipan cáp treo, bản Cát Cát, ruộng bậc thang Mường Hoa.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW()),

    ('019527b0-0000-7000-8000-000000000005',
     'VN-HCM-CT-PQ-5N4D',
     'TP.HCM - Cần Thơ - Phú Quốc 5 Ngày 4 Đêm',
     'Hành trình miền Tây sông nước kết hợp nghỉ dưỡng đảo ngọc Phú Quốc.',
     'Tour kết hợp khám phá miền Tây sông nước: chợ nổi Cái Răng, vườn trái cây Cái Mơn, làng nghề đan lát Mỹ Lồng và chèo xuồng trên kênh rạch. Sau đó bay ra Phú Quốc tận hưởng 2 đêm resort biển.',
     'Pending', FALSE,
     'Tour TP.HCM Cần Thơ Phú Quốc 5N4Đ - Miền Tây & Biển đảo',
     'Tour miền Tây + Phú Quốc 5 ngày 4 đêm. Chợ nổi Cái Răng, trái cây, resort biển.',
     NULL, NULL, NULL, NULL,
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 7. TourClassifications (2 loại/tour)
-- ------------------------------------------------------------
INSERT INTO "TourClassifications" ("Id", "TourId", "Name", "Price", "SalePrice", "Description", "DurationDays", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    -- Tour Hạ Long
    ('019527c0-0000-7000-8000-000000000001', '019527b0-0000-7000-8000-000000000001', 'Tiêu chuẩn',    3500000, 3200000, 'Phòng đôi tiêu chuẩn trên tàu 3 sao, bữa ăn theo chương trình.',   3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000001', 'Cao cấp',       5500000, 5000000, 'Cabin đôi deluxe trên tàu 5 sao, bữa ăn cao cấp, spa trên tàu.',   3, 'system', NOW(), 'system', NOW()),
    -- Tour Đà Nẵng
    ('019527c0-0000-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000002', 'Tiêu chuẩn',    4200000, 3900000, 'Khách sạn 3 sao trung tâm Đà Nẵng, bữa sáng.',                     4, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000002', 'Cao cấp',       6800000, 6200000, 'Resort 5 sao Đà Nẵng, bữa sáng buffet, đón tiễn riêng.',           4, 'system', NOW(), 'system', NOW()),
    -- Tour Phú Quốc
    ('019527c0-0000-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000003', 'Tiêu chuẩn',    5800000, 5500000, 'Resort 3 sao Phú Quốc, bữa sáng.',                                 5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000003', 'Hạng sang',     9500000, 8800000, 'Resort 5 sao beachfront, bán trú + tối, dịch vụ butler.',           5, 'system', NOW(), 'system', NOW()),
    -- Tour Sapa
    ('019527c0-0000-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000004', 'Tiêu chuẩn',    2800000, 2500000, 'Khách sạn 3 sao Sapa Town, bữa sáng.',                             3, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000004', 'Cao cấp',       4500000, 4200000, 'Khách sạn 4 sao view núi, bữa sáng + tối, cáp treo Fansipan.',    3, 'system', NOW(), 'system', NOW()),
    -- Tour HCM - Cần Thơ - Phú Quốc
    ('019527c0-0000-7000-8000-000000000009', '019527b0-0000-7000-8000-000000000005', 'Tiêu chuẩn',    6200000, 5800000, 'Khách sạn 3 sao, bữa sáng, vé máy bay HCM - Phú Quốc.',           5, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000010', '019527b0-0000-7000-8000-000000000005', 'Cao cấp',       9800000, 9000000, 'Resort 4 sao Phú Quốc, bán trú, vé máy bay, đưa đón chuyên xe.', 5, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;
