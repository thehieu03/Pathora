using Domain.Entities;

namespace Domain.Common.Repositories;

public interface ITourRequestRepository
{
    Task<TourRequestEntity?> GetByIdAsync(Guid id);
    Task<List<TourRequestEntity>> GetByUserIdAsync(Guid userId);
    Task<List<TourRequestEntity>> GetByStatusAsync(TourRequestStatus status);
    Task<int> CountByStatusAsync(TourRequestStatus status);
}
