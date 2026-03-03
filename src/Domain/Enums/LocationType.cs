using System.ComponentModel;

namespace Domain.Enums;

public enum LocationType
{
    [Description("Tourist Attraction")]
    TouristAttraction = 0,
    [Description("Museum")]
    Museum = 1,
    [Description("National Park")]
    NationalPark = 2,
    [Description("Beach")]
    Beach = 3,
    [Description("Temple")]
    Temple = 4,
    [Description("Market")]
    Market = 5,
    [Description("Restaurant")]
    Restaurant = 6,
    [Description("Hotel")]
    Hotel = 7,
    [Description("Airport")]
    Airport = 8,
    [Description("Train Station")]
    TrainStation = 9,
    [Description("Bus Station")]
    BusStation = 10,
    [Description("Other")]
    Other = 99
}
