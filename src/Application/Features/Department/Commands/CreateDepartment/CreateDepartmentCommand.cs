using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.CreateDepartment;

public sealed record CreateDepartmentCommand(Guid? DepartmentParentId, string DepartmentName) : ICommand<ErrorOr<Guid>>;
