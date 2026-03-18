using Application.Contracts.CancellationPolicy;
using Contracts;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;

namespace Application.Services;

public interface ICancellationPolicyService
{
    Task<ErrorOr<CancellationPolicyResponse>> Create(CreateCancellationPolicyRequest request);
    Task<ErrorOr<CancellationPolicyResponse>> Update(UpdateCancellationPolicyRequest request);
    Task<ErrorOr<Guid>> Delete(Guid id);
    Task<ErrorOr<IReadOnlyList<CancellationPolicyResponse>>> GetAll();
    Task<ErrorOr<CancellationPolicyResponse>> GetById(Guid id);
    Task<ErrorOr<CalculateRefundResponse>> CalculateRefund(CalculateRefundRequest request);
}

public class CancellationPolicyService(
    ICancellationPolicyRepository repository,
    IUnitOfWork unitOfWork) : ICancellationPolicyService
{
    private readonly ICancellationPolicyRepository _repository = repository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<CancellationPolicyResponse>> Create(CreateCancellationPolicyRequest request)
    {
        // Check for overlapping day ranges
        var existingPolicies = await _repository.FindAll();

        var hasOverlap = existingPolicies
            .Where(p => p.TourScope == request.TourScope && p.Status == CancellationPolicyStatus.Active)
            .Any(p =>
                (request.MinDaysBeforeDeparture >= p.MinDaysBeforeDeparture
                    && request.MinDaysBeforeDeparture <= p.MaxDaysBeforeDeparture)
                || (request.MaxDaysBeforeDeparture >= p.MinDaysBeforeDeparture
                    && request.MaxDaysBeforeDeparture <= p.MaxDaysBeforeDeparture)
                || (request.MinDaysBeforeDeparture <= p.MinDaysBeforeDeparture
                    && request.MaxDaysBeforeDeparture >= p.MaxDaysBeforeDeparture));

        if (hasOverlap)
        {
            return Error.Conflict("OVERLAPPING_POLICY", "A policy with overlapping day range already exists for this tour scope");
        }

        var entity = CancellationPolicyEntity.Create(
            request.TourScope,
            request.MinDaysBeforeDeparture,
            request.MaxDaysBeforeDeparture,
            request.PenaltyPercentage,
            request.ApplyOn
        );

        await _repository.Create(entity);
        await _unitOfWork.SaveChangeAsync();

        return ToResponse(entity);
    }

    public async Task<ErrorOr<CancellationPolicyResponse>> Update(UpdateCancellationPolicyRequest request)
    {
        var entity = await _repository.FindById(request.Id);
        if (entity == null)
        {
            return Error.NotFound("POLICY_NOT_FOUND", "Cancellation policy not found");
        }

        // Check for overlapping day ranges (excluding current entity)
        var existingPolicies = await _repository.FindAll();

        var hasOverlap = existingPolicies
            .Where(p => p.Id != request.Id && p.TourScope == request.TourScope && p.Status == CancellationPolicyStatus.Active)
            .Any(p =>
                (request.MinDaysBeforeDeparture >= p.MinDaysBeforeDeparture
                    && request.MinDaysBeforeDeparture <= p.MaxDaysBeforeDeparture)
                || (request.MaxDaysBeforeDeparture >= p.MinDaysBeforeDeparture
                    && request.MaxDaysBeforeDeparture <= p.MaxDaysBeforeDeparture)
                || (request.MinDaysBeforeDeparture <= p.MinDaysBeforeDeparture
                    && request.MaxDaysBeforeDeparture >= p.MaxDaysBeforeDeparture));

        if (hasOverlap)
        {
            return Error.Conflict("OVERLAPPING_POLICY", "A policy with overlapping day range already exists for this tour scope");
        }

        entity.Update(
            request.TourScope,
            request.MinDaysBeforeDeparture,
            request.MaxDaysBeforeDeparture,
            request.PenaltyPercentage,
            request.ApplyOn,
            request.Status,
            "system"
        );

        await _repository.UpdateAsync(entity);
        await _unitOfWork.SaveChangeAsync();

        return ToResponse(entity);
    }

    public async Task<ErrorOr<Guid>> Delete(Guid id)
    {
        var entity = await _repository.FindById(id);
        if (entity == null)
        {
            return Error.NotFound("POLICY_NOT_FOUND", "Cancellation policy not found");
        }

        entity.SoftDelete("system");
        await _repository.UpdateAsync(entity);
        await _unitOfWork.SaveChangeAsync();

        return entity.Id;
    }

    public async Task<ErrorOr<IReadOnlyList<CancellationPolicyResponse>>> GetAll()
    {
        var entities = await _repository.FindAll();
        return entities.Select(ToResponse).ToList();
    }

    public async Task<ErrorOr<CancellationPolicyResponse>> GetById(Guid id)
    {
        var entity = await _repository.FindById(id);
        if (entity == null)
        {
            return Error.NotFound("POLICY_NOT_FOUND", "Cancellation policy not found");
        }

        return ToResponse(entity);
    }

    public async Task<ErrorOr<CalculateRefundResponse>> CalculateRefund(CalculateRefundRequest request)
    {
        // Find the applicable policy based on days before departure
        var daysBeforeDeparture = (request.CancellationDate - DateTimeOffset.UtcNow).Days;

        // For now, we need the tour to get its scope - we'll use a simple approach
        // In a real implementation, we'd inject TourRepository or TourService to get the tour's scope
        // For this implementation, we'll search all active policies
        var policy = await _repository.FindByTourScopeAndDays(TourScope.Domestic, daysBeforeDeparture);

        if (policy == null)
        {
            return Error.NotFound("NO_POLICY_FOUND", "No applicable cancellation policy found for this cancellation date");
        }

        var penaltyAmount = request.PaidAmount * policy.PenaltyPercentage / 100;
        var refundAmount = request.PaidAmount - penaltyAmount;

        return new CalculateRefundResponse(
            request.PaidAmount,
            policy.PenaltyPercentage,
            penaltyAmount,
            refundAmount,
            policy.PolicyCode
        );
    }

    private static CancellationPolicyResponse ToResponse(CancellationPolicyEntity entity) =>
        new(
            entity.Id,
            entity.PolicyCode,
            entity.TourScope,
            entity.TourScope.ToString(),
            entity.MinDaysBeforeDeparture,
            entity.MaxDaysBeforeDeparture,
            entity.PenaltyPercentage,
            entity.ApplyOn,
            entity.Status,
            entity.Status.ToString(),
            entity.CreatedOnUtc,
            entity.LastModifiedOnUtc
        );
}
