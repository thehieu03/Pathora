using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
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

    public async Task<TourEntity?> FindByIdReadOnly(Guid id)
    {
        return await _context.Tours
            .AsNoTracking()
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

    public async Task<List<TourEntity>> FindFeaturedTours(int limit)
    {
        return await _context.Tours
            .AsNoTracking()
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Plans)
                    .ThenInclude(p => p.Activities)
                        .ThenInclude(a => a.Routes)
                            .ThenInclude(r => r.FromLocation)
            .Include(t => t.Thumbnail)
            .Where(t => t.Status == TourStatus.Active && !t.IsDeleted)
            .OrderByDescending(t => t.CreatedOnUtc)
            .Take(limit)
            .AsSplitQuery()
            .ToListAsync();
    }

    public async Task<List<TourEntity>> FindLatestTours(int limit)
    {
        return await _context.Tours
            .AsNoTracking()
            .Include(t => t.Thumbnail)
            .Where(t => t.Status == TourStatus.Active && !t.IsDeleted)
            .OrderByDescending(t => t.CreatedOnUtc)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<TourEntity>> SearchTours(string? destination, string? classification, int page, int pageSize)
    {
        var query = _context.Tours
            .AsNoTracking()
            .Include(t => t.Classifications)
                .ThenInclude(c => c.Plans)
                    .ThenInclude(p => p.Activities)
                        .ThenInclude(a => a.Routes)
                            .ThenInclude(r => r.FromLocation)
            .Include(t => t.Thumbnail)
            .Where(t => t.Status == TourStatus.Active && !t.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(destination))
        {
            var destLower = destination.ToLower();
            query = query.Where(t => t.Classifications
                .SelectMany(c => c.Plans)
                .SelectMany(p => p.Activities)
                .SelectMany(a => a.Routes)
                .Any(r => r.FromLocation.City != null && r.FromLocation.City.ToLower().Contains(destLower) ||
                          r.FromLocation.Country != null && r.FromLocation.Country.ToLower().Contains(destLower)));
        }

        if (!string.IsNullOrWhiteSpace(classification))
        {
            query = query.Where(t => t.Classifications.Any(c => c.Name.ToLower() == classification.ToLower()));
        }

        return await query
            .AsSplitQuery()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountSearchTours(string? destination, string? classification)
    {
        var query = _context.Tours
            .Where(t => t.Status == TourStatus.Active && !t.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(destination))
        {
            var destLower = destination.ToLower();
            query = query.Where(t => t.Classifications
                .SelectMany(c => c.Plans)
                .SelectMany(p => p.Activities)
                .SelectMany(a => a.Routes)
                .Any(r => r.FromLocation.City != null && r.FromLocation.City.ToLower().Contains(destLower) ||
                          r.FromLocation.Country != null && r.FromLocation.Country.ToLower().Contains(destLower)));
        }

        if (!string.IsNullOrWhiteSpace(classification))
        {
            query = query.Where(t => t.Classifications.Any(c => c.Name.ToLower() == classification.ToLower()));
        }

        return await query.CountAsync();
    }

    public async Task<List<(string City, string Country, int ToursCount)>> GetTrendingDestinations(int limit)
    {
        var locations = await _context.TourPlanLocations
            .Where(l => l.City != null && l.Country != null)
            .Where(l => l.TourDayActivity != null && l.TourDayActivity.TourDay != null &&
                        l.TourDayActivity.TourDay.Classification != null &&
                        l.TourDayActivity.TourDay.Classification.Tour != null &&
                        l.TourDayActivity.TourDay.Classification.Tour.Status == TourStatus.Active &&
                        !l.TourDayActivity.TourDay.Classification.Tour.IsDeleted)
            .GroupBy(l => new { l.City, l.Country })
            .Select(g => new { g.Key.City, g.Key.Country, ToursCount = g.Select(l => l.TourDayActivity!.TourDay!.Classification!.Tour!.Id).Distinct().Count() })
            .OrderByDescending(x => x.ToursCount)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync();

        return locations.Select(l => (l.City!, l.Country!, l.ToursCount)).ToList();
    }

    public async Task<List<TourPlanLocationEntity>> GetTopAttractions(int limit)
    {
        var attractionTypes = new[] { LocationType.TouristAttraction, LocationType.Museum, LocationType.NationalPark, LocationType.Beach, LocationType.Temple };

        return await _context.TourPlanLocations
            .AsNoTracking()
            .Where(l => attractionTypes.Contains(l.LocationType))
            .Where(l => l.City != null && l.Country != null)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<int> GetTotalActiveTours()
    {
        return await _context.Tours
            .Where(t => t.Status == TourStatus.Active && !t.IsDeleted)
            .CountAsync();
    }

    public async Task<decimal> GetTotalDistanceKm()
    {
        return await _context.TourPlanRoutes
            .Where(r => r.DistanceKm != null)
            .Where(r => r.TourDayActivity != null && r.TourDayActivity.TourDay != null &&
                        r.TourDayActivity.TourDay.Classification != null &&
                        r.TourDayActivity.TourDay.Classification.Tour != null &&
                        r.TourDayActivity.TourDay.Classification.Tour.Status == TourStatus.Active &&
                        !r.TourDayActivity.TourDay.Classification.Tour.IsDeleted)
            .SumAsync(r => r.DistanceKm ?? 0);
    }

    public async Task<List<string>> GetAllDestinations()
    {
        return await _context.TourPlanLocations
            .Where(l => l.City != null)
            .Where(l => l.TourDayActivity != null && l.TourDayActivity.TourDay != null &&
                        l.TourDayActivity.TourDay.Classification != null &&
                        l.TourDayActivity.TourDay.Classification.Tour != null &&
                        l.TourDayActivity.TourDay.Classification.Tour.Status == TourStatus.Active &&
                        !l.TourDayActivity.TourDay.Classification.Tour.IsDeleted)
            .Select(l => l.City!)
            .Distinct()
            .OrderBy(c => c)
            .AsNoTracking()
            .ToListAsync();
    }
}
