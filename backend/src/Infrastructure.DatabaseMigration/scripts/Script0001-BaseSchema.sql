SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ParentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Level` int NULL DEFAULT NULL,
  `IsDeleted` bit(1) NULL DEFAULT b'0',
  `CreatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LastUpdatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LastUpdatedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `idx_parent_id`(`ParentId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES ('019aed91-9097-7020-9333-64be2a8323ed', NULL, 'ROOT', 1, b'0', '2025-12-05 09:40:47', '019aec79-4dcc-73e9-aaca-17f30bdf76f3', '2025-12-05 09:40:47', '019aec79-4dcc-73e9-aaca-17f30bdf76f3');

-- ----------------------------
-- Table structure for file_metadata
-- ----------------------------
DROP TABLE IF EXISTS `file_metadata`;
CREATE TABLE `file_metadata`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `LinkedEntityId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `OriginalFileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `StoredFileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `MimeType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FileSize` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsDeleted` bit(1) NOT NULL DEFAULT b'0',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LastUpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LastUpdatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of file_metadata
-- ----------------------------

-- ----------------------------
-- Table structure for logactivity
-- ----------------------------
DROP TABLE IF EXISTS `logactivity`;
CREATE TABLE `logactivity`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `CreateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IP` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ObjectGUID` char(38) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LogContent` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `UserID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of logactivity
-- ----------------------------

-- ----------------------------
-- Table structure for logerror
-- ----------------------------
DROP TABLE IF EXISTS `logerror`;
CREATE TABLE `logerror`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `CreateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LogContent` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `StatusID` int NULL DEFAULT NULL,
  `ProcessContent` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `TypeLog` int NOT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of logerror
-- ----------------------------

-- ----------------------------
-- Table structure for loghistory
-- ----------------------------
DROP TABLE IF EXISTS `loghistory`;
CREATE TABLE `loghistory`  (
  `ID` bigint NOT NULL AUTO_INCREMENT,
  `CreateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IP` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `UserID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ObjectGUID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `FuncID` int NULL DEFAULT NULL,
  `LogContent` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `UserName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of loghistory
-- ----------------------------

-- ----------------------------
-- Table structure for mail
-- ----------------------------
DROP TABLE IF EXISTS `mail`;
CREATE TABLE `mail`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `To` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `Status` tinyint NULL DEFAULT NULL,
  `Template` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `SentAt` datetime NULL DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mail
-- ----------------------------

-- ----------------------------
-- Table structure for otp
-- ----------------------------
DROP TABLE IF EXISTS `otp`;
CREATE TABLE `otp`  (
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ExpiryDate` datetime NULL DEFAULT NULL,
  `IsDeleted` bit(1) NULL DEFAULT NULL,
  PRIMARY KEY (`Email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of otp
-- ----------------------------

-- ----------------------------
-- Table structure for p_category
-- ----------------------------
DROP TABLE IF EXISTS `p_category`;
CREATE TABLE `p_category`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Identity` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Type` int NULL DEFAULT NULL COMMENT '0: Chung 1: Doanh nghiệp 2: Phòng khám 9: admin 3:DN+admin 4: PK+admin',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of p_category
-- ----------------------------
INSERT INTO `p_category` VALUES (1, 'User', 'Danh bạ người dùng', NULL);
INSERT INTO `p_category` VALUES (2, 'Role', 'Phân quyền', NULL);
INSERT INTO `p_category` VALUES (3, 'Department', 'Quản lí phòng ban', NULL);
INSERT INTO `p_category` VALUES (4, 'Position', 'Quản lí chức vụ', NULL);

-- ----------------------------
-- Table structure for p_function
-- ----------------------------
DROP TABLE IF EXISTS `p_function`;
CREATE TABLE `p_function`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CategoryId` int NOT NULL,
  `ApiUrl` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Order` int NULL DEFAULT NULL,
  `ButtonShow` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsDeleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `idx_function_category`(`CategoryId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of p_function
-- ----------------------------
INSERT INTO `p_function` VALUES (1, 1, '/api/users/getList', 'Xem danh sách người dùng', 1, 'IsVisitTab', b'0');
INSERT INTO `p_function` VALUES (2, 1, '/api/users/getDetail', 'Xem chi tiết', 1, 'IsDetail', b'0');
INSERT INTO `p_function` VALUES (3, 1, '/api/users/create', 'Thêm người dùng', 1, 'IsCreate', b'0');
INSERT INTO `p_function` VALUES (4, 1, '/api/users/update', 'Cập nhật thông tin', 1, 'IsUpdate', b'0');
INSERT INTO `p_function` VALUES (5, 1, '/api/users/changePassword', 'Thay đổi mật khẩu', 1, 'IsResetPass', b'0');
INSERT INTO `p_function` VALUES (6, 1, '/api/users/delete', 'Xoá người dùng', 1, 'IsDelete', b'0');
INSERT INTO `p_function` VALUES (7, 2, '/api/roles/getList', 'Xem danh sách ', 1, 'IsVisitTab', b'0');
INSERT INTO `p_function` VALUES (8, 2, '/api/roles/getDetail', 'Xem chi tiết', 1, 'IsDetail', b'0');
INSERT INTO `p_function` VALUES (9, 2, '/api/roles/create', 'Tạo nhóm quyền', 1, 'IsCreate', b'0');
INSERT INTO `p_function` VALUES (10, 2, '/api/roles/update', 'Cập nhật nhóm quyền', 1, 'IsUpdate', b'0');
INSERT INTO `p_function` VALUES (11, 2, '/api/roles/delete', 'Xoá nhóm quyền', 1, 'IsDelete', b'0');
INSERT INTO `p_function` VALUES (12, 3, '/api/departments/getList', 'Xem danh sách phòng ban', 1, 'IsVisitTab', b'0');
INSERT INTO `p_function` VALUES (13, 3, '/api/departments/create', 'Tạo phòng ban', 1, 'IsCreate', b'0');
INSERT INTO `p_function` VALUES (14, 3, '/api/departments/update', 'Cập nhật phòng ban', 1, 'IsUpdate', b'0');
INSERT INTO `p_function` VALUES (15, 3, '/api/departments/delete', 'Xoá phòng ban', 1, 'IsDelete', b'0');
INSERT INTO `p_function` VALUES (16, 4, '/api/positions/getList', 'Xem danh sách chức vụ', 1, 'IsVisitTab', b'0');
INSERT INTO `p_function` VALUES (17, 4, '/api/positions/create', 'Tạo chức vụ', 1, 'IsCreate', b'0');
INSERT INTO `p_function` VALUES (18, 4, '/api/positions/update', 'Cập nhật chức vụ', 1, 'IsUpdate', b'0');
INSERT INTO `p_function` VALUES (19, 4, '/api/positions/delete', 'Xoá chức vụ', 1, 'IsDelete', b'0');

-- ----------------------------
-- Table structure for p_role
-- ----------------------------
DROP TABLE IF EXISTS `p_role`;
CREATE TABLE `p_role`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Type` int NULL DEFAULT NULL,
  `Status` tinyint NOT NULL DEFAULT 1,
  `IsDeleted` bit(1) NULL DEFAULT b'0',
  `CreatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LastUpdatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LastUpdatedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of p_role
-- ----------------------------
INSERT INTO `p_role` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 'Admin', 'Admin', 9, 1, b'0', '2025-12-05 15:22:26', NULL, '2025-12-05 15:22:26', NULL);

-- ----------------------------
-- Table structure for p_role_function
-- ----------------------------
DROP TABLE IF EXISTS `p_role_function`;
CREATE TABLE `p_role_function`  (
  `RoleId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `FunctionId` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`RoleId`, `FunctionId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of p_role_function
-- ----------------------------
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 1);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 2);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 3);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 4);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 5);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 6);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 7);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 8);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 9);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 10);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 11);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 12);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 13);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 14);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 15);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 16);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 17);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 18);
INSERT INTO `p_role_function` VALUES ('019aed9a-81af-764e-a096-5e02f1dbe044', 19);

-- ----------------------------
-- Table structure for p_user_role
-- ----------------------------
DROP TABLE IF EXISTS `p_user_role`;
CREATE TABLE `p_user_role`  (
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `RoleId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`UserId`, `RoleId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of p_user_role
-- ----------------------------
INSERT INTO `p_user_role` VALUES ('019aec79-4dcc-73e9-aaca-17f30bdf76f3', '019aed9a-81af-764e-a096-5e02f1dbe044');

-- ----------------------------
-- Table structure for position
-- ----------------------------
DROP TABLE IF EXISTS `position`;
CREATE TABLE `position`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Level` int NULL DEFAULT NULL,
  `Note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsDeleted` bit(1) NULL DEFAULT b'0',
  `Type` int NULL DEFAULT NULL COMMENT 'Loại: 1. Chức danh; 2. Chức vụ',
  `CreatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `LastUpdatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LastUpdatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of position
-- ----------------------------

-- ----------------------------
-- Table structure for refresh_token
-- ----------------------------
DROP TABLE IF EXISTS `refresh_token`;
CREATE TABLE `refresh_token`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ExpiresOnUtc` datetime NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `idx_token`(`Token` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of refresh_token
-- ----------------------------

-- ----------------------------
-- Table structure for systemkey
-- ----------------------------
DROP TABLE IF EXISTS `systemkey`;
CREATE TABLE `systemkey`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ParentId` int UNSIGNED NULL DEFAULT NULL,
  `CodeKey` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CodeValue` int NULL DEFAULT 0,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `SortOrder` int UNSIGNED NULL DEFAULT NULL,
  `IsDeleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `Index_Id`(`Id` ASC) USING BTREE,
  INDEX `Index_CodeValue`(`ParentId` ASC, `CodeValue` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of systemkey
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `Username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `FullName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ForcePasswordChange` bit(1) NULL DEFAULT b'0',
  `IsDeleted` bit(1) NOT NULL DEFAULT b'0',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `LastUpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LastUpdatedBy` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `idx_email`(`Email` ASC) USING BTREE,
  FULLTEXT INDEX `idx_fullname`(`FullName`) INVISIBLE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('019aec79-4dcc-73e9-aaca-17f30bdf76f3', 'admin', 'admin', 'admin@gmail.com', NULL, '$2a$11$gOTf5gTy2M0of3qwds9tVuGnDZv8uZ/wQfqmD8qEjbgkWE16oVMWq', b'0', b'0', '2025-12-05 03:06:04', NULL, '2025-12-05 03:06:04', NULL);

-- ----------------------------
-- Table structure for user_department
-- ----------------------------
DROP TABLE IF EXISTS `user_department`;
CREATE TABLE `user_department`  (
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DepartmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PositionId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`UserId`, `DepartmentId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_department
-- ----------------------------
INSERT INTO `user_department` VALUES ('019aec79-4dcc-73e9-aaca-17f30bdf76f3', '019aed91-9097-7020-9333-64be2a8323ed', NULL);

-- ----------------------------
-- Procedure structure for sp_columnkey
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_columnkey`;
delimiter ;;
CREATE PROCEDURE `sp_columnkey`(IN pTableName VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
IN pDbName VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)
BEGIN
select LOWER(column_name) from information_schema.columns
where table_schema = pDbName
and table_name = pTableName
AND column_key = 'PRI';

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_columnname
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_columnname`;
delimiter ;;
CREATE PROCEDURE `sp_columnname`(IN pTableName VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
IN pDbName VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)
BEGIN
select LOWER(column_name) from information_schema.columns
where table_schema = pDbName
and table_name = pTableName;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_helptext
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_helptext`;
delimiter ;;
CREATE PROCEDURE `sp_helptext`(IN pStoreName VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
  IN pDbName VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)
BEGIN
SELECT ROUTINE_DEFINITION FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' 
  AND ROUTINE_NAME = pStoreName 
  AND ROUTINE_SCHEMA = pDbName;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogActivity_GetList
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogActivity_GetList`;
delimiter ;;
CREATE PROCEDURE `sp_LogActivity_GetList`(pTextSearch varchar(200),
pUserID varchar(36) CHARACTER SET utf8mb4 collate utf8mb4_unicode_ci,
pFromDate DateTime,
pToDate DateTime)
BEGIN
	
	SELECT * from logactivity
	WHERE (pTextSearch IS NULL OR pTextSearch = '' OR LogContent like  CONCAT('%',pTextSearch,'%' )	)
	Order by id desc;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogActivity_GetListSearch
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogActivity_GetListSearch`;
delimiter ;;
CREATE PROCEDURE `sp_LogActivity_GetListSearch`(pTextSearch varchar(200),
pUserID varchar(36) CHARACTER SET utf8mb4 collate utf8mb4_unicode_ci,
pFromDate DateTime,
pToDate DateTime)
BEGIN
	
	SELECT a.CreateDate, a.LogContent, u.UserName CreateUser 
	from `User` u
	JOIN logactivity a ON a.UserID = u.UserID
	WHERE (pUserID = '00000000-0000-0000-0000-000000000000' OR u.UserID = pUserID)
	AND (a.CreateDate BETWEEN pFromDate AND pToDate )	
	AND (pTextSearch IS NULL OR pTextSearch = '' OR LogContent like concat( '%',pTextSearch,'%') )
	Order by id desc;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogActivity_Insert
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogActivity_Insert`;
delimiter ;;
CREATE PROCEDURE `sp_LogActivity_Insert`(pIP varchar(40) ,
    pUserID char(38) ,
    pLogContent varchar(2000),
	pObjectGUID char(38))
BEGIN
        INSERT  INTO logactivity
                ( IP ,
                  UserID ,
                  LogContent,
				  ObjectGUID
	          )
        VALUES  ( pIP ,
                  pUserID ,
                  pLogContent,
				  pObjectGUID
	          );
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogError_GetList
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogError_GetList`;
delimiter ;;
CREATE PROCEDURE `sp_LogError_GetList`(pTextSearch varchar(200))
BEGIN
	
	SELECT * from logerror
	WHERE (pTextSearch is null or pTextSearch = '' or LogContent like  CONCAT('%',pTextSearch,'%' ))
	Order by id desc;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogError_Insert
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogError_Insert`;
delimiter ;;
CREATE PROCEDURE `sp_LogError_Insert`(IN pLogContent LONGTEXT,
IN pTypeLog INT)
BEGIN
  INSERT INTO logerror(LogContent, TypeLog) VALUES (pLogContent, pTypeLog);
  SELECT CAST(LAST_INSERT_ID() AS CHAR);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogHistory_Insert
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogHistory_Insert`;
delimiter ;;
CREATE PROCEDURE `sp_LogHistory_Insert`(pIP varchar(40) ,
    pFuncId int ,
    pUserID char(38) ,
    pLogContent varchar(10000),
	pObjectGUID char(38))
BEGIN
        INSERT  INTO loghistory
                ( IP ,
                  UserID ,
                  FuncId,
                  LogContent,
				  ObjectGUID
	          )
        VALUES  ( pIP ,
                  pUserID ,
                  pFuncId,
                  pLogContent,
				  pObjectGUID
	          );
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogHistory_Select
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogHistory_Select`;
delimiter ;;
CREATE PROCEDURE `sp_LogHistory_Select`(pObjectGuidID varchar(36) CHARACTER SET utf8mb4 collate utf8mb4_unicode_ci)
BEGIN
		SELECT 
				lh.CreateDate,
				lh.LogContent as Content,
				u.UserID,
				u.Avatar,
				u.FullName,
				u.UserName
		FROM loghistory lh
		Left join `user` u on u.UserID = lh.UserID
		WHERE pObjectGuidID = lh.ObjectGUID
		ORDER BY CreateDate desc;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_LogLogin_GetList
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_LogLogin_GetList`;
delimiter ;;
CREATE PROCEDURE `sp_LogLogin_GetList`(IN `pStartIndex` INTEGER, IN `pPageSize` INTEGER)
BEGIN
SELECT 
  a.ID AS id, 
  CONCAT(u.UserName, ". IP: ", a.IpAddress) AS content, 
  a.LoginDate AS `date`
FROM 
  loglogin a 
	join `user` u on u.UserID = a.UserID
ORDER BY 
  a.ID DESC 
LIMIT pStartIndex, 
  pPageSize;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_ActivityLog_GetList
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_ActivityLog_GetList`;
delimiter ;;
CREATE PROCEDURE `usp_ActivityLog_GetList`(pUserName varchar(255),
		pFromDate Date,
		pToDate Date)
BEGIN

		Select u.UserName,
					la.LogContent Content,
					la.CreateDate,
					la.ID
		From logactivity la
		Join `user` u on la.ObjectGUID = u.UserID
		Where (pUserName = '' or u.UserName like Concat('%', pUserName, '%'))
				And (pFromDate is null or pToDate is null
				Or (la.CreateDate between pFromDate and pToDate))
		Order by la.CreateDate desc;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Category_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Category_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_Category_GetAll`()
BEGIN
  SELECT * FROM p_category;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Department_GetAccessibleDepartmentByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Department_GetAccessibleDepartmentByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_Department_GetAccessibleDepartmentByUserId`(IN pUserId CHAR(36))
BEGIN
WITH RECURSIVE department_tree AS (
  SELECT d.Id, d.Name, d.ParentId, d.Level, d.IsDeleted
  FROM department d
  JOIN user_department ud ON ud.DepartmentId = d.Id
  WHERE ud.UserId = pUserId AND d.IsDeleted = FALSE

  UNION ALL

  SELECT d2.Id, d2.Name, d2.ParentId, d2.Level, d2.IsDeleted
  FROM department d2
  JOIN department_tree dt ON d2.ParentId = dt.Id
)
SELECT DISTINCT *
FROM department_tree;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Department_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Department_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_Department_GetAll`()
BEGIN
SELECT * FROM 
department
WHERE IsDeleted = FALSE
ORDER BY Level, Name;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Department_GetById
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Department_GetById`;
delimiter ;;
CREATE PROCEDURE `usp_Department_GetById`(IN pDepartmentId CHAR(36))
BEGIN
SELECT * FROM
department WHERE Id = pDepartmentId AND IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Department_GetSubDepartments
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Department_GetSubDepartments`;
delimiter ;;
CREATE PROCEDURE `usp_Department_GetSubDepartments`(IN pId CHAR(36))
BEGIN
SELECT *
FROM department
WHERE ParentId = pId AND IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_FileMetadata_DeleteByIds
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_FileMetadata_DeleteByIds`;
delimiter ;;
CREATE PROCEDURE `usp_FileMetadata_DeleteByIds`(IN pIds TEXT)
BEGIN
  UPDATE
  file_metadata
  SET IsDeleted = TRUE
  WHERE FIND_IN_SET(file_metadata.Id, pIds);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_FileMetadata_DeleteByLinkedEntityId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_FileMetadata_DeleteByLinkedEntityId`;
delimiter ;;
CREATE PROCEDURE `usp_FileMetadata_DeleteByLinkedEntityId`(IN pEntityId CHAR(36))
BEGIN
  UPDATE file_metadata
  SET IsDeleted = TRUE
  WHERE LinkedEntityId = pEntityId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_FileMetadata_FindByLinkedEntityIds
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_FileMetadata_FindByLinkedEntityIds`;
delimiter ;;
CREATE PROCEDURE `usp_FileMetadata_FindByLinkedEntityIds`(IN pLinkedEntityIds TEXT)
BEGIN
  SELECT *
  FROM file_metadata
  WHERE FIND_IN_SET(LinkedEntityId, pLinkedEntityIds) AND IsDeleted = FALSE
  ORDER BY LinkedEntityId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_FileMetadata_GetByIds
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_FileMetadata_GetByIds`;
delimiter ;;
CREATE PROCEDURE `usp_FileMetadata_GetByIds`(IN pIds TEXT)
BEGIN
  SELECT *
  FROM file_metadata
  WHERE FIND_IN_SET(file_metadata.Id, pIds);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_FunctionCategory_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_FunctionCategory_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_FunctionCategory_GetAll`()
BEGIN
  SELECT * FROM p_category;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Function_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Function_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_Function_GetAll`()
BEGIN
SELECT *
FROM p_function;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Function_GetByRoleGroupByCategory
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Function_GetByRoleGroupByCategory`;
delimiter ;;
CREATE PROCEDURE `usp_Function_GetByRoleGroupByCategory`()
BEGIN
SELECT 
r.Id AS RoleId,
c.Id AS CategoryId,
f.Id AS FunctionId,
f.Description AS FunctionDescription
FROM 
p_role r
JOIN p_role_function rf ON r.Id = rf.RoleId
JOIN p_function f ON rf.FunctionId = f.Id
JOIN p_category c ON f.CategoryId = c.Id;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Function_GetByRoleId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Function_GetByRoleId`;
delimiter ;;
CREATE PROCEDURE `usp_Function_GetByRoleId`(IN pRoleId CHAR(36))
BEGIN
SELECT f.*
FROM p_function f JOIN p_role_function rf ON f.Id = rf.FunctionId
WHERE rf.RoleId = pRoleId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Function_GetByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Function_GetByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_Function_GetByUserId`(IN pUserId CHAR(36))
BEGIN
SELECT f.*
FROM
p_user_role ur 
JOIN p_role_function rf ON ur.RoleId = rf.RoleId
JOIN p_function f ON rf.FunctionId = f.Id
WHERE ur.UserId = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Mail_GetPendingMails
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Mail_GetPendingMails`;
delimiter ;;
CREATE PROCEDURE `usp_Mail_GetPendingMails`(IN pStatus TINYINT)
BEGIN
SELECT *
FROM mail
WHERE Status = pStatus;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Otp_GetByEmail
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Otp_GetByEmail`;
delimiter ;;
CREATE PROCEDURE `usp_Otp_GetByEmail`(`pEmail` varchar(255))
BEGIN
	#Routine body goes here...
	SELECT *
	FROM otp
	WHERE Email = pEmail;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Position_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Position_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_Position_GetAll`()
BEGIN
SELECT * FROM position WHERE IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Position_GetById
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Position_GetById`;
delimiter ;;
CREATE PROCEDURE `usp_Position_GetById`(IN pId CHAR(36))
BEGIN
  SELECT * FROM `Position` WHERE Id = Id AND IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_RefreshToken_Delete
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_RefreshToken_Delete`;
delimiter ;;
CREATE PROCEDURE `usp_RefreshToken_Delete`(IN pToken TEXT)
BEGIN
DELETE FROM refresh_token
WHERE Token = pToken;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_RefreshToken_GetByToken
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_RefreshToken_GetByToken`;
delimiter ;;
CREATE PROCEDURE `usp_RefreshToken_GetByToken`(IN pToken TEXT)
BEGIN
SELECT * 
FROM refresh_token
WHERE Token = pToken;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_CountAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_CountAll`;
delimiter ;;
CREATE PROCEDURE `usp_Role_CountAll`(IN pRoleName VARCHAR(250), IN pStatus INT)
BEGIN
DECLARE vRoleName VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
SET vRoleName = NULLIF(pRoleName, '');

SELECT COUNT(*) 
FROM p_role
WHERE
  (pStatus = 0 OR `Status` = pStatus)
	AND (vRoleName IS NULL OR Name LIKE CONCAT('%', vRoleName, '%'))
	AND IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_DeleteFunctionsByRoleId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_DeleteFunctionsByRoleId`;
delimiter ;;
CREATE PROCEDURE `usp_Role_DeleteFunctionsByRoleId`(IN pRoleId CHAR(36))
BEGIN
DELETE FROM p_role_function
WHERE RoleId = pRoleId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_FindAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_FindAll`;
delimiter ;;
CREATE PROCEDURE `usp_Role_FindAll`(IN pRoleName VARCHAR(250),
    IN pStatus INT,
    IN pOffset INT,
    IN pLimit INT)
BEGIN
SELECT 
  *
FROM p_role r
WHERE
  (pStatus = 0 OR Status = pStatus)
  AND (pRoleName IS NULL OR Name LIKE CONCAT('%', pRoleName, '%'))
  AND IsDeleted = FALSE
  LIMIT pLimit OFFSET pOffset;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_FindByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_FindByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_Role_FindByUserId`(IN pUserId CHAR(36))
BEGIN
SELECT r.* FROM
p_user_role ur 
JOIN p_role r ON ur.RoleId = r.Id
WHERE ur.UserId = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_Role_GetAll`()
BEGIN
SELECT *
FROM p_role r
WHERE IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_Role_GetById
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_Role_GetById`;
delimiter ;;
CREATE PROCEDURE `usp_Role_GetById`(IN pRoleID CHAR(36))
BEGIN
SELECT *
FROM p_role
WHERE Id = pRoleId
AND IsDeleted = FALSE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_SystemKey_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_SystemKey_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_SystemKey_GetAll`()
BEGIN
SELECT 
	*
FROM systemkey
WHERE IsDeleted = 0;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_SystemKey_GetById
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_SystemKey_GetById`;
delimiter ;;
CREATE PROCEDURE `usp_SystemKey_GetById`(IN pId INT)
BEGIN
SELECT *
FROM systemkey
WHERE ParentId = pId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_UserDepartment_DeleteByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_UserDepartment_DeleteByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_UserDepartment_DeleteByUserId`(IN pUserId CHAR(36))
BEGIN
  DELETE
  FROM
  user_department
  WHERE UserId = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_UserDepartment_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_UserDepartment_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_UserDepartment_GetAll`()
BEGIN
  SELECT 
    ud.UserId,
    ud.DepartmentId,
    ud.PositionId,
    p.Name as PositionName
  FROM user_department ud
  LEFT JOIN position p on ud.PositionId = p.Id and p.IsDelete = 0;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_UserDepartment_GetDepartmentsByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_UserDepartment_GetDepartmentsByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_UserDepartment_GetDepartmentsByUserId`(IN pUserId CHAR(36))
BEGIN
  SELECT     
    ud.PositionId,
    p.Name AS PositionName,
    ud.DepartmentId,
    d.ParentId,
    d.`Name`,
    d.`Level`
  FROM user_department ud
  LEFT JOIN department d ON ud.DepartmentId = d.Id
  LEFT JOIN position p ON ud.PositionId = p.Id AND p.IsDeleted = 0
  WHERE ud.UserId = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_UserRole_DeleteByUserId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_UserRole_DeleteByUserId`;
delimiter ;;
CREATE PROCEDURE `usp_UserRole_DeleteByUserId`(IN pUserId CHAR(36))
BEGIN
  DELETE
  FROM
  p_user_role
  WHERE UserId = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_UserRole_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_UserRole_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_UserRole_GetAll`()
BEGIN
SELECT *
FROM p_user_role;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_CountByName
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_CountByName`;
delimiter ;;
CREATE PROCEDURE `usp_User_CountByName`(pKeyword TEXT,
    pPhoneNumber VARCHAR(20),
    pDepartmentId char(36))
BEGIN
  SELECT
    COUNT(*)
  FROM `user` u
  JOIN user_department ud on ud.UserId = u.Id
  JOIN department d on d.Id = ud.DepartmentId
  LEFT JOIN position p on p.Id = ud.PositionId
  WHERE 
    (pKeyword = '' OR u.FullName LIKE CONCAT('%', pKeyword, '%')) and 
    (pPhoneNumber = '' or u.PhoneNumber LIKE CONCAT('%', pPhoneNumber, '%')) and 
    (pDepartmentId = '' or pDepartmentId = d.Id)
  GROUP BY u.FullName;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetAccessibleUsers
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetAccessibleUsers`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetAccessibleUsers`(IN pUserId CHAR(36))
BEGIN
WITH RECURSIVE department_tree AS (
  SELECT d.Id, d.ParentId
  FROM department d
    JOIN user_department ud ON d.Id = ud.DepartmentId
  WHERE ud.UserId = pUserId
  
  UNION ALL
  
  SELECT d2.Id, d2.ParentId
  FROM department d2
  JOIN department_tree dt ON d2.ParentId = dt.Id
)
SELECT  u.*
FROM user u
 left JOIN user_department ud ON u.Id = ud.UserId
WHERE ud.DepartmentId IN (SELECT dt.Id FROM department_tree dt);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetAll
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetAll`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetAll`(IN pUserId CHAR(36),
  IN pDepartmentId CHAR(36))
BEGIN
WITH RECURSIVE department_tree AS (
  SELECT d.Id, d.Name,
  IF(d.id = pDepartmentId, 1, 0) AS Node
  FROM department d
    JOIN user_department ud ON d.Id = ud.DepartmentId
  WHERE ud.UserId = pUserId
  
  UNION ALL
  
  SELECT d2.Id, d2.Name, IF(dt.Node = 0, IF(d2.id = pDepartmentId, 1, 0), dt.Node) AS Node
  FROM department d2
  JOIN department_tree dt ON d2.ParentId = dt.Id
)
SELECT u.*, GROUP_CONCAT(dt.Name SEPARATOR ', ') AS DepartmentName
FROM user u
 JOIN user_department ud ON u.Id = ud.UserId
 JOIN department_tree dt ON ud.DepartmentId = dt.Id AND dt.Node = 1
WHERE u.IsDeleted = FALSE
GROUP BY u.Id;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetByDepartmentId
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetByDepartmentId`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetByDepartmentId`(IN pDepartmentId CHAR(36))
BEGIN
IF pDepartmentId IS NULL THEN
SELECT u.*
FROM user u JOIN user_department up ON u.id = up.UserId;
ELSE
SELECT u.*
FROM user u JOIN user_department up ON u.id = up.UserId 
WHERE up.DepartmentId IN 
(
	WITH RECURSIVE department_tree AS (
		SELECT 
			Id
		FROM department
		WHERE Id = pDepartmentId
		
		UNION ALL
		
		SELECT 
			d.Id
		FROM department d
		INNER JOIN department_tree dt ON d.ParentId = dt.Id
	)
	SELECT Id FROM department_tree
);
END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetByEmail
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetByEmail`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetByEmail`(IN pEmail TEXT)
BEGIN
SELECT *
FROM user
WHERE Email = pEmail;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetById
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetById`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetById`(IN pUserId CHAR(36))
BEGIN
SELECT *
FROM `user`
WHERE 
Id = pUserId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetByIds
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetByIds`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetByIds`(pUserIds TEXT)
BEGIN
  SELECT * FROM `user` WHERE FIND_IN_SET(Id, pUserIds);
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetByName
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetByName`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetByName`(pKeyword TEXT,
    pPhoneNumber VARCHAR(20),
    pDepartmentId char(36),
    pLimit int,
    pOffset int)
BEGIN
  SELECT
    u.Id,
    u.FullName,
    u.PhoneNumber,
    d.`Name` as DepartmentName,
    ud.PositionId,
    p.Name as PositionName
  FROM `user` u
  JOIN user_department ud on ud.UserId = u.Id
  JOIN department d on d.Id = ud.DepartmentId
  LEFT JOIN position p on p.Id = ud.PositionId
  WHERE 
    (pKeyword = '' OR u.FullName LIKE CONCAT('%', pKeyword, '%')) and 
    (pPhoneNumber = '' or u.PhoneNumber LIKE CONCAT('%', pPhoneNumber, '%')) and 
    (pDepartmentId = '' or pDepartmentId = d.Id)
  GROUP BY u.FullName
  LIMIT pLimit OFFSET pOffset;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_GetByUsername
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_GetByUsername`;
delimiter ;;
CREATE PROCEDURE `usp_User_GetByUsername`(IN pUsername TEXT)
BEGIN
SELECT *
FROM user
WHERE Username = pUsername;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usp_User_IsEmailUnique
-- ----------------------------
DROP PROCEDURE IF EXISTS `usp_User_IsEmailUnique`;
delimiter ;;
CREATE PROCEDURE `usp_User_IsEmailUnique`(IN pEmail TEXT)
BEGIN
SELECT 
  NOT (EXISTS (SELECT 1 FROM `User` WHERE Email = pEmail)) AS IsUnique;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
