using System.ComponentModel;

namespace Domain.Enums;

public enum PaymentMethod
{
    [Description("Cash")]
    Cash = 1,
    [Description("BankTransfer")]
    BankTransfer = 2,
    [Description("Card")]
    Card = 3,
    [Description("Momo")]
    Momo = 4,
    [Description("VnPay")]
    VnPay = 5
}
