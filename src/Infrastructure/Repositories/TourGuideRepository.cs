using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TourGuideRepository(AppDbContext context)
    : Repository<TourGuideEntity>(context), ITourGuideRepository
{
    public async Task<TourGuideEntity?> GetByLicenseNumberAsync(string licenseNumber)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.LicenseNumber == licenseNumber && !x.IsDeleted);
    }

    public async Task<IReadOnlyList<TourGuideEntity>> SearchAsync(
        bool? isAvailable = null,
        string? language = null,
        string? specialization = null)
    {
        var query = _dbSet.Where(x => !x.IsDeleted);

        if (isAvailable.HasValue)
        {
            query = query.Where(x => x.IsAvailable == isAvailable.Value);
        }

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(x => x.Languages != null && EF.Functions.ILike(x.Languages, $"%{language}%"));
        }

        if (!string.IsNullOrWhiteSpace(specialization))
        {
            query = query.Where(x => x.Specializations != null && EF.Functions.ILike(x.Specializations, $"%{specialization}%"));
        }

        return await query
            .OrderBy(x => x.FullName)
            .ToListAsync();
    }
}
