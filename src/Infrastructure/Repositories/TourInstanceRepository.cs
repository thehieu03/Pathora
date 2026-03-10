using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TourInstanceRepository(AppDbContext context) : ITourInstanceRepository
{
    private readonly AppDbContext _context = context;

    public async Task<TourInstanceEntity?> FindById(Guid id, bool asNoTracking = false)
    {
        var query = asNoTracking
            ? _context.TourInstances.AsNoTracking()
            : _context.TourInstances;

        return await query
            .Include(t => t.DynamicPricingTiers)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
    }

    public async Task<List<TourInstanceEntity>> FindAll(string? searchText, TourInstanceStatus? status, int pageNumber, int pageSize)
    {
        var query = _context.TourInstances.AsNoTracking().Where(t => !t.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var search = searchText.ToLower();
            query = query.Where(t =>
                t.TourName.ToLower().Contains(search) ||
                t.TourCode.ToLower().Contains(search) ||
                (t.Location != null && t.Location.ToLower().Contains(search)));
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        return await query
            .OrderByDescending(t => t.CreatedOnUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAll(string? searchText, TourInstanceStatus? status)
    {
        var query = _context.TourInstances.Where(t => !t.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var search = searchText.ToLower();
            query = query.Where(t =>
                t.TourName.ToLower().Contains(search) ||
                t.TourCode.ToLower().Contains(search) ||
                (t.Location != null && t.Location.ToLower().Contains(search)));
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        return await query.CountAsync();
    }

    public async Task Create(TourInstanceEntity tourInstance)
    {
        await _context.TourInstances.AddAsync(tourInstance);
        await _context.SaveChangesAsync();
    }

    public async Task Update(TourInstanceEntity tourInstance)
    {
        _context.TourInstances.Update(tourInstance);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDelete(Guid id)
    {
        var instance = await _context.TourInstances.FirstOrDefaultAsync(t => t.Id == id);
        if (instance is not null)
        {
            instance.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<(int Total, int Available, int Confirmed, int SoldOut)> GetStats()
    {
        var query = _context.TourInstances.Where(t => !t.IsDeleted);
        var total = await query.CountAsync();
        var available = await query.CountAsync(t => t.Status == TourInstanceStatus.Available);
        var confirmed = await query.CountAsync(t => t.Status == TourInstanceStatus.Confirmed);
        var soldOut = await query.CountAsync(t => t.Status == TourInstanceStatus.SoldOut);
        return (total, available, confirmed, soldOut);
    }

    public async Task<List<TourInstanceEntity>> FindPublicAvailable(string? destination, int page, int pageSize)
    {
        var query = _context.TourInstances
            .AsNoTracking()
            .Where(t => !t.IsDeleted
                && t.InstanceType == TourType.Public
                && t.Status == TourInstanceStatus.Available);

        if (!string.IsNullOrWhiteSpace(destination))
        {
            var destLower = destination.ToLower();
            query = query.Where(t => t.Location != null && t.Location.ToLower().Contains(destLower));
        }

        return await query
            .OrderBy(t => t.StartDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountPublicAvailable(string? destination)
    {
        var query = _context.TourInstances
            .Where(t => !t.IsDeleted
                && t.InstanceType == TourType.Public
                && t.Status == TourInstanceStatus.Available);

        if (!string.IsNullOrWhiteSpace(destination))
        {
            var destLower = destination.ToLower();
            query = query.Where(t => t.Location != null && t.Location.ToLower().Contains(destLower));
        }

        return await query.CountAsync();
    }

    public async Task<TourInstanceEntity?> FindPublicById(Guid id)
    {
        return await _context.TourInstances
            .AsNoTracking()
            .Include(t => t.DynamicPricingTiers)
            .FirstOrDefaultAsync(t => t.Id == id
                && !t.IsDeleted
                && t.InstanceType == TourType.Public
                && t.Status == TourInstanceStatus.Available);
    }
}
