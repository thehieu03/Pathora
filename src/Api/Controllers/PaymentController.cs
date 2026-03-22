using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Api.Endpoint;
using Application.Common.Constant;
using Application.Contracts.Payment;

namespace Api.Controllers;

[Authorize(Roles = RoleConstants.SuperAdmin_Admin_Accountant)]
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

    [AllowAnonymous]
    [HttpGet(PaymentEndpoint.GetTransactionStatus)]
    public async Task<IActionResult> GetTransactionStatus([FromRoute] string code)
    {
        var result = await Sender.Send(new GetNormalizedPaymentStatusQuery(code));
        return HandleResult(result);
    }

    [AllowAnonymous]
    [HttpGet(PaymentEndpoint.Return)]
    public async Task<IActionResult> ReconcileReturn(
        [FromQuery] string? transactionCode,
        [FromQuery] string? code,
        [FromQuery] string? orderCode)
    {
        var resolvedCode = ResolveTransactionCode(transactionCode, code, orderCode);
        if (string.IsNullOrWhiteSpace(resolvedCode))
        {
            return BadRequest(new { message = "Missing transaction code for payment return callback." });
        }

        var result = await Sender.Send(new ReconcilePaymentReturnCommand(resolvedCode));
        return HandleResult(result);
    }

    [AllowAnonymous]
    [HttpGet(PaymentEndpoint.Cancel)]
    public async Task<IActionResult> ReconcileCancel(
        [FromQuery] string? transactionCode,
        [FromQuery] string? code,
        [FromQuery] string? orderCode)
    {
        var resolvedCode = ResolveTransactionCode(transactionCode, code, orderCode);
        if (string.IsNullOrWhiteSpace(resolvedCode))
        {
            return BadRequest(new { message = "Missing transaction code for payment cancel callback." });
        }

        var result = await Sender.Send(new ReconcilePaymentCancelCommand(resolvedCode));
        return HandleResult(result);
    }

    [HttpPost(PaymentEndpoint.ExpireTransaction)]
    public async Task<IActionResult> ExpireTransaction([FromRoute] string code)
    {
        var result = await Sender.Send(new ExpirePaymentTransactionCommand(code));
        return HandleResult(result);
    }

    private static string ResolveTransactionCode(string? transactionCode, string? code, string? orderCode)
    {
        if (!string.IsNullOrWhiteSpace(transactionCode))
        {
            return transactionCode;
        }

        if (!string.IsNullOrWhiteSpace(code))
        {
            return code;
        }

        return orderCode ?? string.Empty;
    }
}
