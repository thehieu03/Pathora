using Domain.Common.Repositories;
using Domain.Mails;
using ErrorOr;

namespace Infrastructure.Repositories;
// làm riêng

public class MailRepository : IMailRepository
{
    public Task<ErrorOr<Success>> Add(MailEntity record)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> AddRange(List<MailEntity> records)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<MailEntity>>> FindPending()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> UpdateStatus(List<Guid> mailIds, MailStatus status)
    {
        throw new NotImplementedException();
    }
}