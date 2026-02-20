using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IOtpRepository
{
    Task<ErrorOr<Success>> Upsert(Otp otp);
    Task<ErrorOr<Otp?>> FindByEmail(string email);
}