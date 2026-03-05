using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourInsuranceEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var entity = TourInsuranceEntity.Create(
            "Travel Insurance", InsuranceType.Travel, "Allianz",
            "Full coverage for accidents", 100000m, 50m, "admin",
            isOptional: true, note: "Recommended for all travelers");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal("Travel Insurance", entity.InsuranceName);
        Assert.Equal(InsuranceType.Travel, entity.InsuranceType);
        Assert.Equal("Allianz", entity.InsuranceProvider);
        Assert.Equal("Full coverage for accidents", entity.CoverageDescription);
        Assert.Equal(100000m, entity.CoverageAmount);
        Assert.Equal(50m, entity.CoverageFee);
        Assert.True(entity.IsOptional);
        Assert.Equal("Recommended for all travelers", entity.Note);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithDefaults_ShouldNotBeOptional()
    {
        var entity = TourInsuranceEntity.Create(
            "Basic", InsuranceType.Travel, "Provider", "desc", 50000m, 25m, "admin");

        Assert.False(entity.IsOptional);
        Assert.Null(entity.Note);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourInsuranceEntity.Create(
            "Basic", InsuranceType.Travel, "Provider", "desc", 50000m, 25m, "admin");

        entity.Update("Premium", InsuranceType.Health, "New Provider",
            "Extended coverage", 200000m, 100m, "editor", isOptional: true, note: "Updated");

        Assert.Equal("Premium", entity.InsuranceName);
        Assert.Equal(InsuranceType.Health, entity.InsuranceType);
        Assert.Equal("New Provider", entity.InsuranceProvider);
        Assert.Equal(200000m, entity.CoverageAmount);
        Assert.Equal(100m, entity.CoverageFee);
        Assert.True(entity.IsOptional);
        Assert.Equal("Updated", entity.Note);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
