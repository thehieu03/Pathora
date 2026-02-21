using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;

namespace Infrastructure.Repositories;
// làm riêng
public class OtpRepository : IOtpRepository
{
    public Task<ErrorOr<Success>> Upsert(OtpEntity otp)
    {
        throw new NotImplementedException();
    }

    Task<ErrorOr<OtpEntity?>> IOtpRepository.FindByEmail(string email)
    {
        throw new NotImplementedException();
    }
}