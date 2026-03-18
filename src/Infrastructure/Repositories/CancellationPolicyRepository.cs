using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CancellationPolicyRepository(AppDbContext context) : ICancellationPolicyRepository
{
    private readonly AppDbContext _context = context;

    public async Task<CancellationPolicyEntity?> FindById(Guid id)
    {
        return await _context.CancellationPolicies
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
    }

    public async Task<IReadOnlyList<CancellationPolicyEntity>> FindAll()
    {
        return await _context.CancellationPolicies
            .AsNoTracking()
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.TourScope)
            .ThenBy(p => p.MinDaysBeforeDeparture)
            .ToListAsync();
    }

    public async Task<CancellationPolicyEntity?> FindByTourScopeAndDays(TourScope tourScope, int daysBeforeDeparture)
    {
        return await _context.CancellationPolicies
            .AsNoTracking()
            .Where(p => p.TourScope == tourScope
                    && !p.IsDeleted
                    && p.Status == CancellationPolicyStatus.Active
                    && p.MinDaysBeforeDeparture <= daysBeforeDeparture
                    && p.MaxDaysBeforeDeparture >= daysBeforeDeparture)
            .OrderByDescending(p => p.MinDaysBeforeDeparture)
            .FirstOrDefaultAsync();
    }

    public async Task Create(CancellationPolicyEntity entity)
    {
        await _context.CancellationPolicies.AddAsync(entity);
    }

    public async Task UpdateAsync(CancellationPolicyEntity entity)
    {
        _context.CancellationPolicies.Update(entity);
        await Task.CompletedTask;
    }
}
