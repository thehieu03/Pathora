using Application.Features.Public.Queries;
using Application.Features.Public.Validators;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class SearchToursQueryValidatorTests
{
    private readonly SearchToursQueryValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var query = new SearchToursQuery(
            Q: "beach",
            Destination: "Hà Nội",
            Classification: "VIP",
            Date: new DateOnly(2026, 5, 20),
            People: 4,
            MinPrice: 1000000,
            MaxPrice: 5000000,
            MinDays: 3,
            MaxDays: 7,
            Page: 1,
            PageSize: 10);

        var result = _validator.TestValidate(query);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WhenPageZero_ShouldHaveError()
    {
        var query = new SearchToursQuery(null, null, null, null, null, null, null, null, null, 0, 10);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.Page);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void Validate_WhenPageSizeOutOfRange_ShouldHaveError(int pageSize)
    {
        var query = new SearchToursQuery(null, null, null, null, null, null, null, null, null, 1, pageSize);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.PageSize);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void Validate_WhenPeopleOutOfRange_ShouldHaveError(int people)
    {
        var query = new SearchToursQuery(null, null, null, null, people, null, null, null, null, 1, 10);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.People);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Validate_WhenMinPriceNegative_ShouldHaveError(decimal minPrice)
    {
        var query = new SearchToursQuery(null, null, null, null, null, minPrice, null, null, null, 1, 10);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.MinPrice);
    }

    [Fact]
    public void Validate_WhenMaxPriceLowerThanMinPrice_ShouldHaveError()
    {
        var query = new SearchToursQuery(null, null, null, null, null, 3000000, 2000000, null, null, 1, 10);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.MaxPrice);
    }

    [Fact]
    public void Validate_WhenMaxDaysLowerThanMinDays_ShouldHaveError()
    {
        var query = new SearchToursQuery(null, null, null, null, null, null, null, 7, 3, 1, 10);

        var result = _validator.TestValidate(query);

        result.ShouldHaveValidationErrorFor(x => x.MaxDays);
    }
}
