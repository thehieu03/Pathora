using Application.Common.Repositories;
using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Data;

namespace Infrastructure.Repositories.Common;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private readonly Dictionary<Type, object> _repository = new();

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public AppDbContext ContextDb => _context;

    public async Task BeginTransactionAsync()
    {
        await ContextDb.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        await ContextDb.Database.CommitTransactionAsync();
    }

    public IGenericRepository<TEntity> GenericRepository<TEntity>() where TEntity : class
    {
        if (!_repository.ContainsKey(typeof(TEntity)))
        {
            _repository[typeof(TEntity)] = new GenericRepository<TEntity>(ContextDb);
        }
        return (GenericRepository<TEntity>)_repository[typeof(TEntity)];
    }

    public async Task RollbackTransactionAsync()
    {
        await ContextDb.Database.RollbackTransactionAsync();
    }

    public async Task<int> SaveChangeAsync(CancellationToken cancellationToken = default)
    {
        return await ContextDb.SaveChangesAsync();
    }

    public int SaveChanges()
    {
        return ContextDb.SaveChanges();
    }
}