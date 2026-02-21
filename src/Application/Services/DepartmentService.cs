using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Contracts.Department;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Services;

public interface IDepartmentService
{
    Task<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>> GetAll();
    Task<ErrorOr<Guid>> Create(CreateDepartmentRequest request);
    Task<ErrorOr<Success>> Update(UpdateDepartmentRequest request);
    Task<ErrorOr<Success>> Delete(Guid id);
    Task<ErrorOr<List<DepartmentComboBoxVm>>> GetAllForComboBox();
}

public class DepartmentService : IDepartmentService
{
    private readonly IUser _user;
    private readonly IRoleService _roleService;
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentService(
        IUser user,
        IRoleService roleService,
        IDepartmentRepository departmentRepository)
    {
        _user = user;
        _roleService = roleService;
        _departmentRepository = departmentRepository;
    }

    public Task<ErrorOr<Guid>> Create(CreateDepartmentRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>> GetAll()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<DepartmentComboBoxVm>>> GetAllForComboBox()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Update(UpdateDepartmentRequest request)
    {
        throw new NotImplementedException();
    }
}