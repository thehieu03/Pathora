namespace Application.Common.Constant;

public static class ErrorConstants
{
    public static class Classification
    {
        public const string NotFoundCode = "Classification.NotFound";
        public const string NotFoundDescription = "Phân loại tour không tồn tại";
    }

    public static class Department
    {
        public const string NotFoundCode = "Department.NotFound";
        public const string NotFoundDescription = "Phòng ban không tồn tại";
    }

    public static class Position
    {
        public const string NotFoundCode = "Position.NotFound";
        public const string NotFoundDescription = "Chức vụ không tồn tại";
    }

    public static class RefreshToken
    {
        public const string NotFoundCode = "RefreshToken.NotFound";
        public const string NotFoundDescription = "Refresh token không tồn tại";
        public const string ExpiredCode = "RefreshToken.Expired";
        public const string ExpiredDescription = "Refresh token đã hết hạn";
    }

    public static class Role
    {
        public const string NotFoundCode = "Role.NotFound";
        public const string NotFoundDescription = "Role không tồn tại";
    }

    public static class Tour
    {
        public const string NotFoundCode = "Tour.NotFound";
        public const string NotFoundDescription = "Tour không tồn tại";
        public const string PublicNotFoundDescription = "Tour không tìm thấy";
        public const string DuplicateCodeCode = "Tour.DuplicateCode";
        public const string DuplicateCodeDescriptionTemplate = "Mã tour '{0}' đã tồn tại";
    }

    public static class TourInstance
    {
        public const string NotFoundCode = "TourInstance.NotFound";
        public const string NotFoundDescription = "Lịch trình tour không tồn tại";
        public const string PublicNotFoundDescription = "Lịch trình tour không tồn tại hoặc không khả dụng";
    }

    public static class User
    {
        public const string NotFoundCode = "User.NotFound";
        public const string NotFoundDescription = "Người dùng không tồn tại";
        public const string NotFoundForInvalidCredentialsDescription = "Email hoặc mật khẩu không đúng";

        public const string InvalidPasswordCode = "User.InvalidPassword";
        public const string InvalidPasswordForInvalidCredentialsDescription = "Email hoặc mật khẩu không đúng";
        public const string InvalidPasswordDescription = "Mật khẩu cũ không đúng";

        public const string DuplicateEmailCode = "User.DuplicateEmail";
        public const string DuplicateEmailDescription = "Email đã được sử dụng";

        public const string UnauthorizedCode = "User.Unauthorized";
        public const string UnauthorizedDescription = "Người dùng chưa đăng nhập";

        public const string InvalidIdCode = "User.InvalidId";
        public const string InvalidIdDescription = "User ID không hợp lệ";
        public const string InvalidIdFormatDescription = "Định dạng UserId không hợp lệ.";

        public const string FunctionsNotFoundCode = "User.FunctionsNotFound";
        public const string FunctionsNotFoundDescription = "Không tìm thấy chức năng nào cho người dùng này.";
    }
}
