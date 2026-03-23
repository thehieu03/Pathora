using Api.Controllers;
using Application.Common.Interfaces;
using Contracts;
using Application.Contracts.File;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using Application.Services;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;

namespace Domain.Specs.Api;

public sealed class TourControllerTests
{
    private static IFileService StubFileService()
    {
        return new StubFileServiceImpl();
    }

    private static IFileManager StubFileManager()
    {
        return new StubFileManagerImpl();
    }

    private sealed class StubFileServiceImpl : IFileService
    {
        public Task<FileMetadataVm> UploadFileAsync(UploadFileRequest request)
            => Task.FromResult(new FileMetadataVm(Guid.CreateVersion7(), "http://cdn/test.jpg", request.FileName, "image/jpeg", request.Length));

        public Task<IEnumerable<FileMetadataVm>> UploadMultipleFilesAsync(UploadMultipleFilesRequest request)
            => Task.FromResult<IEnumerable<FileMetadataVm>>([]);

        public Task DeleteMultipleFilesAsync(DeleteMultipleFilesRequest request)
            => Task.CompletedTask;

        public Task DeleteUploadedFilesAsync(List<string> objectNames)
            => Task.CompletedTask;
    }

    private sealed class StubFileManagerImpl : IFileManager
    {
        public Task<string> UploadFileAsync(Stream stream, string fileName, CancellationToken cancellationToken = default)
            => Task.FromResult("http://cdn/default");
        public Task<IEnumerable<Domain.Entities.FileMetadataEntity>> UploadMultipleFilesAsync(Guid entityId, (Stream Stream, string FileName, string ContentType, long Length)[] files, CancellationToken cancellationToken = default)
            => Task.FromResult<IEnumerable<Domain.Entities.FileMetadataEntity>>([]);
        public Task<Dictionary<Guid, Domain.Entities.FileMetadataEntity[]>> FindFiles(string[] entityIds)
            => Task.FromResult(new Dictionary<Guid, Domain.Entities.FileMetadataEntity[]>());
        public Task DeleteMultipleFilesAsync(List<Guid> ids, CancellationToken cancellationToken = default)
            => Task.CompletedTask;
        public Task DeleteUploadedFilesAsync(List<string> objectNames, CancellationToken cancellationToken = default)
            => Task.CompletedTask;
        public Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
            => Task.FromResult<Stream>(Stream.Null);
    }

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
                null,
                DateTimeOffset.UtcNow)
        };
        var response = new PaginatedList<TourVm>(tours.Count, tours);
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, GetAllToursQuery, PaginatedList<TourVm>>(
                response, "/api/tour", StubFileService(), StubFileManager());

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
            .BuildController<TourController, GetTourDetailQuery, TourDto>(
                Error.NotFound("Tour.NotFound", "Không tìm thấy tour"),
                $"/api/tour/{id}",
                StubFileService(), StubFileManager());

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
        var response = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, CreateTourCommand, Guid>(
                response, "/api/tour", StubFileService(), StubFileManager());

        var actionResult = await controller.Create(
            tourName: "Tour Đà Nẵng",
            shortDescription: "Mô tả ngắn",
            longDescription: "Mô tả dài",
            seoTitle: "SEO title",
            seoDescription: "SEO description",
            status: TourStatus.Active,
            thumbnail: null,
            images: null);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour",
            expectedData: response);
        Assert.NotNull(probe.CapturedRequest);
        Assert.Equal("Tour Đà Nẵng", probe.CapturedRequest.TourName);
    }

    [Fact]
    public async Task Update_WhenCommandSucceeds_ShouldReturnOkAndPayload()
    {
        var tourId = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, UpdateTourCommand, Success>(
                Result.Success, "/api/tour", StubFileService(), StubFileManager());

        var actionResult = await controller.Update(
            id: tourId,
            tourName: "Tour Đà Nẵng",
            shortDescription: "Mô tả ngắn",
            longDescription: "Mô tả dài",
            seoTitle: "SEO title",
            seoDescription: "SEO description",
            status: TourStatus.Active,
            thumbnail: null,
            images: null);

        ApiControllerTestHelper.AssertSuccessResponse(
            actionResult,
            expectedStatusCode: StatusCodes.Status200OK,
            expectedInstance: "/api/tour",
            expectedData: Result.Success);
        Assert.NotNull(probe.CapturedRequest);
        Assert.Equal(tourId, probe.CapturedRequest.Id);
    }

    [Fact]
    public async Task Delete_WhenTourMissing_ShouldReturnNotFoundResponse()
    {
        var id = Guid.CreateVersion7();
        var (controller, probe) = ApiControllerTestHelper
            .BuildController<TourController, DeleteTourCommand, Success>(
                Error.NotFound("Tour.NotFound", "Không tìm thấy tour"),
                $"/api/tour/{id}",
                StubFileService(), StubFileManager());

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
