using System.ComponentModel;

namespace Domain.Enums;

public enum AssignedRole
{
    [Description("TourManager")]
    TourManager = 1,

    [Description("TourOperator")]
    TourOperator = 2,

    [Description("TourGuide")]
    TourGuide = 3,

    [Description("Accountant")]
    Accountant = 4
}
