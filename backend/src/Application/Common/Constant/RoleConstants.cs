namespace Application.Common.Constant;

public static class RoleConstants
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string TourManager = "TourManager";
    public const string TourOperator = "TourOperator";
    public const string SalesManager = "SalesManager";
    public const string SalesStaff = "SalesStaff";
    public const string Accountant = "Accountant";
    public const string Customer = "Customer";

    // Combined role policies
    public const string SuperAdmin_Admin = "SuperAdmin,Admin";
    public const string SuperAdmin_Admin_Accountant = "SuperAdmin,Admin,Accountant";
    public const string SuperAdmin_Admin_TourManager_TourOperator = "SuperAdmin,Admin,TourManager,TourOperator";
    public const string SuperAdmin_Admin_TourManager_TourOperator_SalesManager_SalesStaff = "SuperAdmin,Admin,TourManager,TourOperator,SalesManager,SalesStaff";
    public const string SuperAdmin_Admin_Customer = "SuperAdmin,Admin,Customer";
}
