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

        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinPrice.HasValue)
            .WithMessage("Giá tối thiểu phải lớn hơn hoặc bằng 0");

        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxPrice.HasValue)
            .WithMessage("Giá tối đa phải lớn hơn hoặc bằng 0");

        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(x => x.MinPrice!.Value)
            .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue)
            .WithMessage("Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu");

        RuleFor(x => x.MinDays)
            .GreaterThanOrEqualTo(1)
            .When(x => x.MinDays.HasValue)
            .WithMessage("Số ngày tối thiểu phải lớn hơn hoặc bằng 1");

        RuleFor(x => x.MaxDays)
            .GreaterThanOrEqualTo(1)
            .When(x => x.MaxDays.HasValue)
            .WithMessage("Số ngày tối đa phải lớn hơn hoặc bằng 1");

        RuleFor(x => x.MaxDays)
            .GreaterThanOrEqualTo(x => x.MinDays!.Value)
            .When(x => x.MinDays.HasValue && x.MaxDays.HasValue)
            .WithMessage("Số ngày tối đa phải lớn hơn hoặc bằng số ngày tối thiểu");
    }
}
