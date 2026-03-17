using System.Text.Json;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public static class SiteContentSeedData
{
    public static bool SeedData(AppDbContext context)
    {
        if (context.SiteContents.Any())
            return false;

        var seedData = GetAboutPageSeedData()
            .Concat(GetPoliciesPageSeedData())
            .ToList();

        context.SiteContents.AddRange(seedData);
        context.SaveChanges();
        return true;
    }

    private static List<SiteContentEntity> GetAboutPageSeedData()
    {
        var teamMembers = JsonSerializer.Serialize(new[]
        {
            new { name = "Le Anh Thu", role = "Master Tigress", description = "Disciplined and fierce leader with unmatched strength and precision.", toursLed = 320, image = "https://www.figma.com/api/mcp/asset/0ea21104-3b97-48ed-b725-d3fcf0ee6486" },
            new { name = "Phong Thai", role = "Master Viper", description = "Graceful and agile, specializing in fluid movements and elegant techniques.", toursLed = 210, image = "https://www.figma.com/api/mcp/asset/a3caa128-9842-4560-81e6-0a73263c6152" },
            new { name = "Nguyen The Hieu", role = "Master Crane", description = "Patient and wise, mastering aerial combat with extraordinary balance.", toursLed = 185, image = "https://www.figma.com/api/mcp/asset/db143d75-3a2b-4cba-9cb2-834ab9468540" },
            new { name = "Ngo Quoc Huy", role = "Master Mantis", description = "Small but mighty, bringing quick reflexes and surprising power to every challenge.", toursLed = 143, image = "https://www.figma.com/api/mcp/asset/8c5b96f4-4b7a-40f9-8c8e-c9bc23b4fdaa" },
            new { name = "Gorner Robin", role = "Master Monkey", description = "Playful and energetic, combining humor with incredible acrobatic skills.", toursLed = 98, image = "https://www.figma.com/api/mcp/asset/691b9bfd-c838-429e-a825-46288f09bdfd" }
        });

        var milestones = JsonSerializer.Serialize(new[]
        {
            new { year = "2010", titleKey = "founded", descKey = "foundedDesc" },
            new { year = "2014", titleKey = "first10k", descKey = "first10kDesc" },
            new { year = "2018", titleKey = "expanded60", descKey = "expanded60Desc" },
            new { year = "2022", titleKey = "digitalFirst", descKey = "digitalFirstDesc" },
            new { year = "2025", titleKey = "happy92k", descKey = "happy92kDesc" }
        });

        var stats = JsonSerializer.Serialize(new[]
        {
            new { icon = "heroicons-outline:map-pin", value = "240+", labelKey = "destinations" },
            new { icon = "heroicons-outline:users", value = "92K+", labelKey = "happyTravelers" },
            new { icon = "heroicons-outline:globe-alt", value = "3,600+", labelKey = "toursOffered" },
            new { icon = "heroicons-outline:heart", value = "98%", labelKey = "satisfactionRate" }
        });

        var values = JsonSerializer.Serialize(new[]
        {
            new { icon = "heroicons-outline:globe-alt", titleKey = "globalExpertise", descKey = "globalExpertiseDesc" },
            new { icon = "heroicons-outline:shield-check", titleKey = "safeTrusted", descKey = "safeTrustedDesc" },
            new { icon = "heroicons-outline:heart", titleKey = "tailoredForYou", descKey = "tailoredForYouDesc" },
            new { icon = "heroicons-outline:bolt", titleKey = "seamlessExperience", descKey = "seamlessExperienceDesc" }
        });

        return new List<SiteContentEntity>
        {
            SiteContentEntity.Create("about", "team-members", teamMembers, "seed"),
            SiteContentEntity.Create("about", "milestones", milestones, "seed"),
            SiteContentEntity.Create("about", "stats", stats, "seed"),
            SiteContentEntity.Create("about", "values", values, "seed")
        };
    }

    private static List<SiteContentEntity> GetPoliciesPageSeedData()
    {
        var policySections = JsonSerializer.Serialize(new[]
        {
            new { icon = "heroicons-outline:document-text", titleKey = "bookingPayment", items = new[] { "bookingPaymentItem1", "bookingPaymentItem2", "bookingPaymentItem3", "bookingPaymentItem4" } },
            new { icon = "heroicons-outline:arrow-path", titleKey = "cancellationRefund", items = new[] { "cancellationRefundItem1", "cancellationRefundItem2", "cancellationRefundItem3", "cancellationRefundItem4", "cancellationRefundItem5" } },
            new { icon = "heroicons-outline:arrow-path", titleKey = "modificationRescheduling", items = new[] { "modificationItem1", "modificationItem2", "modificationItem3", "modificationItem4" } },
            new { icon = "heroicons-outline:shield-check", titleKey = "healthSafety", items = new[] { "healthSafetyItem1", "healthSafetyItem2", "healthSafetyItem3", "healthSafetyItem4" } },
            new { icon = "heroicons-outline:lock-closed", titleKey = "privacyPolicy", items = new[] { "privacyPolicyItem1", "privacyPolicyItem2", "privacyPolicyItem3", "privacyPolicyItem4" } },
            new { icon = "heroicons-outline:exclamation-circle", titleKey = "liabilityDisclaimer", items = new[] { "liabilityItem1", "liabilityItem2", "liabilityItem3", "liabilityItem4" } }
        });

        return new List<SiteContentEntity>
        {
            SiteContentEntity.Create("policies", "policy-sections", policySections, "seed")
        };
    }
}
