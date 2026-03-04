using Domain.Entities;

namespace Domain.Common.Repositories;

public interface ITourRepository
{
    Task<TourEntity?> FindById(Guid id);
    Task<bool> ExistsByTourCode(string tourCode, Guid? excludeId = null);
    Task<List<TourEntity>> FindAll(string? searchText, int pageNumber, int pageSize);
    Task<int> CountAll(string? searchText);
    Task Create(TourEntity tour);
    Task Update(TourEntity tour);
    Task SoftDelete(Guid id);
    Task<List<TourEntity>> FindFeaturedTours(int limit);
    Task<List<TourEntity>> FindLatestTours(int limit);
    Task<List<TourEntity>> SearchTours(string? destination, string? classification, int page, int pageSize);
    Task<int> CountSearchTours(string? destination, string? classification);
    Task<List<(string City, string Country, int ToursCount)>> GetTrendingDestinations(int limit);
    Task<List<TourPlanLocationEntity>> GetTopAttractions(int limit);
    Task<int> GetTotalActiveTours();
    Task<decimal> GetTotalDistanceKm();
    Task<List<string>> GetAllDestinations();
}
