using Application.Contracts.VisaPolicy;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.UnitOfWork;
using ErrorOr;

namespace Application.Services;

public interface IVisaPolicyService
{
    Task<ErrorOr<IReadOnlyList<VisaPolicyResponse>>> GetAllAsync();
    Task<ErrorOr<VisaPolicyResponse?>> GetByIdAsync(Guid id);
    Task<ErrorOr<Guid>> Create(CreateVisaPolicyRequest request);
    Task<ErrorOr<Success>> Update(UpdateVisaPolicyRequest request);
    Task<ErrorOr<Success>> Delete(Guid id);
}

public class VisaPolicyService(
    IVisaPolicyRepository visaPolicyRepository,
    IUnitOfWork unitOfWork)
    : IVisaPolicyService
{
    private readonly IVisaPolicyRepository _repository = visaPolicyRepository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<IReadOnlyList<VisaPolicyResponse>>> GetAllAsync()
    {
        var policies = await _repository.GetActivePoliciesAsync();
        return policies.Select(MapToResponse).ToList();
    }

    public async Task<ErrorOr<VisaPolicyResponse?>> GetByIdAsync(Guid id)
    {
        var policy = await _repository.GetByIdAsync(id);
        return policy is null ? null : MapToResponse(policy);
    }

    public async Task<ErrorOr<Guid>> Create(CreateVisaPolicyRequest request)
    {
        var existingPolicy = await _repository.GetByRegionAsync(request.Region);
        if (existingPolicy is not null)
        {
            return Error.Conflict("A visa policy for this region already exists.");
        }

        var policy = VisaPolicyEntity.Create(
            request.Region,
            request.ProcessingDays,
            request.BufferDays,
            request.FullPaymentRequired,
            "system",
            request.Translations
        );

        await _repository.AddAsync(policy);
        await _unitOfWork.SaveChangeAsync();
        return policy.Id;
    }

    public async Task<ErrorOr<Success>> Update(UpdateVisaPolicyRequest request)
    {
        var policy = await _repository.GetByIdAsync(request.Id);
        if (policy is null)
        {
            return Error.NotFound("Visa policy not found.");
        }

        policy.Update(
            request.Region,
            request.ProcessingDays,
            request.BufferDays,
            request.FullPaymentRequired,
            "system"
        );
        policy.SetActive(request.IsActive, "system");

        // Update translations if provided
        if (request.Translations != null)
        {
            policy.Translations = request.Translations;
        }

        _repository.Update(policy);
        await _unitOfWork.SaveChangeAsync();
        return Result.Success;
    }

    public async Task<ErrorOr<Success>> Delete(Guid id)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null)
        {
            return Error.NotFound("Visa policy not found.");
        }

        policy.SoftDelete("system");
        _repository.Update(policy);
        await _unitOfWork.SaveChangeAsync();
        return Result.Success;
    }

    private static VisaPolicyResponse MapToResponse(VisaPolicyEntity entity) => new(
        entity.Id,
        entity.Region,
        entity.ProcessingDays,
        entity.BufferDays,
        entity.FullPaymentRequired,
        entity.IsActive,
        entity.IsDeleted,
        entity.Translations ?? [],
        entity.CreatedOnUtc,
        entity.LastModifiedOnUtc
    );
}
