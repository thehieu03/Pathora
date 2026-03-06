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
        var query = new SearchToursQuery("Hà Nội", "VIP", null, null, 1, 10);
        var result = _validator.TestValidate(query);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WhenPageZero_ShouldHaveError()
    {
        var query = new SearchToursQuery(null, null, null, null, 0, 10);
        var result = _validator.TestValidate(query);
        result.ShouldHaveValidationErrorFor(x => x.Page);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void Validate_WhenPageSizeOutOfRange_ShouldHaveError(int pageSize)
    {
        var query = new SearchToursQuery(null, null, null, null, 1, pageSize);
        var result = _validator.TestValidate(query);
        result.ShouldHaveValidationErrorFor(x => x.PageSize);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void Validate_WhenPeopleOutOfRange_ShouldHaveError(int people)
    {
        var query = new SearchToursQuery(null, null, null, people, 1, 10);
        var result = _validator.TestValidate(query);
        result.ShouldHaveValidationErrorFor(x => x.People);
    }

    [Fact]
    public void Validate_WhenPeopleNull_ShouldPass()
    {
        var query = new SearchToursQuery(null, null, null, null, 1, 10);
        var result = _validator.TestValidate(query);
        result.ShouldNotHaveValidationErrorFor(x => x.People);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(25)]
    [InlineData(50)]
    public void Validate_WhenPeopleInRange_ShouldPass(int people)
    {
        var query = new SearchToursQuery(null, null, null, people, 1, 10);
        var result = _validator.TestValidate(query);
        result.ShouldNotHaveValidationErrorFor(x => x.People);
    }
}
