using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IFileRepository
{
    Task<ErrorOr<Success>> AddRange(FileMetadata[] fileMetadatas);
    Task<ErrorOr<List<FileMetadata>>> FindByIds(IEnumerable<Guid> ids);
    Task<ErrorOr<List<FileMetadata>>> FindByLinkedEntityIds(IEnumerable<string> ids);
    Task<ErrorOr<Success>> DeleteRange(List<Guid> ids);
    Task<ErrorOr<Success>> DeleteByLinkedEntityId(Guid id);
}