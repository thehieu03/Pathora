using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public sealed class DynamicPricingTierRepository(AppDbContext context) : IDynamicPricingTierRepository
{
    private readonly AppDbContext _context = context;

    public async Task<bool> ClassificationExists(Guid classificationId)
    {
        return await _context.TourClassifications
            .AsNoTracking()
            .AnyAsync(classification => classification.Id == classificationId);
    }

    public async Task<bool> TourInstanceExists(Guid tourInstanceId)
    {
        return await _context.TourInstances
            .AsNoTracking()
            .AnyAsync(instance => instance.Id == tourInstanceId && !instance.IsDeleted);
    }

    public async Task<List<DynamicPricingTierEntity>> GetByClassificationId(Guid classificationId, bool asNoTracking = false)
    {
        var query = asNoTracking
            ? _context.DynamicPricingTiers.AsNoTracking()
            : _context.DynamicPricingTiers;

        return await query
            .Where(tier => tier.TourClassificationId == classificationId)
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .ToListAsync();
    }

    public async Task<List<DynamicPricingTierEntity>> GetByTourInstanceId(Guid tourInstanceId, bool asNoTracking = false)
    {
        var query = asNoTracking
            ? _context.DynamicPricingTiers.AsNoTracking()
            : _context.DynamicPricingTiers;

        return await query
            .Where(tier => tier.TourInstanceId == tourInstanceId)
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .ToListAsync();
    }

    public async Task ReplaceForClassification(Guid classificationId, IReadOnlyCollection<DynamicPricingTierEntity> tiers)
    {
        var existing = await _context.DynamicPricingTiers
            .Where(tier => tier.TourClassificationId == classificationId)
            .ToListAsync();

        _context.DynamicPricingTiers.RemoveRange(existing);

        if (tiers.Count > 0)
        {
            await _context.DynamicPricingTiers.AddRangeAsync(tiers);
        }

        await _context.SaveChangesAsync();
    }

    public async Task ReplaceForTourInstance(Guid tourInstanceId, IReadOnlyCollection<DynamicPricingTierEntity> tiers)
    {
        var existing = await _context.DynamicPricingTiers
            .Where(tier => tier.TourInstanceId == tourInstanceId)
            .ToListAsync();

        _context.DynamicPricingTiers.RemoveRange(existing);

        if (tiers.Count > 0)
        {
            await _context.DynamicPricingTiers.AddRangeAsync(tiers);
        }

        await _context.SaveChangesAsync();
    }

    public async Task ClearForTourInstance(Guid tourInstanceId)
    {
        var existing = await _context.DynamicPricingTiers
            .Where(tier => tier.TourInstanceId == tourInstanceId)
            .ToListAsync();

        if (existing.Count == 0)
        {
            return;
        }

        _context.DynamicPricingTiers.RemoveRange(existing);
        await _context.SaveChangesAsync();
    }

    public async Task<TourInstanceEntity?> FindTourInstanceWithPricing(Guid tourInstanceId, bool asNoTracking = false)
    {
        var query = asNoTracking
            ? _context.TourInstances.AsNoTracking()
            : _context.TourInstances;

        return await query
            .Include(instance => instance.DynamicPricingTiers)
            .Include(instance => instance.Classification)
                .ThenInclude(classification => classification.DynamicPricingTiers)
            .FirstOrDefaultAsync(instance => instance.Id == tourInstanceId && !instance.IsDeleted);
    }
}
