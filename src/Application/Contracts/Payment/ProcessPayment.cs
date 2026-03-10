using Domain.ApiThirdPatyResponse;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Contracts.Payment
{
    public sealed record ProcessPaymentCommand(SepayApiResponse Response);
}
