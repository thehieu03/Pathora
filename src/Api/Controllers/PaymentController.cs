using Api.Endpoint;
using Application.Contracts.Payment;
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
}
