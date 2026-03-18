using Application.Services;
using Application.Contracts.DepositPolicy;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using Domain.Specs.Helpers;
using NSubstitute;

namespace Domain.Specs.Services;

public sealed class DepositPolicyServiceTests
{
    private readonly IDepositPolicyRepository _repository = Substitute.For<IDepositPolicyRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly DepositPolicyService _sut;

    public DepositPolicyServiceTests()
    {
        _sut = new DepositPolicyService(_repository, _unitOfWork);
    }

    [Fact]
    public async Task GetAllAsync_WhenPoliciesExist_ShouldReturnAllPolicies()
    {
        var policies = new List<DepositPolicyEntity>
        {
            TestDataBuilder.CreateDepositPolicy(TourScope.Domestic, DepositType.Percentage, 10, 7),
            TestDataBuilder.CreateDepositPolicy(TourScope.International, DepositType.FixedAmount, 500, 14)
        };
        _repository.GetListAsync(Arg.Any<System.Linq.Expressions.Expression<Func<DepositPolicyEntity, bool>>>()).Returns(policies);

        var result = await _sut.GetAllAsync();

        Assert.False(result.IsError);
        Assert.Equal(2, result.Value.Count);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoPolicies_ShouldReturnEmptyList()
    {
        _repository.GetListAsync(Arg.Any<System.Linq.Expressions.Expression<Func<DepositPolicyEntity, bool>>>()).Returns(new List<DepositPolicyEntity>());

        var result = await _sut.GetAllAsync();

        Assert.False(result.IsError);
        Assert.Empty(result.Value);
    }

    [Fact]
    public async Task GetByIdAsync_WhenPolicyExists_ShouldReturnPolicy()
    {
        var policy = TestDataBuilder.CreateDepositPolicy();
        _repository.GetByIdAsync(policy.Id).Returns(policy);

        var result = await _sut.GetByIdAsync(policy.Id);

        Assert.False(result.IsError);
        Assert.NotNull(result.Value);
        Assert.Equal(policy.Id, result.Value.Id);
    }

    [Fact]
    public async Task GetByIdAsync_WhenPolicyNotFound_ShouldReturnNull()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((DepositPolicyEntity?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.False(result.IsError);
        Assert.Null(result.Value);
    }

    [Fact]
    public async Task CreateAsync_WhenValidRequest_ShouldCreateAndReturnId()
    {
        var request = new CreateDepositPolicyRequest(
            TourScope: 1,
            DepositType: 1,
            DepositValue: 10,
            MinDaysBeforeDeparture: 7
        );

        var result = await _sut.Create(request);

        Assert.False(result.IsError);
        Assert.NotEqual(Guid.Empty, result.Value);
        await _repository.Received(1).AddAsync(Arg.Any<DepositPolicyEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task UpdateAsync_WhenPolicyExists_ShouldUpdateSuccessfully()
    {
        var policy = TestDataBuilder.CreateDepositPolicy();
        _repository.GetByIdAsync(policy.Id).Returns(policy);

        var request = new UpdateDepositPolicyRequest(
            Id: policy.Id,
            TourScope: 2,
            DepositType: 2,
            DepositValue: 20,
            MinDaysBeforeDeparture: 14,
            IsActive: true
        );

        var result = await _sut.Update(request);

        Assert.False(result.IsError);
        _repository.Received(1).Update(Arg.Any<DepositPolicyEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task UpdateAsync_WhenPolicyNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((DepositPolicyEntity?)null);

        var request = new UpdateDepositPolicyRequest(
            Id: id,
            TourScope: 1,
            DepositType: 1,
            DepositValue: 10,
            MinDaysBeforeDeparture: 7,
            IsActive: true
        );

        var result = await _sut.Update(request);

        Assert.True(result.IsError);
    }

    [Fact]
    public async Task DeleteAsync_WhenPolicyExists_ShouldSoftDeleteSuccessfully()
    {
        var policy = TestDataBuilder.CreateDepositPolicy();
        _repository.GetByIdAsync(policy.Id).Returns(policy);

        var result = await _sut.Delete(policy.Id);

        Assert.False(result.IsError);
        Assert.True(policy.IsDeleted);
        _repository.Received(1).Update(Arg.Any<DepositPolicyEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task DeleteAsync_WhenPolicyNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((DepositPolicyEntity?)null);

        var result = await _sut.Delete(id);

        Assert.True(result.IsError);
    }
}
