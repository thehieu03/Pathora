using Domain.Entities;

namespace Domain.Common.Repositories;

public interface ITourGuideRepository : IRepository<TourGuideEntity>
{
    Task<TourGuideEntity?> GetByLicenseNumberAsync(string licenseNumber);
    Task<IReadOnlyList<TourGuideEntity>> SearchAsync(bool? isAvailable = null, string? language = null, string? specialization = null);
}
