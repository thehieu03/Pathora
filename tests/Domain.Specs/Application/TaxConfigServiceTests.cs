using Application.Services;
using Application.Contracts.TaxConfig;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.UnitOfWork;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class TaxConfigServiceTests
{
    private readonly ITaxConfigRepository _repository = Substitute.For<ITaxConfigRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly TaxConfigService _sut;

    public TaxConfigServiceTests()
    {
        _sut = new TaxConfigService(_repository, _unitOfWork);
    }

    [Fact]
    public async Task GetAllAsync_WhenConfigsExist_ShouldReturnAllConfigs()
    {
        var configs = new List<TaxConfigEntity>
        {
            CreateTestTaxConfig("VAT", 10),
            CreateTestTaxConfig("Service Tax", 5)
        };
        _repository.GetListAsync().Returns(configs);

        var result = await _sut.GetAllAsync();

        Assert.False(result.IsError);
        Assert.Equal(2, result.Value.Count);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoConfigs_ShouldReturnEmptyList()
    {
        _repository.GetListAsync().Returns(new List<TaxConfigEntity>());

        var result = await _sut.GetAllAsync();

        Assert.False(result.IsError);
        Assert.Empty(result.Value);
    }

    [Fact]
    public async Task GetByIdAsync_WhenConfigExists_ShouldReturnConfig()
    {
        var config = CreateTestTaxConfig("VAT", 10);
        _repository.GetByIdAsync(config.Id).Returns(config);

        var result = await _sut.GetByIdAsync(config.Id);

        Assert.False(result.IsError);
        Assert.NotNull(result.Value);
        Assert.Equal(config.Id, result.Value.Id);
    }

    [Fact]
    public async Task GetByIdAsync_WhenConfigNotFound_ShouldReturnNull()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((TaxConfigEntity?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.False(result.IsError);
        Assert.Null(result.Value);
    }

    [Fact]
    public async Task CreateAsync_WhenValidRequest_ShouldCreateAndReturnId()
    {
        var request = new CreateTaxConfigRequest(
            TaxName: "VAT",
            TaxRate: 10,
            Description: "Value Added Tax",
            EffectiveDate: DateTimeOffset.UtcNow.AddDays(30)
        );

        var result = await _sut.Create(request);

        Assert.False(result.IsError);
        Assert.NotEqual(Guid.Empty, result.Value);
        await _repository.Received(1).AddAsync(Arg.Any<TaxConfigEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task UpdateAsync_WhenConfigExists_ShouldUpdateSuccessfully()
    {
        var config = CreateTestTaxConfig("VAT", 10);
        _repository.GetByIdAsync(config.Id).Returns(config);

        var request = new UpdateTaxConfigRequest(
            Id: config.Id,
            TaxName: "VAT Updated",
            TaxRate: 15,
            Description: "Updated VAT",
            EffectiveDate: DateTimeOffset.UtcNow.AddDays(60),
            IsActive: true
        );

        var result = await _sut.Update(request);

        Assert.False(result.IsError);
        _repository.Received(1).Update(Arg.Any<TaxConfigEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task UpdateAsync_WhenConfigNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((TaxConfigEntity?)null);

        var request = new UpdateTaxConfigRequest(
            Id: id,
            TaxName: "VAT",
            TaxRate: 10,
            Description: "Value Added Tax",
            EffectiveDate: DateTimeOffset.UtcNow.AddDays(30),
            IsActive: true
        );

        var result = await _sut.Update(request);

        Assert.True(result.IsError);
    }

    [Fact]
    public async Task DeleteAsync_WhenConfigExists_ShouldDeleteSuccessfully()
    {
        var config = CreateTestTaxConfig("VAT", 10);
        _repository.GetByIdAsync(config.Id).Returns(config);

        var result = await _sut.Delete(config.Id);

        Assert.False(result.IsError);
        _repository.Received(1).Delete(Arg.Any<TaxConfigEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task DeleteAsync_WhenConfigNotFound_ShouldReturnNotFoundError()
    {
        var id = Guid.CreateVersion7();
        _repository.GetByIdAsync(id).Returns((TaxConfigEntity?)null);

        var result = await _sut.Delete(id);

        Assert.True(result.IsError);
    }

    private static TaxConfigEntity CreateTestTaxConfig(string taxName, decimal taxRate)
    {
        return TaxConfigEntity.Create(
            taxName,
            taxRate,
            "Test description",
            DateTimeOffset.UtcNow.AddDays(30),
            "test"
        );
    }
}
