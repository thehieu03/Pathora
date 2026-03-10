using Contracts;
using Application.Contracts.Department;
using Application.Features.Department.Queries;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class DepartmentQueryHandlerTests
{
    // ── GetAll ──────────────────────────────────────────────

    [Fact]
    public async Task GetAllHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IDepartmentService>();
        var departments = new List<DepartmentVm>();
        var payload = new PaginatedListWithPermissions<DepartmentVm>(0, departments, new Dictionary<string, bool>());
        service.GetAll().Returns(payload);

        var handler = new GetAllDepartmentsQueryHandler(service);
        var result = await handler.Handle(new GetAllDepartmentsQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).GetAll();
    }

    // ── GetComboBox ─────────────────────────────────────────

    [Fact]
    public async Task GetComboBoxHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IDepartmentService>();
        List<DepartmentComboBoxVm> expected = [];
        service.GetAllForComboBox().Returns(expected);

        var handler = new GetDepartmentComboBoxQueryHandler(service);
        var result = await handler.Handle(
            new GetDepartmentComboBoxQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).GetAllForComboBox();
    }
}
