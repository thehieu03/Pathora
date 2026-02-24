using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.DeleteDepartment;

public sealed record DeleteDepartmentCommand(Guid Id) : ICommand<ErrorOr<Success>>;
