using Domain.ApiThirdPatyResponse;
using MediatR;

namespace Application.Contracts.Payment;

public sealed record ProcessPaymentCommand(SepayApiResponse? Response) : IRequest<Unit>;
