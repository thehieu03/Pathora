using Domain.Entities;

namespace Domain.Common.Repositories;

public interface IBookingRepository
{
    Task<BookingEntity?> GetByIdAsync(Guid id);
    Task<BookingEntity?> GetByIdWithDetailsAsync(Guid id);
    Task<List<BookingEntity>> GetByTourInstanceIdAsync(Guid tourInstanceId);
    Task<List<BookingEntity>> GetByUserIdAsync(Guid userId);
    Task<int> CountByTourInstanceIdAsync(Guid tourInstanceId);
}
