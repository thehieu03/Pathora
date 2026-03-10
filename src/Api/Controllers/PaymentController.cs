using Api.Endpoint;
using Application.Contracts.Payment;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Microsoft.AspNetCore.Components.Route(AuthEndpoint.Base)]
public class PaymentController : BaseApiController
{
    [HttpPost(PaymentEndpoint.GetQR)]
    public async Task<IActionResult> CreateQR(GetQRCommand command)
    {
        var result = await Sender.Send(command);
        return HandleCreated(result);
    }
}
