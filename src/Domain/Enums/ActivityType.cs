using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Domain.Enums
{
    public enum TourDayActivityType
    {
        [Description("Move between location")]
        Move = 0,
        [Description("Visit a place of interest")]
        Sightseeing = 1,
        [Description("Have a meal at a restaurant")]
        Dining = 2,
        [Description("Go shopping")]
        Shopping = 3,
        [Description("Enjoy entertainment activities")]
        Entertainment = 4,
        [Description("Relax and unwind")]
        Relaxation = 5,
        [Description("Experience local culture and traditions")]
        Cultural = 6,
        [Description("Engage in outdoor activities")]
        Outdoor = 7,
        [Description("Other activities")]
        Other = 99
    }
}
