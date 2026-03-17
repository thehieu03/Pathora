using Domain.Entities;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface ISiteContentRepository : IRepository<SiteContentEntity>
{
    Task<List<SiteContentEntity>> GetByPageKeyAsync(string pageKey);
    Task<SiteContentEntity?> GetByPageAndContentKeyAsync(string pageKey, string contentKey);
    Task<ErrorOr<SiteContentEntity>> UpsertAsync(string pageKey, string contentKey, string contentValue, string modifiedBy);
}
