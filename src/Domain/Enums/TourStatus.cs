using System.ComponentModel;

namespace Domain.Enums;

public enum TourStatus
{
    [Description("Đang hoạt động")]
    Active = 1,
    [Description("Đã ngừng hoạt động")]
    Inactive = 2,
    [Description("Đang chờ duyệt")]
    Pending = 3,
     [Description("Đã bị từ chối")]
     Rejected = 4
}
