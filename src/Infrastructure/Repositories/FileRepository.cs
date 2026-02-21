// làm riêng

using Application.Common.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;

namespace Infrastructure.Repositories;

public class FileRepository : IFileRepository
{
    public Task<ErrorOr<Success>> AddRange(FileMetadataEntity[] fileMetadatas)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> DeleteByLinkedEntityId(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> DeleteRange(List<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<FileMetadataEntity>>> FindByIds(IEnumerable<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<FileMetadataEntity>>> FindByLinkedEntityIds(IEnumerable<string> ids)
    {
        throw new NotImplementedException();
    }
}