using Api.Endpoint;
using Application.Contracts.Booking;
using Application.Features.BookingManagement.Activity;
using Application.Features.BookingManagement.Participant;
using Application.Features.BookingManagement.Payable;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route(BookingManagementEndpoint.Base)]
public class BookingManagementController : BaseApiController
{
    [HttpGet(BookingManagementEndpoint.Activities)]
    public async Task<IActionResult> GetActivities(Guid id)
    {
        var result = await Sender.Send(new GetBookingActivityReservationsQuery(id));
        return HandleResult(result);
    }

    [HttpPost(BookingManagementEndpoint.Activities)]
    public async Task<IActionResult> CreateActivity(Guid id, [FromBody] CreateBookingActivityReservationRequest request)
    {
        var command = new CreateBookingActivityReservationCommand(
            id,
            request.SupplierId,
            request.Order,
            request.ActivityType,
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            request.TotalServicePrice,
            request.TotalServicePriceAfterTax,
            request.Note);

        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpPut(BookingManagementEndpoint.ActivityDetail)]
    public async Task<IActionResult> UpdateActivity(
        Guid id,
        Guid activityId,
        [FromBody] UpdateBookingActivityReservationRequest request)
    {
        var command = new UpdateBookingActivityReservationCommand(
            activityId,
            request.SupplierId,
            request.Order,
            request.ActivityType,
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            request.TotalServicePrice,
            request.TotalServicePriceAfterTax,
            request.Status,
            request.Note);

        var result = await Sender.Send(command);
        return HandleUpdated(result);
    }

    [HttpGet(BookingManagementEndpoint.TransportDetails)]
    public async Task<IActionResult> GetTransportDetails(Guid id)
    {
        var result = await Sender.Send(new GetBookingTransportDetailsQuery(id));
        return HandleResult(result);
    }

    [HttpGet(BookingManagementEndpoint.AccommodationDetails)]
    public async Task<IActionResult> GetAccommodationDetails(Guid id)
    {
        var result = await Sender.Send(new GetBookingAccommodationDetailsQuery(id));
        return HandleResult(result);
    }

    [HttpGet(BookingManagementEndpoint.Participants)]
    public async Task<IActionResult> GetParticipants(Guid id)
    {
        var result = await Sender.Send(new GetBookingParticipantsQuery(id));
        return HandleResult(result);
    }

    [HttpPost(BookingManagementEndpoint.Participants)]
    public async Task<IActionResult> CreateParticipant(Guid id, [FromBody] CreateParticipantDto request)
    {
        var command = new CreateParticipantCommand(
            id,
            request.ParticipantType,
            request.FullName,
            request.DateOfBirth,
            request.Gender,
            request.Nationality);

        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpGet(BookingManagementEndpoint.Payables)]
    public async Task<IActionResult> GetPayables(Guid id)
    {
        var result = await Sender.Send(new GetSupplierPayablesQuery(id));
        return HandleResult(result);
    }

    [HttpPost(BookingManagementEndpoint.Payables)]
    public async Task<IActionResult> CreatePayable(Guid id, [FromBody] CreateSupplierPayableRequest request)
    {
        var command = new CreateSupplierPayableCommand(
            id,
            request.SupplierId,
            request.ExpectedAmount,
            request.DueAt,
            request.Note);

        var result = await Sender.Send(command);
        return HandleCreated(result);
    }
}

public sealed record CreateBookingActivityReservationRequest(
    Guid? SupplierId,
    int Order,
    string ActivityType,
    string Title,
    string? Description,
    DateTimeOffset? StartTime,
    DateTimeOffset? EndTime,
    decimal TotalServicePrice,
    decimal TotalServicePriceAfterTax,
    string? Note);

public sealed record UpdateBookingActivityReservationRequest(
    Guid? SupplierId,
    int Order,
    string ActivityType,
    string Title,
    string? Description,
    DateTimeOffset? StartTime,
    DateTimeOffset? EndTime,
    decimal? TotalServicePrice,
    decimal? TotalServicePriceAfterTax,
    ReservationStatus? Status,
    string? Note);

public sealed record CreateSupplierPayableRequest(
    Guid SupplierId,
    decimal ExpectedAmount,
    DateTimeOffset? DueAt,
    string? Note);
