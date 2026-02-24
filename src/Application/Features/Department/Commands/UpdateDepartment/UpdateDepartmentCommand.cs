using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.UpdateDepartment;

public sealed record UpdateDepartmentCommand(Guid DepartmentId, Guid? DepartmentParentId, string DepartmentName) : ICommand<ErrorOr<Success>>;
