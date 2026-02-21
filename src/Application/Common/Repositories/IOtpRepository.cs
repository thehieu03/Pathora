using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IOtpRepository
{
    Task<ErrorOr<Success>> Upsert(OtpEntity otp);
    Task<ErrorOr<OtpEntity?>> FindByEmail(string email);
}