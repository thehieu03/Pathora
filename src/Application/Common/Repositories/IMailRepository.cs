using Domain.Mails;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IMailRepository
{
    Task<ErrorOr<Success>> Add(Mail record);
    Task<ErrorOr<Success>> AddRange(List<Mail> records);
    Task<ErrorOr<List<Mail>>> FindPending();
    Task<ErrorOr<Success>> UpdateStatus(List<Guid> mailIds, MailStatus status);
}