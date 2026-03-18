using Domain.Entities;
using Domain.Specs.Helpers;

namespace Domain.Specs.Entities;

public sealed class TaxConfigEntityTests
{
    [Fact]
    public void Create_WhenValidParameters_ShouldCreateSuccessfully()
    {
        var config = TestDataBuilder.CreateTaxConfig("VAT", 10);

        Assert.NotEqual(Guid.Empty, config.Id);
        Assert.Equal("VAT", config.TaxName);
        Assert.Equal(10, config.TaxRate);
        Assert.True(config.IsActive);
    }

    [Fact]
    public void Update_WhenValidParameters_ShouldUpdateSuccessfully()
    {
        var config = TestDataBuilder.CreateTaxConfig("VAT", 10);

        config.Update(
            "Service Tax",
            15,
            "Updated description",
            DateTimeOffset.UtcNow.AddDays(60),
            "test"
        );

        Assert.Equal("Service Tax", config.TaxName);
        Assert.Equal(15, config.TaxRate);
        Assert.Equal("Updated description", config.Description);
    }

    [Fact]
    public void Activate_WhenCalled_ShouldSetIsActiveToTrue()
    {
        var config = TestDataBuilder.CreateTaxConfig("VAT", 10);

        config.Deactivate("test");
        Assert.False(config.IsActive);

        config.Activate("test");

        Assert.True(config.IsActive);
    }

    [Fact]
    public void Deactivate_WhenCalled_ShouldSetIsActiveToFalse()
    {
        var config = TestDataBuilder.CreateTaxConfig("VAT", 10);

        Assert.True(config.IsActive);

        config.Deactivate("test");

        Assert.False(config.IsActive);
    }

    [Fact]
    public void GenerateTaxCode_WhenCalled_ShouldGenerateUniqueCode()
    {
        var code1 = TaxConfigEntity.GenerateTaxCode();
        var code2 = TaxConfigEntity.GenerateTaxCode();

        Assert.NotEqual(code1, code2);
        Assert.StartsWith("TAX-", code1);
        Assert.StartsWith("TAX-", code2);
    }
}
