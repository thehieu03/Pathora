using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SupplierRepository(AppDbContext context) : Repository<SupplierEntity>(context), ISupplierRepository
{
    public async Task<SupplierEntity?> GetByCodeAsync(string supplierCode)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.SupplierCode == supplierCode);
    }
}
