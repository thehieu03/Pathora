using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TourRequestRepository(AppDbContext context) : ITourRequestRepository
{
    private readonly AppDbContext _context = context;

    public async Task<TourRequestEntity?> GetByIdAsync(Guid id)
    {
        return await _context.TourRequests
            .Include(t => t.User)
            .Include(t => t.Reviewer)
            .Include(t => t.TourInstance)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<TourRequestEntity>> GetByUserIdAsync(Guid userId)
    {
        return await _context.TourRequests
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedOnUtc)
            .ToListAsync();
    }

    public async Task<List<TourRequestEntity>> GetByStatusAsync(TourRequestStatus status)
    {
        return await _context.TourRequests
            .Include(t => t.User)
            .Where(t => t.Status == status)
            .OrderByDescending(t => t.CreatedOnUtc)
            .ToListAsync();
    }

    public async Task<int> CountByStatusAsync(TourRequestStatus status)
    {
        return await _context.TourRequests
            .Where(t => t.Status == status)
            .CountAsync();
    }
}
