using Domain.Entities;

namespace Domain.Common.Repositories;

public interface ITourRepository
{
    Task<TourEntity?> FindById(Guid id);
    Task<List<TourEntity>> FindAll(string? searchText, int pageNumber, int pageSize);
    Task<int> CountAll(string? searchText);
    Task Create(TourEntity tour);
    Task Update(TourEntity tour);
    Task SoftDelete(Guid id);
}
