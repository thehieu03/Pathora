using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;
using MediatR;

namespace Application.Contracts.Payment
{
    public sealed record GetQRCommand(string note, long amount) : IRequest<ErrorOr<string>>;
    public class GetQRCommandValidator : AbstractValidator<GetQRCommand>
    {
        public GetQRCommandValidator()
        {
            RuleFor(x => x.note)
                .NotEmpty().WithMessage("Nội dung chuyển khoản không được để trống.");

            RuleFor(x => x.amount)
                .GreaterThan(0).WithMessage("Số tiền phải lớn hơn 0.");
        }
    }
    public sealed class GetQRCommandHandler(IPaymentService paymentService)
        : IRequestHandler<GetQRCommand, ErrorOr<string>>
    {
        public async Task<ErrorOr<string>> Handle(GetQRCommand request, CancellationToken cancellationToken)
        {
            // Kiểm tra logic ở đây nếu cần, hoặc để Pipeline tự động gọi Validator
            return await paymentService.GetQRTest(request.note, request.amount);
        }
    }
}