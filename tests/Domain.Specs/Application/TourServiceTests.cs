using Application.Common.Interfaces;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Services;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class TourServiceTests
{
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly ITourService _sut;

    public TourServiceTests()
    {
        _user.Id.Returns("test-user");
        _sut = new TourService(_tourRepository, _user, _mapper);
    }

    // ── Create ──────────────────────────────────────────────

    [Fact]
    public async Task Create_WithNoImages_ShouldSucceed()
    {
        var command = new CreateTourCommand(
            "Tour Đà Nẵng", "Mô tả ngắn", "Mô tả dài",
            "SEO Title", "SEO Desc", TourStatus.Active);

        var result = await _sut.Create(command);

        Assert.False(result.IsError);
        Assert.NotEqual(Guid.Empty, result.Value);
        await _tourRepository.Received(1).Create(Arg.Is<TourEntity>(t =>
            t.TourName == "Tour Đà Nẵng" &&
            t.Images.Count == 0));
    }

    [Fact]
    public async Task Create_WithThumbnail_ShouldPassThumbnailToEntity()
    {
        var thumbnail = new ImageInputDto("f1", "thumb.jpg", "thumb.jpg", "http://cdn/thumb.jpg");
        var command = new CreateTourCommand(
            "Tour", "Short", "Long", null, null, TourStatus.Pending, thumbnail);

        var result = await _sut.Create(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Create(Arg.Is<TourEntity>(t =>
            t.Thumbnail.FileId == "f1" &&
            t.Thumbnail.OriginalFileName == "thumb.jpg"));
    }

    [Fact]
    public async Task Create_WithMultipleImages_ShouldPassAllImagesToEntity()
    {
        var images = new List<ImageInputDto>
        {
            new("f1", "img1.jpg", "img1.jpg", "http://cdn/img1.jpg"),
            new("f2", "img2.jpg", "img2.jpg", "http://cdn/img2.jpg"),
            new("f3", "img3.jpg", "img3.jpg", "http://cdn/img3.jpg"),
        };
        var command = new CreateTourCommand(
            "Tour", "Short", "Long", null, null, TourStatus.Active, Images: images);

        var result = await _sut.Create(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Create(Arg.Is<TourEntity>(t =>
            t.Images.Count == 3 &&
            t.Images[0].FileId == "f1" &&
            t.Images[1].FileId == "f2" &&
            t.Images[2].FileId == "f3"));
    }

    [Fact]
    public async Task Create_ShouldAutoGenerateTourCode()
    {
        var command = new CreateTourCommand(
            "Tour", "Short", "Long", null, null, TourStatus.Pending);

        var result = await _sut.Create(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Create(Arg.Is<TourEntity>(t =>
            t.TourCode.StartsWith("TOUR-") && t.TourCode.Length == 19));
    }

    // ── Update ──────────────────────────────────────────────

    [Fact]
    public async Task Update_WhenTourNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _tourRepository.FindById(id).Returns((TourEntity?)null);
        var command = new UpdateTourCommand(id, "Tour", "Short", "Long", null, null, TourStatus.Active);

        var result = await _sut.Update(command);

        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Update_WhenTourExists_ShouldUpdateAndSave()
    {
        var tour = TourEntity.Create("Original", "Short", "Long", "creator");
        _tourRepository.FindById(tour.Id).Returns(tour);
        _tourRepository.ExistsByTourCode(tour.TourCode, tour.Id).Returns(false);
        var command = new UpdateTourCommand(
            tour.Id, "Updated", "New Short", "New Long", "SEO", "SEO Desc", TourStatus.Active);

        var result = await _sut.Update(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Update(Arg.Is<TourEntity>(t =>
            t.TourName == "Updated" &&
            t.Status == TourStatus.Active));
    }

    [Fact]
    public async Task Update_WithNewImages_ShouldReplaceImages()
    {
        var oldImages = new List<ImageEntity>
        {
            ImageEntity.Create("old1", "old1.jpg", "old1.jpg", "http://cdn/old1.jpg"),
        };
        var tour = TourEntity.Create("Tour", "Short", "Long", "creator", images: oldImages);
        _tourRepository.FindById(tour.Id).Returns(tour);
        _tourRepository.ExistsByTourCode(tour.TourCode, tour.Id).Returns(false);

        var newImages = new List<ImageInputDto>
        {
            new("new1", "new1.jpg", "new1.jpg", "http://cdn/new1.jpg"),
            new("new2", "new2.jpg", "new2.jpg", "http://cdn/new2.jpg"),
        };
        var command = new UpdateTourCommand(
            tour.Id, "Tour", "Short", "Long", null, null, TourStatus.Active, Images: newImages);

        var result = await _sut.Update(command);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).Update(Arg.Is<TourEntity>(t =>
            t.Images.Count == 2 &&
            t.Images[0].FileId == "new1" &&
            t.Images[1].FileId == "new2"));
    }

    // ── Delete ──────────────────────────────────────────────

    [Fact]
    public async Task Delete_WhenTourNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _tourRepository.FindById(id).Returns((TourEntity?)null);

        var result = await _sut.Delete(id);

        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Delete_WhenTourExists_ShouldSoftDelete()
    {
        var tour = TourEntity.Create("Tour", "Short", "Long", "creator");
        _tourRepository.FindById(tour.Id).Returns(tour);

        var result = await _sut.Delete(tour.Id);

        Assert.False(result.IsError);
        await _tourRepository.Received(1).SoftDelete(tour.Id);
    }
}
