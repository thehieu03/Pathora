-- ============================================================
-- SEED DATA - Pathora / Panthora
-- PostgreSQL
-- Bilingual: Vietnamese (VN) + English (EN)
-- ============================================================
-- Bao gồm TẤT CẢ các bảng kể cả bảng account & role & function
-- ============================================================

-- ============================================================
-- CLEANUP: Delete ALL data (child → parent, respect FK)
-- ============================================================
DELETE FROM "TourInstancePricingTiers";
DELETE FROM "TourInstanceImages";
DELETE FROM "CustomerPayments";
DELETE FROM "CustomerDeposits";
DELETE FROM "Bookings";
DELETE FROM "TourRequests";
DELETE FROM "TourInstances";
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
DELETE FROM "LogErrors";
DELETE FROM "RoleFunctions";
DELETE FROM "UserRoles";
DELETE FROM "RefreshTokens";
DELETE FROM "Registers";
DELETE FROM "Otps";
DELETE FROM "Users";
DELETE FROM "Roles";
DELETE FROM "Functions";
DELETE FROM "SystemKeys";

-- ============================================================
-- Reset auto-increment sequences cho các bảng int PK
-- ============================================================
ALTER SEQUENCE "Roles_Id_seq" RESTART WITH 1;
ALTER SEQUENCE "Functions_Id_seq" RESTART WITH 1;
ALTER SEQUENCE "SystemKeys_Id_seq" RESTART WITH 1;
ALTER SEQUENCE "LogErrors_Id_seq" RESTART WITH 1;

-- ============================================================
-- A1. Roles (int PK, auto-increment)
--     Type: 9=System/Admin, 1=Manager, 2=Staff, 3=Customer
--     Status: 1=Active, 2=Inactive
-- ============================================================
INSERT INTO "Roles" ("Name", "Description", "Type", "Status", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('SuperAdmin',         'Quản trị viên cao nhất hệ thống, toàn quyền',            9, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('Admin',              'Quản trị viên, quản lý hệ thống',                         9, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('TourManager',        'Trưởng phòng Tour & Điều hành',                           1, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('SalesManager',       'Trưởng phòng Kinh doanh',                                 1, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('TourOperator',       'Nhân viên điều hành tour',                                 2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('SalesStaff',         'Nhân viên kinh doanh',                                     2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('TourGuide',          'Hướng dẫn viên du lịch',                                   2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('Accountant',         'Nhân viên kế toán',                                        2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('MarketingStaff',     'Nhân viên marketing',                                      2, 1, FALSE, 'system', NOW(), 'system', NOW()),
    ('Customer',           'Khách hàng đăng ký tài khoản',                             3, 1, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- A2. Functions (int PK, auto-increment)
--     CategoryId: 1=User, 2=Role, 3=Department, 4=Position,
--                 5=Tour, 6=TourInstance, 7=Booking, 8=File
-- ============================================================
INSERT INTO "Functions" ("CategoryId", "ApiUrl", "Description", "Order", "ButtonShow", "IsDeleted")
VALUES
    -- Category 1: User Management
    (1, '/api/user',                'Xem danh sách người dùng',       1, 'IsVisitTab', FALSE),
    (1, '/api/user/{id}',          'Xem chi tiết người dùng',        2, 'IsDetail',   FALSE),
    (1, '/api/user',               'Thêm người dùng',                3, 'IsCreate',   FALSE),
    (1, '/api/user/{id}',          'Cập nhật người dùng',            4, 'IsUpdate',   FALSE),
    (1, '/api/user/change-password','Thay đổi mật khẩu',             5, 'IsResetPass',FALSE),
    (1, '/api/user/{id}',          'Xoá người dùng',                 6, 'IsDelete',   FALSE),

    -- Category 2: Role Management
    (2, '/api/role',               'Xem danh sách nhóm quyền',      1, 'IsVisitTab', FALSE),
    (2, '/api/role/{roleId}',      'Xem chi tiết nhóm quyền',       2, 'IsDetail',   FALSE),
    (2, '/api/role',               'Tạo nhóm quyền',                3, 'IsCreate',   FALSE),
    (2, '/api/role/{roleId}',      'Cập nhật nhóm quyền',           4, 'IsUpdate',   FALSE),
    (2, '/api/role/{roleId}',      'Xoá nhóm quyền',                5, 'IsDelete',   FALSE),

    -- Category 3: Department Management
    (3, '/api/department',         'Xem danh sách phòng ban',        1, 'IsVisitTab', FALSE),
    (3, '/api/department/{id}',    'Xem chi tiết phòng ban',         2, 'IsDetail',   FALSE),
    (3, '/api/department',         'Tạo phòng ban',                  3, 'IsCreate',   FALSE),
    (3, '/api/department/{id}',    'Cập nhật phòng ban',             4, 'IsUpdate',   FALSE),
    (3, '/api/department/{id}',    'Xoá phòng ban',                  5, 'IsDelete',   FALSE),

    -- Category 4: Position Management
    (4, '/api/position',           'Xem danh sách chức vụ',          1, 'IsVisitTab', FALSE),
    (4, '/api/position/{id}',      'Xem chi tiết chức vụ',           2, 'IsDetail',   FALSE),
    (4, '/api/position',           'Tạo chức vụ',                    3, 'IsCreate',   FALSE),
    (4, '/api/position/{id}',      'Cập nhật chức vụ',               4, 'IsUpdate',   FALSE),
    (4, '/api/position/{id}',      'Xoá chức vụ',                    5, 'IsDelete',   FALSE),

    -- Category 5: Tour Management
    (5, '/api/tour',               'Xem danh sách tour',             1, 'IsVisitTab', FALSE),
    (5, '/api/tour/{id}',          'Xem chi tiết tour',              2, 'IsDetail',   FALSE),
    (5, '/api/tour',               'Tạo tour',                       3, 'IsCreate',   FALSE),
    (5, '/api/tour/{id}',          'Cập nhật tour',                  4, 'IsUpdate',   FALSE),
    (5, '/api/tour/{id}',          'Xoá tour',                       5, 'IsDelete',   FALSE),

    -- Category 6: Tour Instance Management
    (6, '/api/tour-instance',      'Xem danh sách đợt tour',         1, 'IsVisitTab', FALSE),
    (6, '/api/tour-instance/{id}', 'Xem chi tiết đợt tour',          2, 'IsDetail',   FALSE),
    (6, '/api/tour-instance',      'Tạo đợt tour',                   3, 'IsCreate',   FALSE),
    (6, '/api/tour-instance/{id}', 'Cập nhật đợt tour',              4, 'IsUpdate',   FALSE),
    (6, '/api/tour-instance/{id}/status', 'Đổi trạng thái đợt tour', 5, 'IsUpdate',   FALSE),
    (6, '/api/tour-instance/{id}', 'Xoá đợt tour',                   6, 'IsDelete',   FALSE),

    -- Category 7: Booking Management
    (7, '/api/booking',            'Xem danh sách booking',          1, 'IsVisitTab', FALSE),
    (7, '/api/booking/{id}',       'Xem chi tiết booking',           2, 'IsDetail',   FALSE),
    (7, '/api/booking',            'Tạo booking',                    3, 'IsCreate',   FALSE),
    (7, '/api/booking/{id}',       'Cập nhật booking',               4, 'IsUpdate',   FALSE),
    (7, '/api/booking/{id}',       'Huỷ booking',                    5, 'IsDelete',   FALSE),

    -- Category 8: File Management
    (8, '/api/file/upload',        'Upload file',                    1, 'IsCreate',   FALSE),
    (8, '/api/file/upload-multiple','Upload nhiều file',             2, 'IsCreate',   FALSE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- A3. SystemKeys
-- ============================================================
INSERT INTO "SystemKeys" ("ParentId", "CodeKey", "CodeValue", "Description", "SortOrder", "IsDeleted")
VALUES
    -- Tour Status
    (0, 'TourStatus',          0, 'Trạng thái Tour',           1, FALSE),
    (1, 'TourStatus_Active',   1, 'Đang hoạt động',            1, FALSE),
    (1, 'TourStatus_Pending',  2, 'Chờ duyệt',                 2, FALSE),
    (1, 'TourStatus_Inactive', 3, 'Ngưng hoạt động',           3, FALSE),

    -- Tour Scope
    (0, 'TourScope',           0, 'Phạm vi Tour',              2, FALSE),
    (5, 'TourScope_Domestic',  1, 'Nội địa',                    1, FALSE),
    (5, 'TourScope_Intl',      2, 'Quốc tế',                    2, FALSE),

    -- Customer Segment
    (0, 'CustomerSegment',     0, 'Phân khúc khách hàng',      3, FALSE),
    (8, 'Segment_Group',       1, 'Đoàn',                       1, FALSE),
    (8, 'Segment_FIT',         2, 'Tự do (FIT)',                2, FALSE),

    -- Booking Status
    (0, 'BookingStatus',       0, 'Trạng thái Booking',        4, FALSE),
    (11,'BookingStatus_Pending',   1, 'Chờ xác nhận',          1, FALSE),
    (11,'BookingStatus_Confirmed', 2, 'Đã xác nhận',           2, FALSE),
    (11,'BookingStatus_Deposited', 3, 'Đã đặt cọc',            3, FALSE),
    (11,'BookingStatus_Paid',      4, 'Đã thanh toán',          4, FALSE),
    (11,'BookingStatus_Cancelled', 5, 'Đã huỷ',                5, FALSE),
    (11,'BookingStatus_Completed', 6, 'Hoàn thành',             6, FALSE),

    -- Payment Method
    (0, 'PaymentMethod',       0, 'Phương thức thanh toán',    5, FALSE),
    (18,'PayMethod_Cash',      1, 'Tiền mặt',                  1, FALSE),
    (18,'PayMethod_Bank',      2, 'Chuyển khoản',              2, FALSE),
    (18,'PayMethod_Card',      3, 'Thẻ tín dụng',              3, FALSE),
    (18,'PayMethod_Momo',      4, 'Momo',                       4, FALSE),
    (18,'PayMethod_VnPay',     5, 'VnPay',                      5, FALSE),

    -- User Status
    (0, 'UserStatus',          0, 'Trạng thái người dùng',     6, FALSE),
    (24,'UserStatus_Active',   0, 'Hoạt động',                  1, FALSE),
    (24,'UserStatus_Inactive', 1, 'Ngưng hoạt động',            2, FALSE),
    (24,'UserStatus_Banned',   2, 'Bị khoá',                    3, FALSE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- A4. Users
--     Password: BCrypt hash of "Admin@123"
--     $2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq
-- ============================================================
INSERT INTO "Users" ("Id", "Username", "FullName", "Email", "PhoneNumber", "AvatarUrl", "Status", "VerifyStatus", "Password", "GoogleId", "Balance", "ForcePasswordChange", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    -- SuperAdmin
    ('019aec79-4dcc-73e9-aaca-17f30bdf76f3',
     'admin', 'Quản trị viên', 'admin@pathora.vn', '0901000001', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Tour Manager
    ('019527a0-0000-7000-8000-000000000101',
     'tourmgr', 'Nguyễn Văn Hùng', 'hung.nv@pathora.vn', '0901000002', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Sales Manager
    ('019527a0-0000-7000-8000-000000000102',
     'salesmgr', 'Trần Thị Mai', 'mai.tt@pathora.vn', '0901000003', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Tour Operator
    ('019527a0-0000-7000-8000-000000000103',
     'operator01', 'Lê Minh Tuấn', 'tuan.lm@pathora.vn', '0901000004', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Sales Staff
    ('019527a0-0000-7000-8000-000000000104',
     'sales01', 'Phạm Thuỳ Linh', 'linh.pt@pathora.vn', '0901000005', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Tour Guide
    ('019527a0-0000-7000-8000-000000000105',
     'guide01', 'Võ Đức Anh', 'anh.vd@pathora.vn', '0901000006', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Accountant
    ('019527a0-0000-7000-8000-000000000106',
     'accountant01', 'Đỗ Thị Hồng', 'hong.dt@pathora.vn', '0901000007', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Marketing Staff
    ('019527a0-0000-7000-8000-000000000107',
     'marketing01', 'Hoàng Minh Châu', 'chau.hm@pathora.vn', '0901000008', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Customer 1
    ('019527a0-0000-7000-8000-000000000108',
     'khach01', 'Bùi Quang Minh', 'minh.bq@gmail.com', '0912345678', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW()),

    -- Customer 2
    ('019527a0-0000-7000-8000-000000000109',
     'khach02', 'Ngô Thanh Hà', 'ha.nt@gmail.com', '0923456789', NULL,
     0, 1, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq',
     NULL, 0, FALSE, FALSE,
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- A5. UserRoles (assign roles to users)
--     Role IDs: 1=SuperAdmin, 2=Admin, 3=TourManager, 4=SalesManager,
--               5=TourOperator, 6=SalesStaff, 7=TourGuide,
--               8=Accountant, 9=MarketingStaff, 10=Customer
-- ============================================================
INSERT INTO "UserRoles" ("UserId", "RoleId")
VALUES
    ('019aec79-4dcc-73e9-aaca-17f30bdf76f3', 1),   -- admin → SuperAdmin
    ('019aec79-4dcc-73e9-aaca-17f30bdf76f3', 2),   -- admin → Admin
    ('019527a0-0000-7000-8000-000000000101', 3),   -- tourmgr → TourManager
    ('019527a0-0000-7000-8000-000000000102', 4),   -- salesmgr → SalesManager
    ('019527a0-0000-7000-8000-000000000103', 5),   -- operator01 → TourOperator
    ('019527a0-0000-7000-8000-000000000104', 6),   -- sales01 → SalesStaff
    ('019527a0-0000-7000-8000-000000000105', 7),   -- guide01 → TourGuide
    ('019527a0-0000-7000-8000-000000000106', 8),   -- accountant01 → Accountant
    ('019527a0-0000-7000-8000-000000000107', 9),   -- marketing01 → MarketingStaff
    ('019527a0-0000-7000-8000-000000000108', 10),  -- khach01 → Customer
    ('019527a0-0000-7000-8000-000000000109', 10)   -- khach02 → Customer
ON CONFLICT DO NOTHING;

-- ============================================================
-- A6. RoleFunctions (assign functions to roles)
--     SuperAdmin (1) → ALL functions (1..40)
--     Admin (2) → ALL functions (1..40)
--     TourManager (3) → User view + Tour all + TourInstance all + Booking all
--     SalesManager (4) → User view + Tour view + Booking all
--     TourOperator (5) → Tour view + TourInstance all
--     SalesStaff (6) → Tour view + Booking view+create
--     TourGuide (7) → Tour view + TourInstance view
--     Accountant (8) → Booking view
--     MarketingStaff (9) → Tour view
--     Customer (10) → (no admin functions)
-- ============================================================

-- SuperAdmin: ALL functions 1..40
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
SELECT 1, generate_series(1, 40)
ON CONFLICT DO NOTHING;

-- Admin: ALL functions 1..40
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
SELECT 2, generate_series(1, 40)
ON CONFLICT DO NOTHING;

-- TourManager: User view(1,2), Dept view(12,13), Tour all(22-26), TourInstance all(27-32), Booking all(33-37)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (3, 1), (3, 2),
    (3, 12), (3, 13),
    (3, 22), (3, 23), (3, 24), (3, 25), (3, 26),
    (3, 27), (3, 28), (3, 29), (3, 30), (3, 31), (3, 32),
    (3, 33), (3, 34), (3, 35), (3, 36), (3, 37)
ON CONFLICT DO NOTHING;

-- SalesManager: User view(1,2), Tour view(22,23), Booking all(33-37)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (4, 1), (4, 2),
    (4, 22), (4, 23),
    (4, 33), (4, 34), (4, 35), (4, 36), (4, 37)
ON CONFLICT DO NOTHING;

-- TourOperator: Tour view(22,23), TourInstance all(27-32)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (5, 22), (5, 23),
    (5, 27), (5, 28), (5, 29), (5, 30), (5, 31), (5, 32)
ON CONFLICT DO NOTHING;

-- SalesStaff: Tour view(22,23), Booking view+create(33,34,35)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (6, 22), (6, 23),
    (6, 33), (6, 34), (6, 35)
ON CONFLICT DO NOTHING;

-- TourGuide: Tour view(22,23), TourInstance view(27,28)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (7, 22), (7, 23),
    (7, 27), (7, 28)
ON CONFLICT DO NOTHING;

-- Accountant: Booking view(33,34)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (8, 33), (8, 34)
ON CONFLICT DO NOTHING;

-- MarketingStaff: Tour view(22,23)
INSERT INTO "RoleFunctions" ("RoleId", "FunctionId")
VALUES
    (9, 22), (9, 23)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 1. Departments  (3-level hierarchy)
-- ============================================================
INSERT INTO "Departments" ("Id", "ParentId", "Name", "Level", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000020', NULL,                                       'Công ty TNHH Pathora',    1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000021', '019527a0-0000-7000-8000-000000000020',     'Phòng Kinh doanh',        2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000022', '019527a0-0000-7000-8000-000000000020',     'Phòng Kỹ thuật',          2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000023', '019527a0-0000-7000-8000-000000000020',     'Phòng Hành chính - HR',   2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000024', '019527a0-0000-7000-8000-000000000020',     'Phòng Kế toán',           2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000025', '019527a0-0000-7000-8000-000000000020',     'Phòng Tour & Điều hành',  2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000026', '019527a0-0000-7000-8000-000000000020',     'Phòng Marketing',         2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000027', '019527a0-0000-7000-8000-000000000021',     'Tổ Kinh doanh trong nước',3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000028', '019527a0-0000-7000-8000-000000000021',     'Tổ Kinh doanh quốc tế',  3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000029', '019527a0-0000-7000-8000-000000000025',     'Tổ Điều hành tour',       3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-00000000002a', '019527a0-0000-7000-8000-000000000025',     'Tổ Hướng dẫn viên',      3, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. Positions
-- ============================================================
INSERT INTO "Positions" ("Id", "Name", "Level", "Note", "Type", "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc")
VALUES
    ('019527a0-0000-7000-8000-000000000030', 'Giám đốc',              1, NULL,                          1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000031', 'Phó giám đốc',          2, NULL,                          1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000032', 'Trưởng phòng',          3, NULL,                          1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000033', 'Phó phòng',             4, NULL,                          1, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000034', 'Nhân viên kinh doanh',  5, 'Phụ trách bán tour',          2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000035', 'Nhân viên điều hành',   5, 'Phụ trách vận hành tour',     2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000036', 'Hướng dẫn viên',        5, 'HDV nội địa & quốc tế',      2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000037', 'Nhân viên kế toán',     5, NULL,                          2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000038', 'Nhân viên IT',          5, NULL,                          2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000039', 'Nhân viên marketing',   5, NULL,                          2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527a0-0000-7000-8000-000000000040', 'Thực tập sinh',         6, NULL,                          2, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. Tours  (5 Vietnamese + 3 International)
-- ============================================================
INSERT INTO "Tours" (
    "Id", "TourCode", "TourName", "ShortDescription", "LongDescription",
    "Status", "TourScope", "CustomerSegment", "IsDeleted",
    "SEOTitle", "SEODescription",
    "Thumbnail_FileId", "Thumbnail_OriginalFileName", "Thumbnail_FileName", "Thumbnail_PublicURL",
    "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- T1: Hà Nội – Hạ Long
    ('019527b0-0000-7000-8000-000000000001',
     'VN-HN-HL-3N2D',
     'Hà Nội - Hạ Long 3 Ngày 2 Đêm',
     'Khám phá vịnh Hạ Long huyền bí với hàng nghìn đảo đá vôi kỳ vĩ.',
     'Tour Hà Nội - Hạ Long 3N2Đ đưa bạn qua cung đường ven biển thơ mộng, thăm các hang động nổi tiếng như hang Sửng Sốt, Thiên Cung, trải nghiệm chèo kayak và tắm biển tại bãi Ti Tốp.',
     'Active', 'Domestic', 'Group', FALSE,
     'Tour Hà Nội Hạ Long 3N2Đ - Khám phá vịnh di sản',
     'Tour Hà Nội - Hạ Long 3 ngày 2 đêm giá tốt. Ngủ thuyền, khám phá hang động, chèo kayak.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'ha-long-bay.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T2: Đà Nẵng – Hội An
    ('019527b0-0000-7000-8000-000000000002',
     'VN-DN-HA-4N3D',
     'Đà Nẵng - Hội An - Bà Nà 4 Ngày 3 Đêm',
     'Hành trình miền Trung quyến rũ: phố cổ Hội An, cầu Vàng Bà Nà và biển Mỹ Khê.',
     'Khởi hành từ Đà Nẵng, tour đưa du khách tham quan cầu Vàng trên đỉnh Bà Nà Hills, dạo phố cổ Hội An về đêm lung linh đèn lồng, thăm thánh địa Mỹ Sơn và thư giãn tại biển Mỹ Khê.',
     'Active', 'Domestic', 'Group', FALSE,
     'Tour Đà Nẵng Hội An 4N3Đ - Cầu Vàng & Phố cổ',
     'Tour Đà Nẵng - Hội An 4 ngày 3 đêm. Cầu Vàng Bà Nà, phố cổ Hội An, biển Mỹ Khê.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'da-nang-hoi-an.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T3: Phú Quốc
    ('019527b0-0000-7000-8000-000000000003',
     'VN-PQ-5N4D',
     'Phú Quốc Đảo Ngọc 5 Ngày 4 Đêm',
     'Thiên đường biển đảo Phú Quốc - biển xanh, cát trắng, nắng vàng.',
     'Tour Phú Quốc 5N4Đ bao gồm tham quan Vinpearl Safari, lặn ngắm san hô tại quần đảo An Thới, thăm làng chài Hàm Ninh. Nghỉ dưỡng resort 4 sao ven biển.',
     'Active', 'Domestic', 'FIT', FALSE,
     'Tour Phú Quốc 5N4Đ - Đảo Ngọc nghỉ dưỡng',
     'Tour Phú Quốc 5 ngày 4 đêm. Safari, lặn biển, resort 4 sao.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'phu-quoc.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T4: Sapa
    ('019527b0-0000-7000-8000-000000000004',
     'VN-SP-3N2D',
     'Sapa - Bản Cát Cát - Fansipan 3 Ngày 2 Đêm',
     'Chinh phục nóc nhà Đông Dương, trekking bản làng và ngắm ruộng bậc thang.',
     'Tour Sapa 3N2Đ chinh phục đỉnh Fansipan bằng cáp treo, trekking bản Cát Cát ngắm thác nước, tham quan ruộng bậc thang Mường Hoa mùa lúa chín.',
     'Active', 'Domestic', 'Group', FALSE,
     'Tour Sapa Fansipan 3N2Đ - Trekking bản làng',
     'Tour Sapa 3 ngày 2 đêm. Fansipan cáp treo, bản Cát Cát, ruộng bậc thang.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'sapa.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T5: TP.HCM – Cần Thơ – Phú Quốc
    ('019527b0-0000-7000-8000-000000000005',
     'VN-HCM-CT-PQ-5N4D',
     'TP.HCM - Cần Thơ - Phú Quốc 5 Ngày 4 Đêm',
     'Hành trình miền Tây sông nước kết hợp nghỉ dưỡng đảo ngọc Phú Quốc.',
     'Tour kết hợp khám phá miền Tây sông nước: chợ nổi Cái Răng, vườn trái cây, làng nghề đan lát và chèo xuồng trên kênh rạch. Bay ra Phú Quốc nghỉ dưỡng.',
     'Pending', 'Domestic', 'Group', FALSE,
     'Tour TP.HCM Cần Thơ Phú Quốc 5N4Đ',
     'Tour miền Tây + Phú Quốc 5 ngày 4 đêm. Chợ nổi Cái Răng, resort biển.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'hcm-cantho-phuquoc.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T6: Bangkok – Pattaya
    ('019527b0-0000-7000-8000-000000000006',
     'TH-BKK-PTY-4D3N',
     'Bangkok - Pattaya 4 Days 3 Nights',
     'Explore the vibrant Thai capital and the stunning beaches of Pattaya.',
     'Discover Bangkoks magnificent Grand Palace and Wat Pho, shop at Chatuchak Weekend Market, then head to Pattaya for beach relaxation and Coral Island adventures.',
     'Active', 'International', 'Group', FALSE,
     'Bangkok Pattaya Tour 4D3N - Temples & Beaches',
     'Bangkok Pattaya 4 days 3 nights tour. Grand Palace, Coral Island, Thai street food.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'bangkok-pattaya.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T7: Tokyo – Osaka
    ('019527b0-0000-7000-8000-000000000007',
     'JP-TKO-OSK-5D4N',
     'Tokyo - Osaka Cherry Blossom 5 Days 4 Nights',
     'Experience Japans iconic cherry blossoms from Tokyo to Osaka via Shinkansen.',
     'Visit Sensō-ji Temple, Tokyo Skytree, Meiji Shrine, take a day trip to Mount Fuji, then ride the bullet train to Osaka for castle visits and Kyoto temples.',
     'Active', 'International', 'Group', FALSE,
     'Tokyo Osaka Cherry Blossom Tour 5D4N',
     'Japan tour 5 days. Tokyo, Mount Fuji, Shinkansen, Osaka Castle, Kyoto temples.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'tokyo-osaka.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW()),

    -- T8: Seoul – Jeju
    ('019527b0-0000-7000-8000-000000000008',
     'KR-SEL-JEJ-4D3N',
     'Seoul - Jeju Island 4 Days 3 Nights',
     'Discover Seouls royal palaces and Jejus volcanic landscapes.',
     'Explore Gyeongbokgung Palace and Myeongdong shopping in Seoul, then fly to Jeju Island for Hallasan National Park and Seongsan Ilchulbong sunrise peak.',
     'Active', 'International', 'FIT', FALSE,
     'Seoul Jeju Tour 4D3N - Palaces & Volcanic Island',
     'Korea tour 4 days. Seoul palaces, Myeongdong, Jeju Hallasan, Seongsan peak.',
     '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'seoul-jeju.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg',
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. TourImages  (3 gallery images per tour = 24 rows)
-- ============================================================
INSERT INTO "TourImages" ("TourId", "FileId", "OriginalFileName", "FileName", "PublicURL")
VALUES
    -- T1: Hà Nội – Hạ Long
    ('019527b0-0000-7000-8000-000000000001', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'ha-long-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000001', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'ha-long-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000001', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'ha-long-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T2: Đà Nẵng – Hội An
    ('019527b0-0000-7000-8000-000000000002', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'da-nang-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000002', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'da-nang-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000002', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'da-nang-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T3: Phú Quốc
    ('019527b0-0000-7000-8000-000000000003', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'phu-quoc-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000003', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'phu-quoc-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000003', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'phu-quoc-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T4: Sapa
    ('019527b0-0000-7000-8000-000000000004', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'sapa-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000004', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'sapa-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000004', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'sapa-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T5: TP.HCM – Cần Thơ – Phú Quốc
    ('019527b0-0000-7000-8000-000000000005', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'hcm-cantho-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000005', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'hcm-cantho-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000005', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'hcm-cantho-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T6: Bangkok – Pattaya
    ('019527b0-0000-7000-8000-000000000006', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'bangkok-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000006', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'bangkok-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000006', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'bangkok-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T7: Tokyo – Osaka
    ('019527b0-0000-7000-8000-000000000007', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'tokyo-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000007', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'tokyo-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000007', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'tokyo-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    -- T8: Seoul – Jeju
    ('019527b0-0000-7000-8000-000000000008', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'seoul-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000008', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'seoul-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527b0-0000-7000-8000-000000000008', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'seoul-3.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. TourClassifications  (2 per tour = 16 rows)
-- ============================================================
INSERT INTO "TourClassifications" (
    "Id", "TourId", "Name", "Description",
    "AdultPrice", "ChildPrice", "InfantPrice",
    "NumberOfDay", "NumberOfNight",
    "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- T1 Hà Nội – Hạ Long
    ('019527c0-0000-7000-8000-000000000001', '019527b0-0000-7000-8000-000000000001',
     'Tiêu chuẩn', 'Khách sạn 3 sao, xe du lịch, HDV',
     3500000, 2800000, 0, 3, 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000001',
     'Cao cấp', 'Nghỉ đêm trên du thuyền 5 sao, buffet hải sản',
     6500000, 5200000, 0, 3, 2, FALSE, 'system', NOW(), 'system', NOW()),

    -- T2 Đà Nẵng – Hội An
    ('019527c0-0000-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000002',
     'Tiêu chuẩn', 'Khách sạn 3 sao, bao gồm vé Bà Nà',
     4200000, 3400000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000002',
     'Cao cấp', 'Resort 5 sao Hội An, xe riêng, HDV riêng',
     8900000, 7100000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW()),

    -- T3 Phú Quốc
    ('019527c0-0000-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000003',
     'Tiêu chuẩn', 'Resort 3 sao, bao gồm vé máy bay',
     5800000, 4600000, 500000, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000003',
     'Cao cấp', 'Resort 5 sao bãi Sao, spa miễn phí',
     11200000, 8900000, 500000, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),

    -- T4 Sapa
    ('019527c0-0000-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000004',
     'Tiêu chuẩn', 'Homestay bản làng, xe du lịch',
     2800000, 2200000, 0, 3, 2, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000004',
     'Cao cấp', 'Hotel Sapa 4 sao, cáp treo Fansipan VIP',
     5200000, 4200000, 0, 3, 2, FALSE, 'system', NOW(), 'system', NOW()),

    -- T5 TP.HCM – Cần Thơ – Phú Quốc
    ('019527c0-0000-7000-8000-000000000009', '019527b0-0000-7000-8000-000000000005',
     'Tiêu chuẩn', 'Khách sạn 3 sao + resort 3 sao PQ',
     6200000, 5000000, 500000, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000a', '019527b0-0000-7000-8000-000000000005',
     'Cao cấp', 'Resort 5 sao Phú Quốc, bay thẳng',
     12800000, 10200000, 500000, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),

    -- T6 Bangkok – Pattaya
    ('019527c0-0000-7000-8000-00000000000b', '019527b0-0000-7000-8000-000000000006',
     'Standard', '3-star hotel, group coach, English-speaking guide',
     7500000, 6000000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000c', '019527b0-0000-7000-8000-000000000006',
     'Premium', '5-star hotel, private van, Thai massage included',
     14500000, 11600000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW()),

    -- T7 Tokyo – Osaka
    ('019527c0-0000-7000-8000-00000000000d', '019527b0-0000-7000-8000-000000000007',
     'Standard', '3-star hotel, Shinkansen pass, group tour',
     18500000, 14800000, 0, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-00000000000e', '019527b0-0000-7000-8000-000000000007',
     'Premium', '4-star ryokan + hotel, private guide, kaiseki dinner',
     32000000, 25600000, 0, 5, 4, FALSE, 'system', NOW(), 'system', NOW()),

    -- T8 Seoul – Jeju
    ('019527c0-0000-7000-8000-00000000000f', '019527b0-0000-7000-8000-000000000008',
     'Standard', '3-star hotel, domestic flight, group tour',
     12800000, 10200000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW()),
    ('019527c0-0000-7000-8000-000000000010', '019527b0-0000-7000-8000-000000000008',
     'Premium', '5-star hotel, private car, premium activities',
     22500000, 18000000, 0, 4, 3, FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. TourDays  (day-by-day itinerary outlines)
-- ============================================================
INSERT INTO "TourDays" (
    "Id", "TourId", "DayNumber", "Title", "Description",
    "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- T1: Hà Nội – Hạ Long (3 days)
    ('019527d0-0001-7000-8000-000000000001', '019527b0-0000-7000-8000-000000000001', 1,
     'Hà Nội – Hạ Long', 'Khởi hành từ Hà Nội, di chuyển đến Hạ Long, lên du thuyền.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000002', '019527b0-0000-7000-8000-000000000001', 2,
     'Khám phá vịnh Hạ Long', 'Tham quan hang Sửng Sốt, chèo kayak, tắm biển Ti Tốp.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000003', '019527b0-0000-7000-8000-000000000001', 3,
     'Hạ Long – Hà Nội', 'Ngắm bình minh trên vịnh, trở về Hà Nội.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T2: Đà Nẵng – Hội An (4 days)
    ('019527d0-0001-7000-8000-000000000004', '019527b0-0000-7000-8000-000000000002', 1,
     'Đà Nẵng – Bà Nà Hills', 'Đón sân bay, lên Bà Nà Hills, check-in cầu Vàng.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000005', '019527b0-0000-7000-8000-000000000002', 2,
     'Hội An cổ kính', 'Tham quan phố cổ Hội An, chùa Cầu, nhà cổ, đêm đèn lồng.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000006', '019527b0-0000-7000-8000-000000000002', 3,
     'Thánh địa Mỹ Sơn', 'Khám phá di sản UNESCO, tìm hiểu văn hoá Chăm.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000007', '019527b0-0000-7000-8000-000000000002', 4,
     'Biển Mỹ Khê – Về', 'Thư giãn biển Mỹ Khê, shopping, ra sân bay.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T3: Phú Quốc (5 days)
    ('019527d0-0001-7000-8000-000000000008', '019527b0-0000-7000-8000-000000000003', 1,
     'Bay đến Phú Quốc', 'Đón sân bay, nhận phòng resort, tự do tắm biển.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000009', '019527b0-0000-7000-8000-000000000003', 2,
     'Vinpearl Safari', 'Tham quan Safari, công viên Vinwonders.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000000a', '019527b0-0000-7000-8000-000000000003', 3,
     'Lặn biển An Thới', 'Lặn ngắm san hô, câu cá, thưởng thức hải sản.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000000b', '019527b0-0000-7000-8000-000000000003', 4,
     'Làng chài Hàm Ninh', 'Thăm làng chài, chợ đêm Phú Quốc.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000000c', '019527b0-0000-7000-8000-000000000003', 5,
     'Tự do – Về', 'Nghỉ ngơi resort, ra sân bay.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T4: Sapa (3 days)
    ('019527d0-0001-7000-8000-00000000000d', '019527b0-0000-7000-8000-000000000004', 1,
     'Hà Nội – Sapa', 'Di chuyển bằng xe du lịch, nhận phòng, dạo phố Sapa.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000000e', '019527b0-0000-7000-8000-000000000004', 2,
     'Fansipan – Bản Cát Cát', 'Chinh phục Fansipan bằng cáp treo, trekking bản Cát Cát.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000000f', '019527b0-0000-7000-8000-000000000004', 3,
     'Ruộng bậc thang – Về', 'Ngắm ruộng bậc thang Mường Hoa, trở về Hà Nội.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T6: Bangkok – Pattaya (4 days)
    ('019527d0-0001-7000-8000-000000000010', '019527b0-0000-7000-8000-000000000006', 1,
     'Arrive Bangkok', 'Airport transfer, hotel check-in, Khao San Road evening.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000011', '019527b0-0000-7000-8000-000000000006', 2,
     'Grand Palace & Temples', 'Grand Palace, Wat Pho, Wat Arun, Chatuchak Market.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000012', '019527b0-0000-7000-8000-000000000006', 3,
     'Pattaya & Coral Island', 'Transfer to Pattaya, Coral Island, beach activities.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000013', '019527b0-0000-7000-8000-000000000006', 4,
     'Departure', 'Free time, airport transfer.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T7: Tokyo – Osaka (5 days)
    ('019527d0-0001-7000-8000-000000000014', '019527b0-0000-7000-8000-000000000007', 1,
     'Arrive Tokyo', 'Narita transfer, Sensō-ji Temple, Shibuya Crossing.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000015', '019527b0-0000-7000-8000-000000000007', 2,
     'Tokyo Exploration', 'Meiji Shrine, Harajuku, Tokyo Skytree, Akihabara.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000016', '019527b0-0000-7000-8000-000000000007', 3,
     'Mount Fuji Day Trip', 'Day trip to Mt Fuji 5th Station and Lake Kawaguchi.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000017', '019527b0-0000-7000-8000-000000000007', 4,
     'Shinkansen to Osaka', 'Bullet train, Osaka Castle, Dotonbori.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-000000000018', '019527b0-0000-7000-8000-000000000007', 5,
     'Kyoto & Departure', 'Fushimi Inari, Kinkaku-ji, departure from Kansai.',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T8: Seoul – Jeju (4 days)
    ('019527d0-0001-7000-8000-000000000019', '019527b0-0000-7000-8000-000000000008', 1,
     'Arrive Seoul', 'Incheon transfer, Gyeongbokgung Palace, Bukchon Village.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000001a', '019527b0-0000-7000-8000-000000000008', 2,
     'Seoul Shopping & Culture', 'Myeongdong, Namsan Tower, Gangnam.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000001b', '019527b0-0000-7000-8000-000000000008', 3,
     'Fly to Jeju', 'Hallasan National Park, Seongsan Ilchulbong.',
     FALSE, 'system', NOW(), 'system', NOW()),
    ('019527d0-0001-7000-8000-00000000001c', '019527b0-0000-7000-8000-000000000008', 4,
     'Jeju & Departure', 'Manjanggul Cave, Jeju Folk Village, departure.',
     FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. TourInstances (scheduled departures)
-- ============================================================
INSERT INTO "TourInstances" (
    "Id", "TourId", "TourClassificationId", "TourCode",
    "StartDate", "EndDate",
    "AdultPrice", "ChildPrice", "InfantPrice",
    "MinParticipants", "MaxParticipants", "CurrentParticipants",
    "Status",
    "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- T1 Hà Nội – Hạ Long: Standard, April 2026
    ('019527e0-0000-7000-8000-000000000001',
     '019527b0-0000-7000-8000-000000000001',
     '019527c0-0000-7000-8000-000000000001',
     'VN-HN-HL-3N2D-20260415',
     '2026-04-15', '2026-04-17',
     3500000, 2800000, 0,
     10, 30, 5,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T1 Hà Nội – Hạ Long: Premium, April 2026
    ('019527e0-0000-7000-8000-000000000002',
     '019527b0-0000-7000-8000-000000000001',
     '019527c0-0000-7000-8000-000000000002',
     'VN-HN-HL-3N2D-VIP-20260420',
     '2026-04-20', '2026-04-22',
     6500000, 5200000, 0,
     6, 16, 2,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T2 Đà Nẵng – Hội An: Standard, May 2026
    ('019527e0-0000-7000-8000-000000000003',
     '019527b0-0000-7000-8000-000000000002',
     '019527c0-0000-7000-8000-000000000003',
     'VN-DN-HA-4N3D-20260501',
     '2026-05-01', '2026-05-04',
     4200000, 3400000, 0,
     10, 35, 12,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T3 Phú Quốc: Standard, May 2026
    ('019527e0-0000-7000-8000-000000000004',
     '019527b0-0000-7000-8000-000000000003',
     '019527c0-0000-7000-8000-000000000005',
     'VN-PQ-5N4D-20260510',
     '2026-05-10', '2026-05-14',
     5800000, 4600000, 500000,
     8, 20, 8,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T4 Sapa: Standard, June 2026
    ('019527e0-0000-7000-8000-000000000005',
     '019527b0-0000-7000-8000-000000000004',
     '019527c0-0000-7000-8000-000000000007',
     'VN-SP-3N2D-20260601',
     '2026-06-01', '2026-06-03',
     2800000, 2200000, 0,
     10, 25, 0,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T6 Bangkok – Pattaya: Standard, June 2026
    ('019527e0-0000-7000-8000-000000000006',
     '019527b0-0000-7000-8000-000000000006',
     '019527c0-0000-7000-8000-00000000000b',
     'TH-BKK-PTY-4D3N-20260615',
     '2026-06-15', '2026-06-18',
     7500000, 6000000, 0,
     10, 30, 3,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T7 Tokyo – Osaka: Standard, Apr 2026 (Cherry blossom)
    ('019527e0-0000-7000-8000-000000000007',
     '019527b0-0000-7000-8000-000000000007',
     '019527c0-0000-7000-8000-00000000000d',
     'JP-TKO-OSK-5D4N-20260401',
     '2026-04-01', '2026-04-05',
     18500000, 14800000, 0,
     8, 20, 15,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- T8 Seoul – Jeju: Standard, May 2026
    ('019527e0-0000-7000-8000-000000000008',
     '019527b0-0000-7000-8000-000000000008',
     '019527c0-0000-7000-8000-00000000000f',
     'KR-SEL-JEJ-4D3N-20260520',
     '2026-05-20', '2026-05-23',
     12800000, 10200000, 0,
     6, 16, 4,
     'Open',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- Closed instance (past date)
    ('019527e0-0000-7000-8000-000000000009',
     '019527b0-0000-7000-8000-000000000001',
     '019527c0-0000-7000-8000-000000000001',
     'VN-HN-HL-3N2D-20260301',
     '2026-03-01', '2026-03-03',
     3500000, 2800000, 0,
     10, 30, 28,
     'Closed',
     FALSE, 'system', NOW(), 'system', NOW()),

    -- Cancelled instance
    ('019527e0-0000-7000-8000-00000000000a',
     '019527b0-0000-7000-8000-000000000002',
     '019527c0-0000-7000-8000-000000000003',
     'VN-DN-HA-4N3D-20260320',
     '2026-03-20', '2026-03-23',
     4200000, 3400000, 0,
     10, 35, 3,
     'Cancelled',
     FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. TourInstanceImages (2 per instance, first 4 instances)
-- ============================================================
INSERT INTO "TourInstanceImages" ("TourInstanceId", "FileId", "OriginalFileName", "FileName", "PublicURL")
VALUES
    ('019527e0-0000-7000-8000-000000000001', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'instance-hl-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527e0-0000-7000-8000-000000000001', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'instance-hl-2.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527e0-0000-7000-8000-000000000002', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'instance-hl-vip-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527e0-0000-7000-8000-000000000003', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'instance-dn-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg'),
    ('019527e0-0000-7000-8000-000000000004', '9c4bbb62-fe53-4c58-b32c-1712db0f5882', 'instance-pq-1.jpg', '9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg', 'http://localhost:9000/panthora/9c4bbb62-fe53-4c58-b32c-1712db0f5882.jpg')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. Reviews (sample reviews)
-- ============================================================
INSERT INTO "Reviews" (
    "Id", "TourId", "UserId", "Rating", "Comment",
    "IsDeleted", "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    ('019527f0-0000-7000-8000-000000000001',
     '019527b0-0000-7000-8000-000000000001',
     '019527a0-0000-7000-8000-000000000108',
     5, 'Tour Hạ Long tuyệt vời! Du thuyền đẹp, hướng dẫn viên nhiệt tình.',
     FALSE, 'system', NOW(), 'system', NOW()),

    ('019527f0-0000-7000-8000-000000000002',
     '019527b0-0000-7000-8000-000000000002',
     '019527a0-0000-7000-8000-000000000109',
     4, 'Hội An rất đẹp, đồ ăn ngon. Cầu Vàng Bà Nà siêu ấn tượng!',
     FALSE, 'system', NOW(), 'system', NOW()),

    ('019527f0-0000-7000-8000-000000000003',
     '019527b0-0000-7000-8000-000000000003',
     '019527a0-0000-7000-8000-000000000108',
     5, 'Phú Quốc xứng danh đảo ngọc. Lặn biển san hô rất đẹp.',
     FALSE, 'system', NOW(), 'system', NOW()),

    ('019527f0-0000-7000-8000-000000000004',
     '019527b0-0000-7000-8000-000000000007',
     '019527a0-0000-7000-8000-000000000109',
     5, 'Japan cherry blossom season is breathtaking! Highly recommend this tour.',
     FALSE, 'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. Bookings (sample bookings for tour instances)
-- ============================================================
INSERT INTO "Bookings" (
    "Id", "TourInstanceId", "UserId", "TourRequestId",
    "CustomerName", "CustomerPhone", "CustomerEmail",
    "NumberAdult", "NumberChild", "NumberInfant",
    "TotalPrice", "PaymentMethod", "IsFullPay",
    "Status", "BookingDate", "CancelledAt", "CancelReason",
    "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- Booking 1: khach01 books Ha Long Standard
    ('019528a0-0000-7000-8000-000000000001',
     '019527e0-0000-7000-8000-000000000001',
     '019527a0-0000-7000-8000-000000000108', NULL,
     'Bùi Quang Minh', '0912345678', 'minh.bq@gmail.com',
     2, 1, 0,
     9800000, 2, TRUE,
     4, NOW() - INTERVAL '5 days', NULL, NULL,
     'system', NOW(), 'system', NOW()),

    -- Booking 2: khach02 books Da Nang Standard
    ('019528a0-0000-7000-8000-000000000002',
     '019527e0-0000-7000-8000-000000000003',
     '019527a0-0000-7000-8000-000000000109', NULL,
     'Ngô Thanh Hà', '0923456789', 'ha.nt@gmail.com',
     2, 0, 0,
     8400000, 1, FALSE,
     3, NOW() - INTERVAL '3 days', NULL, NULL,
     'system', NOW(), 'system', NOW()),

    -- Booking 3: walk-in customer books Tokyo
    ('019528a0-0000-7000-8000-000000000003',
     '019527e0-0000-7000-8000-000000000007',
     NULL, NULL,
     'John Smith', '0987654321', 'john.smith@gmail.com',
     2, 1, 0,
     51800000, 2, TRUE,
     2, NOW() - INTERVAL '1 day', NULL, NULL,
     'system', NOW(), 'system', NOW()),

    -- Booking 4: cancelled booking
    ('019528a0-0000-7000-8000-000000000004',
     '019527e0-0000-7000-8000-000000000004',
     '019527a0-0000-7000-8000-000000000108', NULL,
     'Bùi Quang Minh', '0912345678', 'minh.bq@gmail.com',
     1, 0, 0,
     5800000, 2, TRUE,
     5, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'Thay đổi kế hoạch cá nhân',
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. CustomerDeposits (for booking 2 which is partial pay)
-- ============================================================
INSERT INTO "CustomerDeposits" (
    "Id", "BookingId", "DepositOrder", "ExpectedAmount", "DueAt",
    "Status", "PaidAt", "Note",
    "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    ('019528b0-0000-7000-8000-000000000001',
     '019528a0-0000-7000-8000-000000000002',
     1, 4200000, NOW() + INTERVAL '7 days',
     2, NOW() - INTERVAL '2 days', 'Đợt cọc 1 - 50%',
     'system', NOW(), 'system', NOW()),

    ('019528b0-0000-7000-8000-000000000002',
     '019528a0-0000-7000-8000-000000000002',
     2, 4200000, NOW() + INTERVAL '20 days',
     1, NULL, 'Đợt cọc 2 - 50% còn lại',
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. CustomerPayments (payment records)
-- ============================================================
INSERT INTO "CustomerPayments" (
    "Id", "BookingId", "CustomerDepositId", "Amount", "PaymentMethod",
    "TransactionRef", "PaidAt", "Note",
    "CreatedBy", "CreatedOnUtc", "LastModifiedBy", "LastModifiedOnUtc"
)
VALUES
    -- Payment for booking 1 (full pay)
    ('019528c0-0000-7000-8000-000000000001',
     '019528a0-0000-7000-8000-000000000001',
     NULL, 9800000, 2,
     'VCB-20260305-001', NOW() - INTERVAL '5 days', 'Thanh toán toàn bộ qua chuyển khoản',
     'system', NOW(), 'system', NOW()),

    -- Payment for booking 2 deposit 1
    ('019528c0-0000-7000-8000-000000000002',
     '019528a0-0000-7000-8000-000000000002',
     '019528b0-0000-7000-8000-000000000001', 4200000, 1,
     NULL, NOW() - INTERVAL '2 days', 'Đặt cọc đợt 1 bằng tiền mặt',
     'system', NOW(), 'system', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE
-- ============================================================
