using Api.Endpoint;
using Application.Common.Constant;
using Application.Dtos;
using Application.Features.TourInstance.Commands;
using Application.Features.TourInstance.Queries;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = RoleConstants.SuperAdmin_Admin_TourManager_TourOperator)]
[Route(TourInstanceEndpoint.Base)]
public class TourInstanceController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchText,
        [FromQuery] TourInstanceStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Sender.Send(new GetAllTourInstancesQuery(searchText, status, pageNumber, pageSize));
        return HandleResult(result);
    }

    [HttpGet(TourInstanceEndpoint.Id)]
    public async Task<IActionResult> GetDetail(Guid id)
    {
        var result = await Sender.Send(new GetTourInstanceDetailQuery(id));
        return HandleResult(result);
    }

    [HttpGet(TourInstanceEndpoint.PricingTiers)]
    public async Task<IActionResult> GetPricingTiers(Guid id)
    {
        var result = await Sender.Send(new GetTourInstancePricingTiersQuery(id));
        return HandleResult(result);
    }

    [HttpPut(TourInstanceEndpoint.PricingTiers)]
    public async Task<IActionResult> UpsertPricingTiers(Guid id, [FromBody] List<DynamicPricingDto> tiers)
    {
        var result = await Sender.Send(new UpsertTourInstancePricingTiersCommand(id, tiers));
        return HandleUpdated(result);
    }

    [HttpDelete(TourInstanceEndpoint.ClearPricingTiers)]
    public async Task<IActionResult> ClearPricingTiers(Guid id)
    {
        var result = await Sender.Send(new ClearTourInstancePricingTiersCommand(id));
        return HandleDeleted(result);
    }

    [HttpGet(TourInstanceEndpoint.ResolvePricing)]
    public async Task<IActionResult> ResolvePricing(Guid id, [FromQuery] int participants)
    {
        var result = await Sender.Send(new ResolveTourInstancePricingQuery(id, participants));
        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTourInstanceCommand command)
    {
        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateTourInstanceCommand command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpDelete(TourInstanceEndpoint.Id)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await Sender.Send(new DeleteTourInstanceCommand(id));
        return HandleResult(result);
    }

    [HttpGet(TourInstanceEndpoint.Stats)]
    public async Task<IActionResult> GetStats()
    {
        var result = await Sender.Send(new GetTourInstanceStatsQuery());
        return HandleResult(result);
    }

    [HttpPatch(TourInstanceEndpoint.ChangeStatus)]
    public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ChangeTourInstanceStatusRequest request)
    {
        var result = await Sender.Send(new ChangeTourInstanceStatusCommand(id, request.Status));
        return HandleResult(result);
    }
}

public sealed record ChangeTourInstanceStatusRequest(TourInstanceStatus Status);
