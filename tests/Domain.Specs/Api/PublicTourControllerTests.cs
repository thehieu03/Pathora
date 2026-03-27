using Api.Controllers.Public;
using Application.Dtos;
using Application.Features.Public.Queries;
using Contracts.Interfaces;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;

namespace Domain.Specs.Api;

public sealed class PublicTourControllerTests
{
    [Fact]
    public async Task GetTourDetail_WhenQuerySucceeds_ShouldReturnOkAndPayload()
    {
        var id = Guid.CreateVersion7();
        var tourDto = new TourDto(
            id,
            "TOUR-001",
            "Paris Tour",
            "Short desc",
            "Long desc",
            TourStatus.Active,
            TourScope.Domestic,
            CustomerSegment.Group,
            null,
            null,
            false,
            new ImageDto(null, null, null, null),
            [],
            [],
            "tester",
            DateTimeOffset.UtcNow,
            "tester",
            DateTimeOffset.UtcNow);

        var (controller, probe) = ApiControllerTestHelper
            .BuildController<PublicTourController, GetPublicTourDetailQuery, TourDto>(
                tourDto, $"/api/public/tours/{id}");
        var languageContext = new TestLanguageContext { CurrentLanguage = "vi" };

        var actionResult = await controller.GetTourDetail(id, languageContext);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: $"/api/public/tours/{id}",
            expectedData: tourDto);
        Assert.Equal(new GetPublicTourDetailQuery(id, "vi"), probe.CapturedRequest);
    }

    [Fact]
    public async Task GetTourDetail_WhenTourNotFound_ShouldReturnNotFoundResponse()
    {
        var id = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<PublicTourController, GetPublicTourDetailQuery, TourDto>(
                Error.NotFound("Tour.NotFound", "Tour không tìm thấy"),
                $"/api/public/tours/{id}");
        var languageContext = new TestLanguageContext { CurrentLanguage = "en" };

        var actionResult = await controller.GetTourDetail(id, languageContext);

        ApiControllerTestHelper.AssertErrorResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status404NotFound,
            expectedCode: "Tour.NotFound",
            expectedMessage: "Tour không tìm thấy",
            expectedInstance: $"/api/public/tours/{id}");
        Assert.Equal(new GetPublicTourDetailQuery(id, "en"), probe.CapturedRequest);
    }

    private sealed class TestLanguageContext : ILanguageContext
    {
        public string CurrentLanguage { get; set; } = ILanguageContext.DefaultLanguage;
    }
}
