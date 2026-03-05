using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;



namespace Application.Services;

public interface ITourService
{
    Task<ErrorOr<Guid>> Create(CreateTourCommand request);
    Task<ErrorOr<Success>> Update(UpdateTourCommand request);
    Task<ErrorOr<Success>> Delete(Guid id);
    Task<ErrorOr<PaginatedList<TourVm>>> GetAll(GetAllToursQuery request);
    Task<ErrorOr<TourDto>> GetDetail(Guid id);
}

public class TourService(ITourRepository tourRepository, IUser user, IMapper mapper) : ITourService
{
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly IUser _user = user;
    private readonly IMapper _mapper = mapper;

    private static ImageEntity ToImageEntity(ImageInputDto dto) =>
        ImageEntity.Create(dto.FileId, dto.OriginalFileName, dto.FileName, dto.PublicURL);

    public async Task<ErrorOr<Guid>> Create(CreateTourCommand request)
    {
        var thumbnail = request.Thumbnail is not null ? ToImageEntity(request.Thumbnail) : new ImageEntity();
        var images = request.Images?.Select(ToImageEntity).ToList() ?? [];

        var tour = TourEntity.Create(
            request.TourName,
            request.ShortDescription,
            request.LongDescription,
            _user.Id ?? string.Empty,
            request.Status,
            request.SEOTitle,
            request.SEODescription,
            thumbnail,
            images);

        await _tourRepository.Create(tour);
        return tour.Id;
    }

    public async Task<ErrorOr<Success>> Update(UpdateTourCommand request)
    {
        var tour = await _tourRepository.FindById(request.Id);
        if (tour is null)
            return Error.NotFound("Tour.NotFound", "Tour không tồn tại");

        if (await _tourRepository.ExistsByTourCode(tour.TourCode, request.Id))
            return Error.Conflict("Tour.DuplicateCode", $"Mã tour '{tour.TourCode}' đã tồn tại");

        var thumbnail = request.Thumbnail is not null ? ToImageEntity(request.Thumbnail) : null;
        var images = request.Images?.Select(ToImageEntity).ToList();

        tour.Update(
            request.TourName,
            request.ShortDescription,
            request.LongDescription,
            request.Status,
            _user.Id ?? string.Empty,
            request.SEOTitle,
            request.SEODescription,
            thumbnail,
            images);

        await _tourRepository.Update(tour);
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> Delete(Guid id)
    {
        var tour = await _tourRepository.FindById(id);
        if (tour is null)
            return Error.NotFound("Tour.NotFound", "Tour không tồn tại");

        await _tourRepository.SoftDelete(id);
        return Result.Success;
    }

    public async Task<ErrorOr<PaginatedList<TourVm>>> GetAll(GetAllToursQuery request)
    {
        var tours = await _tourRepository.FindAll(request.SearchText, request.PageNumber, request.PageSize);
        var total = await _tourRepository.CountAll(request.SearchText);

        var tourVms = tours.Select(t => new TourVm(
            t.Id,
            t.TourCode,
            t.TourName,
            t.ShortDescription,
            t.Status.ToString(),
            t.CreatedOnUtc)).ToList();

        return new PaginatedList<TourVm>(total, tourVms);
    }

    public async Task<ErrorOr<TourDto>> GetDetail(Guid id)
    {
        var tour = await _tourRepository.FindById(id);
        if (tour is null)
            return Error.NotFound("Tour.NotFound", "Tour không tồn tại");
        return _mapper.Map<TourDto>(tour);
    }
}
