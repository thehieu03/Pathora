using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OtpRepository(AppDbContext context) : IOtpRepository
{
    private readonly AppDbContext _context = context;

    public async Task<ErrorOr<Success>> Upsert(OtpEntity otp)
    {
        var existing = await _context.Set<OtpEntity>().FirstOrDefaultAsync(o => o.Email == otp.Email);
        if (existing is null)
        {
            await _context.Set<OtpEntity>().AddAsync(otp);
        }
        else
        {
            existing.Code = otp.Code;
            existing.ExpiryDate = otp.ExpiryDate;
            existing.IsDeleted = false;
        }
        await _context.SaveChangesAsync();
        return Result.Success;
    }

    public async Task<ErrorOr<OtpEntity?>> FindByEmail(string email)
    {
        var otp = await _context.Set<OtpEntity>()
            .AsNoTracking()
            .FirstOrDefaultAsync(o =>
                o.Email == email &&
                !o.IsDeleted &&
                o.ExpiryDate > DateTimeOffset.UtcNow);
        return otp;
    }
}
