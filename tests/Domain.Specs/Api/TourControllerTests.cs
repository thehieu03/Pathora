using Api.Controllers;
using Application.Common.Contracts;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;

namespace Domain.Specs.Api;

public sealed class TourControllerTests
{
    [Fact]
    public async Task GetAll_WhenQuerySucceeds_ShouldReturnOkAndPayload()
    {
        var tours = new List<TourVm>
        {
            new(
                Guid.CreateVersion7(),
                "TOUR-001",
                "Tour Đà Nẵng",
                "Mô tả ngắn",
                "Active",
                DateTimeOffset.UtcNow)
        };
        var response = new PaginatedList<TourVm>(tours.Count, tours);
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, GetAllToursQuery, PaginatedList<TourVm>>(response, "/api/tour");

        var actionResult = await controller.GetAll(searchText: "Đà Nẵng", pageNumber: 2, pageSize: 5);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour",
            expectedData: response);
        Assert.Equal(new GetAllToursQuery("Đà Nẵng", 2, 5), probe.CapturedRequest);
    }

    [Fact]
    public async Task GetDetail_WhenTourMissing_ShouldReturnNotFoundResponse()
    {
        var id = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, GetTourDetailQuery, TourEntity>(
                Error.NotFound("Tour.NotFound", "Không tìm thấy tour"),
                $"/api/tour/{id}");

        var actionResult = await controller.GetDetail(id);

        ApiControllerTestHelper.AssertErrorResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status404NotFound,
            expectedCode: "Tour.NotFound",
            expectedMessage: "Không tìm thấy tour",
            expectedInstance: $"/api/tour/{id}");
        Assert.Equal(new GetTourDetailQuery(id), probe.CapturedRequest);
    }

    [Fact]
    public async Task Create_WhenCommandSucceeds_ShouldReturnOkAndPayload()
    {
        var command = new CreateTourCommand(
            TourCode: "TOUR-001",
            TourName: "Tour Đà Nẵng",
            ShortDescription: "Mô tả ngắn",
            LongDescription: "Mô tả dài",
            SEOTitle: "SEO title",
            SEODescription: "SEO description",
            Status: TourStatus.Active);
        var response = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, CreateTourCommand, Guid>(response, "/api/tour");

        var actionResult = await controller.Create(command);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour",
            expectedData: response);
        Assert.Equal(command, probe.CapturedRequest);
    }

    [Fact]
    public async Task Update_WhenCommandSucceeds_ShouldReturnOkAndPayload()
    {
        var command = new UpdateTourCommand(
            Id: Guid.CreateVersion7(),
            TourCode: "TOUR-001",
            TourName: "Tour Đà Nẵng",
            ShortDescription: "Mô tả ngắn",
            LongDescription: "Mô tả dài",
            SEOTitle: "SEO title",
            SEODescription: "SEO description",
            Status: TourStatus.Active);
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, UpdateTourCommand, Success>(Result.Success, "/api/tour");

        var actionResult = await controller.Update(command);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour",
            expectedData: Result.Success);
        Assert.Equal(command, probe.CapturedRequest);
    }

    [Fact]
    public async Task Delete_WhenTourMissing_ShouldReturnNotFoundResponse()
    {
        var id = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, DeleteTourCommand, Success>(
                Error.NotFound("Tour.NotFound", "Không tìm thấy tour"),
                $"/api/tour/{id}");

        var actionResult = await controller.Delete(id);

        ApiControllerTestHelper.AssertErrorResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status404NotFound,
            expectedCode: "Tour.NotFound",
            expectedMessage: "Không tìm thấy tour",
            expectedInstance: $"/api/tour/{id}");
        Assert.Equal(new DeleteTourCommand(id), probe.CapturedRequest);
    }
}
