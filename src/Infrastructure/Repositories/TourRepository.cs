using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TourRepository(AppDbContext context) : ITourRepository
{
    private readonly AppDbContext _context = context;

    public async Task<TourEntity?> FindById(Guid id)
    {
        return await _context.Tours
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Plans)
                    .ThenInclude(d => d.Activities)
                        .ThenInclude(a => a.Routes)
                            .ThenInclude(r => r.FromLocation)
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Plans)
                    .ThenInclude(d => d.Activities)
                        .ThenInclude(a => a.Routes)
                            .ThenInclude(r => r.ToLocation)
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Plans)
                    .ThenInclude(d => d.Activities)
                        .ThenInclude(a => a.Accommodation)
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Insurances)
            .AsSplitQuery()
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
    }

    public async Task<List<TourEntity>> FindAll(string? searchText, int pageNumber, int pageSize)
    {
        var query = _context.Tours.AsNoTracking().Where(t => !t.IsDeleted);
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var search = searchText.ToLower();
            query = query.Where(t =>
                t.TourName.ToLower().Contains(search) ||
                t.TourCode.ToLower().Contains(search));
        }
        return await query
            .OrderByDescending(t => t.CreatedOnUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAll(string? searchText)
    {
        var query = _context.Tours.Where(t => !t.IsDeleted);
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var search = searchText.ToLower();
            query = query.Where(t =>
                t.TourName.ToLower().Contains(search) ||
                t.TourCode.ToLower().Contains(search));
        }
        return await query.CountAsync();
    }

    public async Task<bool> ExistsByTourCode(string tourCode, Guid? excludeId = null)
    {
        var query = _context.Tours.Where(t => !t.IsDeleted && t.TourCode == tourCode);
        if (excludeId.HasValue)
            query = query.Where(t => t.Id != excludeId.Value);
        return await query.AnyAsync();
    }

    public async Task Create(TourEntity tour)
    {
        await _context.Tours.AddAsync(tour);
        await _context.SaveChangesAsync();
    }

    public async Task Update(TourEntity tour)
    {
        // Ensure new Images (OwnsMany) are tracked as Added
        foreach (var img in tour.Images)
        {
            var imgEntry = _context.Entry(img);
            if (imgEntry.State == EntityState.Detached)
            {
                imgEntry.State = EntityState.Added;
            }
        }

        _context.Tours.Update(tour);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDelete(Guid id)
    {
        var tour = await _context.Tours.FirstOrDefaultAsync(t => t.Id == id);
        if (tour != null)
        {
            tour.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
