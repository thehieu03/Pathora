using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Entities;

public sealed class DepositPolicyEntityTests
{
    [Fact]
    public void Create_WhenValidParameters_ShouldCreateSuccessfully()
    {
        var policy = DepositPolicyEntity.Create(
            TourScope.Domestic,
            DepositType.Percentage,
            10,
            7,
            "test"
        );

        Assert.NotEqual(Guid.Empty, policy.Id);
        Assert.Equal(TourScope.Domestic, policy.TourScope);
        Assert.Equal(DepositType.Percentage, policy.DepositType);
        Assert.Equal(10, policy.DepositValue);
        Assert.Equal(7, policy.MinDaysBeforeDeparture);
        Assert.True(policy.IsActive);
        Assert.False(policy.IsDeleted);
    }

    [Fact]
    public void Create_WhenDepositValueIsZero_ShouldThrowArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            DepositPolicyEntity.Create(
                TourScope.Domestic,
                DepositType.Percentage,
                0,
                7,
                "test"
            ));

        Assert.Contains("greater than 0", exception.Message);
    }

    [Fact]
    public void Create_WhenDepositValueExceeds100Percent_ShouldThrowArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            DepositPolicyEntity.Create(
                TourScope.Domestic,
                DepositType.Percentage,
                101,
                7,
                "test"
            ));

        Assert.Contains("cannot exceed 100", exception.Message);
    }

    [Fact]
    public void Create_WhenMinDaysIsNegative_ShouldThrowArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            DepositPolicyEntity.Create(
                TourScope.Domestic,
                DepositType.Percentage,
                10,
                -1,
                "test"
            ));

        Assert.Contains("negative", exception.Message);
    }

    [Fact]
    public void Update_WhenValidParameters_ShouldUpdateSuccessfully()
    {
        var policy = DepositPolicyEntity.Create(
            TourScope.Domestic,
            DepositType.Percentage,
            10,
            7,
            "test"
        );

        policy.Update(
            TourScope.International,
            DepositType.FixedAmount,
            500,
            14,
            "test"
        );

        Assert.Equal(TourScope.International, policy.TourScope);
        Assert.Equal(DepositType.FixedAmount, policy.DepositType);
        Assert.Equal(500, policy.DepositValue);
        Assert.Equal(14, policy.MinDaysBeforeDeparture);
    }

    [Fact]
    public void SetActive_WhenCalled_ShouldUpdateActiveStatus()
    {
        var policy = DepositPolicyEntity.Create(
            TourScope.Domestic,
            DepositType.Percentage,
            10,
            7,
            "test"
        );

        policy.SetActive(false, "test");

        Assert.False(policy.IsActive);
    }

    [Fact]
    public void SoftDelete_WhenCalled_ShouldMarkAsDeleted()
    {
        var policy = DepositPolicyEntity.Create(
            TourScope.Domestic,
            DepositType.Percentage,
            10,
            7,
            "test"
        );

        policy.SoftDelete("test");

        Assert.True(policy.IsDeleted);
    }
}
