using Domain.Common.Repositories;
using Domain.Mails;
using ErrorOr;

namespace Infrastructure.Repositories;
// làm riêng

public class MailRepository : IMailRepository
{
    public Task<ErrorOr<Success>> Add(Mail record)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> AddRange(List<Mail> records)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<Mail>>> FindPending()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> UpdateStatus(List<Guid> mailIds, MailStatus status)
    {
        throw new NotImplementedException();
    }
}