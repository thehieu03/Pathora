using Api.Controllers;
using Application.Contracts.File;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Services;
using Domain.Entities.Translations;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;

namespace Domain.Specs.Api;

public sealed class TourControllerTranslationTests
{
    private static IFileService StubFileService()
    {
        return new StubFileServiceImpl();
    }

    private sealed class StubFileServiceImpl : IFileService
    {
        public Task<FileMetadataVm> UploadFileAsync(UploadFileRequest request)
            => Task.FromResult(new FileMetadataVm(Guid.CreateVersion7(), "http://cdn/test.jpg", request.FileName, "image/jpeg", request.Length));

        public Task<IEnumerable<FileMetadataVm>> UploadMultipleFilesAsync(UploadMultipleFilesRequest request)
            => Task.FromResult<IEnumerable<FileMetadataVm>>([]);

        public Task DeleteMultipleFilesAsync(DeleteMultipleFilesRequest request)
            => Task.CompletedTask;
    }

    [Fact]
    public async Task Create_WhenCamelCaseTranslationsProvided_ShouldMapTranslationsToCommand()
    {
        var response = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, CreateTourCommand, Guid>(
                response, "/api/tour", StubFileService());

        var translationsJson = """
                               {
                                 "en": {
                                   "tourName": "English camel case",
                                   "shortDescription": "English short",
                                   "longDescription": "English long",
                                   "seoTitle": "SEO title",
                                   "seoDescription": "SEO description"
                                 }
                               }
                               """;

        await controller.Create(
            tourName: "Tour goc",
            shortDescription: "Mo ta goc",
            longDescription: "Mo ta dai goc",
            seoTitle: null,
            seoDescription: null,
            status: TourStatus.Active,
            thumbnail: null,
            images: null,
            translations: translationsJson);

        Assert.NotNull(probe.CapturedRequest);
        Assert.NotNull(probe.CapturedRequest.Translations);
        Assert.True(probe.CapturedRequest.Translations!.ContainsKey("en"));
        Assert.Equal("English camel case", probe.CapturedRequest.Translations["en"].TourName);
        Assert.Equal("SEO title", probe.CapturedRequest.Translations["en"].SEOTitle);
    }

    [Fact]
    public async Task Create_WhenTranslationsProvided_ShouldMapTranslationsToCommand()
    {
        var response = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, CreateTourCommand, Guid>(
                response, "/api/tour", StubFileService());

        var translationsJson = """
                               {
                                 "vi": {
                                   "description": "Tour tiếng Việt",
                                   "shortDescription": "Mô tả vi",
                                   "longDescription": "Mô tả dài vi"
                                 },
                                 "en": {
                                   "description": "English tour",
                                   "shortDescription": "English short",
                                   "longDescription": "English long"
                                 }
                               }
                               """;

        await controller.Create(
            tourName: "Tour gốc",
            shortDescription: "Mô tả gốc",
            longDescription: "Mô tả dài gốc",
            seoTitle: null,
            seoDescription: null,
            status: TourStatus.Active,
            thumbnail: null,
            images: null,
            translations: translationsJson);

        Assert.NotNull(probe.CapturedRequest);
        Assert.NotNull(probe.CapturedRequest.Translations);
        Assert.True(probe.CapturedRequest.Translations!.ContainsKey("vi"));
        Assert.True(probe.CapturedRequest.Translations!.ContainsKey("en"));
        Assert.Equal("English tour", probe.CapturedRequest.Translations["en"].TourName);
    }

    [Fact]
    public async Task Create_WhenPolicyIdsProvided_ShouldMapPolicyIdsToCommand()
    {
        var response = Guid.CreateVersion7();
        var visaPolicyId = Guid.CreateVersion7();
        var depositPolicyId = Guid.CreateVersion7();
        var pricingPolicyId = Guid.CreateVersion7();
        var cancellationPolicyId = Guid.CreateVersion7();

        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, CreateTourCommand, Guid>(
                response, "/api/tour", StubFileService());

        await controller.Create(
            tourName: "Tour goc",
            shortDescription: "Mo ta goc",
            longDescription: "Mo ta dai goc",
            seoTitle: null,
            seoDescription: null,
            status: TourStatus.Active,
            thumbnail: null,
            images: null,
            translations: null,
            classifications: null,
            visaPolicyId: visaPolicyId,
            depositPolicyId: depositPolicyId,
            pricingPolicyId: pricingPolicyId,
            cancellationPolicyId: cancellationPolicyId);

        Assert.NotNull(probe.CapturedRequest);
        Assert.Equal(visaPolicyId, probe.CapturedRequest.VisaPolicyId);
        Assert.Equal(depositPolicyId, probe.CapturedRequest.DepositPolicyId);
        Assert.Equal(pricingPolicyId, probe.CapturedRequest.PricingPolicyId);
        Assert.Equal(cancellationPolicyId, probe.CapturedRequest.CancellationPolicyId);
    }

    [Fact]
    public async Task Update_WhenTranslationsProvided_ShouldMapTranslationsToCommand()
    {
        var tourId = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, UpdateTourCommand, Success>(
                Result.Success, "/api/tour", StubFileService());

        var translationsJson = """
                               {
                                 "en": {
                                   "description": "English updated",
                                   "shortDescription": "English short updated",
                                   "longDescription": "English long updated"
                                 }
                               }
                               """;

        await controller.Update(
            id: tourId,
            tourName: "Tour gốc",
            shortDescription: "Mô tả gốc",
            longDescription: "Mô tả dài gốc",
            seoTitle: null,
            seoDescription: null,
            status: TourStatus.Active,
            thumbnail: null,
            images: null,
            translations: translationsJson);

        Assert.NotNull(probe.CapturedRequest);
        Assert.NotNull(probe.CapturedRequest.Translations);
        Assert.True(probe.CapturedRequest.Translations!.ContainsKey("en"));
        Assert.Equal("English updated", probe.CapturedRequest.Translations["en"].TourName);
    }
}
