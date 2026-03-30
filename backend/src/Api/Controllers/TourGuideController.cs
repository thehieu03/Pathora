using Api.Endpoint;
using Application.Common.Constant;
using Application.Contracts.Booking;
using Application.Features.BookingManagement.TourGuide;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = RoleConstants.SuperAdmin_Admin)]
[Route(TourGuideEndpoint.Base)]
public class TourGuideController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetTourGuides(
        [FromQuery] bool? isAvailable,
        [FromQuery] string? language,
        [FromQuery] string? specialization)
    {
        var result = await Sender.Send(new GetTourGuidesQuery(isAvailable, language, specialization));
        return HandleResult(result);
    }

    [HttpGet(TourGuideEndpoint.Available)]
    public async Task<IActionResult> GetAvailableTourGuides(
        [FromQuery] string? language,
        [FromQuery] string? specialization)
    {
        var result = await Sender.Send(new GetTourGuidesQuery(true, language, specialization));
        return HandleResult(result);
    }

    [HttpGet(TourGuideEndpoint.Id)]
    public async Task<IActionResult> GetTourGuideById(Guid id)
    {
        var result = await Sender.Send(new GetTourGuideByIdQuery(id));
        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTourGuide([FromBody] CreateTourGuideDto request)
    {
        var command = new CreateTourGuideCommand(
            request.FullName,
            request.LicenseNumber,
            request.NickName,
            request.Gender,
            request.DateOfBirth,
            request.PhoneNumber,
            request.Email,
            request.Address,
            request.LicenseExpiryDate,
            request.Languages,
            request.Specializations,
            request.ProfileImageUrl,
            request.YearsOfExperience,
            request.Rating,
            request.IsAvailable,
            request.IsActive,
            request.Note);

        var result = await Sender.Send(command);
        return HandleCreated(result);
    }

    [HttpPut(TourGuideEndpoint.Id)]
    public async Task<IActionResult> UpdateTourGuide(Guid id, [FromBody] UpdateTourGuideDto request)
    {
        var command = new UpdateTourGuideCommand(
            id,
            request.FullName,
            request.LicenseNumber,
            request.NickName,
            request.Gender,
            request.DateOfBirth,
            request.PhoneNumber,
            request.Email,
            request.Address,
            request.LicenseExpiryDate,
            request.Languages,
            request.Specializations,
            request.ProfileImageUrl,
            request.YearsOfExperience,
            request.Rating,
            request.IsAvailable,
            request.IsActive,
            request.Note);

        var result = await Sender.Send(command);
        return HandleUpdated(result);
    }

    [HttpDelete(TourGuideEndpoint.Id)]
    public async Task<IActionResult> DeleteTourGuide(Guid id)
    {
        var result = await Sender.Send(new DeleteTourGuideCommand(id));
        return HandleDeleted(result);
    }
}
