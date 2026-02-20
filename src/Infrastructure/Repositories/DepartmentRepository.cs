using Domain.Common.Repositories;
using Domain.Entities;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class DepartmentRepository : Repository<Department>, IDepartmentRepository
{
    public DepartmentRepository(DbContext context) : base(context)
    {
    }
}