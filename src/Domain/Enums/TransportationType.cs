using System.ComponentModel;

namespace Domain.Enums;

public enum TransportationType
{
    [Description("Flight")]
    Flight = 0,
    [Description("Train")]
    Train = 1,
    [Description("Bus")]
    Bus = 2,
    [Description("Car")]
    Car = 3,
    [Description("Taxi")]
    Taxi = 4,
    [Description("Boat")]
    Boat = 5,
    [Description("Ferry")]
    Ferry = 6,
    [Description("Motorbike")]
    Motorbike = 7,
    [Description("Bicycle")]
    Bicycle = 8,
    [Description("Walking")]
    Walking = 9,
    [Description("Other")]
    Other = 99
}
