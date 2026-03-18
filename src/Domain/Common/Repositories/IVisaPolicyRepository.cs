using Domain.Entities;

namespace Domain.Common.Repositories;

public interface IVisaPolicyRepository : IRepository<VisaPolicyEntity>
{
    Task<IReadOnlyList<VisaPolicyEntity>> GetActivePoliciesAsync();
    Task<VisaPolicyEntity?> GetByRegionAsync(string region);
}
