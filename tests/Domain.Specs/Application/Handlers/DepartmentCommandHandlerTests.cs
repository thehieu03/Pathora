using Application.Contracts.Department;
using Application.Features.Department.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class DepartmentCommandHandlerTests
{
    // ── Create ──────────────────────────────────────────────

    [Fact]
    public async Task CreateHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IDepartmentService>();
        var expectedId = Guid.CreateVersion7();
        service.Create(Arg.Any<CreateDepartmentRequest>()).Returns(expectedId);

        var handler = new CreateDepartmentCommandHandler(service);
        var parentId = Guid.CreateVersion7();
        var result = await handler.Handle(
            new CreateDepartmentCommand(parentId, "IT Department"),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expectedId, result.Value);
        await service.Received(1).Create(
            Arg.Is<CreateDepartmentRequest>(r =>
                r.DepartmentParentId == parentId && r.DepartmentName == "IT Department"));
    }

    [Fact]
    public async Task CreateHandler_WhenServiceReturnsError_ShouldPropagate()
    {
        var service = Substitute.For<IDepartmentService>();
        service.Create(Arg.Any<CreateDepartmentRequest>())
            .Returns(Error.Conflict("Department.Conflict", "Already exists"));

        var handler = new CreateDepartmentCommandHandler(service);
        var result = await handler.Handle(
            new CreateDepartmentCommand(null, "Duplicate"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Department.Conflict", result.FirstError.Code);
    }

    // ── Delete ──────────────────────────────────────────────

    [Fact]
    public async Task DeleteHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IDepartmentService>();
        var id = Guid.CreateVersion7();
        service.Delete(id).Returns(Result.Success);

        var handler = new DeleteDepartmentCommandHandler(service);
        var result = await handler.Handle(
            new DeleteDepartmentCommand(id), CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).Delete(id);
    }

    [Fact]
    public async Task DeleteHandler_WhenNotFound_ShouldPropagateError()
    {
        var service = Substitute.For<IDepartmentService>();
        var id = Guid.CreateVersion7();
        service.Delete(id)
            .Returns(Error.NotFound("Department.NotFound", "Not found"));

        var handler = new DeleteDepartmentCommandHandler(service);
        var result = await handler.Handle(
            new DeleteDepartmentCommand(id), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Department.NotFound", result.FirstError.Code);
    }
}
