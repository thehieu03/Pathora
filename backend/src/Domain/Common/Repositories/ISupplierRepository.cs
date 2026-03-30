using Domain.Entities;

namespace Domain.Common.Repositories;

public interface ISupplierRepository : IRepository<SupplierEntity>
{
    Task<SupplierEntity?> GetByCodeAsync(string supplierCode);
}
