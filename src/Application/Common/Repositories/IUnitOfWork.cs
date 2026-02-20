using System.Data;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IDepartmentRepository Departments { get; }
    IRoleRepository Roles { get; }
    IPositionRepository Positions { get; }

    IFileRepository Files { get; }
    IFunctionRepository Functions { get; }
    IMailRepository Mails { get; }
    IOtpRepository Otps { get; }

    void Begin(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
    Task BeginAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
    void Commit();
    Task CommitAsync();
    void Rollback();
    ErrorOr<T> Rollback<T>(List<Error> errors);
    Task RollbackAsync();
    Task<ErrorOr<T>> RollbackAsync<T>(List<Error> errors);
}

public static class UnitOfWorkExtensions
{
    public static async Task<ErrorOr<T>> Rollback<T>(
        this IUnitOfWork uow,
        List<Error> errors)
    {
        await uow.RollbackAsync();
        return errors;
    }
}