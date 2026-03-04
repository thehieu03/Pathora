using Application.Features.Public.Queries;
using FluentValidation;

namespace Application.Features.Public.Validators;

public sealed class SearchToursQueryValidator : AbstractValidator<SearchToursQuery>
{
    public SearchToursQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Trang phải lớn hơn hoặc bằng 1");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("Kích thước trang phải từ 1 đến 50");

        RuleFor(x => x.People)
            .InclusiveBetween(1, 50)
            .When(x => x.People.HasValue)
            .WithMessage("Số người phải từ 1 đến 50");
    }
}
