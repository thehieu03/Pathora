using Api.Endpoint;
using Application.Contracts.Payment;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route(PaymentEndpoint.Base)]
public class PaymentController : BaseApiController
{
    [HttpPost(PaymentEndpoint.GetQR)]
    public async Task<IActionResult> CreateQr([FromBody] GetQRCommand command)
    {
        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpPost(PaymentEndpoint.CreateTransaction)]
    public async Task<IActionResult> CreateTransaction([FromBody] CreatePaymentTransactionCommand command)
    {
        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpGet(PaymentEndpoint.GetTransaction)]
    public async Task<IActionResult> GetTransaction([FromRoute] string code)
    {
        var result = await Sender.Send(new GetPaymentTransactionQuery(code));
        return HandleResult(result);
    }

    [HttpPost(PaymentEndpoint.ExpireTransaction)]
    public async Task<IActionResult> ExpireTransaction([FromRoute] string code)
    {
        var result = await Sender.Send(new ExpirePaymentTransactionCommand(code));
        return HandleResult(result);
    }
}
