using Application.Common.Contracts;
using Application.Features.Tour.Commands.CreateTour;
using Application.Features.Tour.Commands.UpdateTour;
using Application.Features.Tour.Queries.GetAllTours;
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
    Task<ErrorOr<TourEntity>> GetDetail(Guid id);
}

public class TourService(ITourRepository tourRepository) : ITourService
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<Guid>> Create(CreateTourCommand request)
    {
        var tour = new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = request.TourCode,
            TourName = request.TourName,
            ShortDescription = request.ShortDescription,
            LongDescription = request.LongDescription,
            SEOTitle = request.SEOTitle,
            SEODescription = request.SEODescription,
            Status = request.Status,
            Thumbnail = new ImageEntity(),
            CreatedOnUtc = DateTimeOffset.UtcNow
        };

        await _tourRepository.Create(tour);
        return tour.Id;
    }

    public async Task<ErrorOr<Success>> Update(UpdateTourCommand request)
    {
        var tour = await _tourRepository.FindById(request.Id);
        if (tour is null)
            return Error.NotFound("Tour.NotFound", "Tour không tồn tại");

        tour.TourCode = request.TourCode;
        tour.TourName = request.TourName;
        tour.ShortDescription = request.ShortDescription;
        tour.LongDescription = request.LongDescription;
        tour.SEOTitle = request.SEOTitle;
        tour.SEODescription = request.SEODescription;
        tour.Status = request.Status;
        tour.LastModifiedOnUtc = DateTimeOffset.UtcNow;

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

    public async Task<ErrorOr<TourEntity>> GetDetail(Guid id)
    {
        var tour = await _tourRepository.FindById(id);
        if (tour is null)
            return Error.NotFound("Tour.NotFound", "Tour không tồn tại");
        return tour;
    }
}
