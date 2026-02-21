using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;

namespace Infrastructure.Repositories;
// làm riêng
public class OtpRepository : IOtpRepository
{
    public Task<ErrorOr<Otp?>> FindByEmail(string email)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Upsert(Otp otp)
    {
        throw new NotImplementedException();
    }
}