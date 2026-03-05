using Application.Common.Contracts;
using Application.Contracts.Position;
using Application.Features.Position.Queries;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class PositionQueryHandlerTests
{
    // ── GetAll ──────────────────────────────────────────────

    [Fact]
    public async Task GetAllHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IPositionService>();
        var positions = new List<PositionVm>();
        var payload = new PaginatedListWithPermissions<PositionVm>(0, positions, new Dictionary<string, bool>());
        service.GetAllAsync(Arg.Any<GetAllPositionRequest>()).Returns(payload);

        var handler = new GetAllPositionsQueryHandler(service);
        var result = await handler.Handle(
            new GetAllPositionsQuery(1, 10, "search"), CancellationToken.None);

        Assert.False(result.IsError);
        await service.Received(1).GetAllAsync(
            Arg.Is<GetAllPositionRequest>(r =>
                r.PageNumber == 1 && r.PageSize == 10 && r.SearchText == "search"));
    }

    // ── GetComboBox ─────────────────────────────────────────

    [Fact]
    public async Task GetComboBoxHandler_ShouldDelegateToService()
    {
        var service = Substitute.For<IPositionService>();
        List<LookupVm> expected = [new LookupVm("1", "Manager")];
        service.GetComboboxAsync().Returns(expected);

        var handler = new GetPositionComboBoxQueryHandler(service);
        var result = await handler.Handle(
            new GetPositionComboBoxQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        await service.Received(1).GetComboboxAsync();
    }
}
