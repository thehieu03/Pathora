using System.Data;
using Application.Common.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using ErrorOr;

namespace Infrastructure.Repositories.Common;

internal sealed class UnitOfWork(DbContext context, IServiceProvider provider) : IUnitOfWork
{
    private IDbContextTransaction? _transaction;

    // Giữ nguyên cách dùng 'field' keyword (C# 13) như bạn đã viết
    public IUserRepository Users => field ??= provider.GetRequiredService<IUserRepository>();
    public IRoleRepository Roles => field ??= provider.GetRequiredService<IRoleRepository>();
    public IDepartmentRepository Departments => field ??= provider.GetRequiredService<IDepartmentRepository>();
    public IPositionRepository Positions => field ??= provider.GetRequiredService<IPositionRepository>();
    public IFileRepository Files => field ??= provider.GetRequiredService<IFileRepository>();
    public IFunctionRepository Functions => field ??= provider.GetRequiredService<IFunctionRepository>();
    public IMailRepository Mails => field ??= provider.GetRequiredService<IMailRepository>();
    public IOtpRepository Otps => field ??= provider.GetRequiredService<IOtpRepository>();

    // Bắt đầu Transaction
    public void Begin(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
    {
        _transaction = context.Database.BeginTransaction(isolationLevel);
    }

    public async Task BeginAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
    {
        _transaction = await context.Database.BeginTransactionAsync(isolationLevel);
    }

    // Xác nhận mọi thay đổi
    public void Commit()
    {
        try
        {
            _transaction?.Commit();
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null;
        }
    }

    public async Task CommitAsync()
    {
        try
        {
            if (_transaction != null) await _transaction.CommitAsync();
        }
        finally
        {
            if (_transaction != null) await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    // Hủy bỏ thay đổi
    public void Rollback()
    {
        _transaction?.Rollback();
        _transaction?.Dispose();
        _transaction = null;
    }

    public ErrorOr<T> Rollback<T>(List<Error> errors)
    {
        Rollback();
        return errors;
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task<ErrorOr<T>> RollbackAsync<T>(List<Error> errors)
    {
        await RollbackAsync();
        return errors;
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        context.Dispose();
    }
}