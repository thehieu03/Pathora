using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class BookingRepository(AppDbContext context) : IBookingRepository
{
    private readonly AppDbContext _context = context;

    public async Task<BookingEntity?> GetByIdAsync(Guid id)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Include(b => b.TourInstance)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<BookingEntity?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.Bookings
            .Include(b => b.TourInstance)
            .Include(b => b.User)
            .Include(b => b.TourRequest)
            .Include(b => b.Deposits)
            .Include(b => b.Payments)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<List<BookingEntity>> GetByTourInstanceIdAsync(Guid tourInstanceId)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Include(b => b.User)
            .Include(b => b.TourInstance)
            .Where(b => b.TourInstanceId == tourInstanceId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    public async Task<List<BookingEntity>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Include(b => b.TourInstance)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
    }

    public async Task<int> CountByTourInstanceIdAsync(Guid tourInstanceId)
    {
        return await _context.Bookings
            .Where(b => b.TourInstanceId == tourInstanceId)
            .CountAsync();
    }
}
