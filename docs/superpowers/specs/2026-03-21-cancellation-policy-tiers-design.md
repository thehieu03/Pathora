# CancellationPolicy Tiers Redesign

## Overview

Redesign CancellationPolicy to use a tiered structure (like PricingPolicy), where each policy contains a list of cancellation tiers with day ranges and penalty percentages.

## Problem Statement

1. **Flat structure** — Current `CancellationPolicyEntity` stores a single `MinDays`, `MaxDays`, `PenaltyPercentage` per record. Creating a complete refund schedule requires multiple policy records per TourScope.
2. **No compound policies** — A tour's cancellation policy is a single row, but a realistic refund schedule needs multiple brackets (e.g., 7+ days = 100% refund, 3-7 days = 70% refund, 0-3 days = 0% refund).
3. **Unused field** — `ApplyOn` (FullAmount/DepositOnly) is always "DepositOnly" — should be removed.

## Design

### 1. Domain Model

#### CancellationPolicyTier (new value object)

```csharp
public sealed record CancellationPolicyTier(
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage)
{
    // Enforce invariants via factory method in CancellationPolicyEntity
    public static CancellationPolicyTier? Create(int min, int max, decimal penalty) =>
        min >= 0 && max >= min && penalty >= 0 && penalty <= 100
            ? new CancellationPolicyTier(min, max, penalty)
            : null;
}
```

**All-zero penalty is allowed** — business may intentionally create a 0% tier (e.g., same-day cancellation with no refund).

#### CancellationPolicyEntity (modified)

**Fields to REMOVE:**
- `MinDaysBeforeDeparture` (int)
- `MaxDaysBeforeDeparture` (int)
- `PenaltyPercentage` (decimal)
- `ApplyOn` (string)

**Fields to ADD:**
- `Tiers` (List<CancellationPolicyTier>) — stored as JSONB

**Fields to KEEP:**
- `Id`, `PolicyCode`, `TourScope`, `Status`, `IsDeleted`, `Translations`, audit fields

**Audit trail:** `performedBy` parameter added to `Create()` and `Update()` methods.

### 2. Validation Rules

| Rule | Description |
|------|-------------|
| MIN_TIER_COUNT | Policy must have at least 1 tier |
| TIER_NO_OVERLAP | No two tiers within the same policy (regardless of Status) may have overlapping day ranges |
| TIER_COVERS_ALL | Tiers must cover the full range from 0 to `int.MaxValue` with no gaps. The last tier must have `MaxDaysBeforeDeparture = int.MaxValue`. Enforce via: `tiers[^1].MaxDaysBeforeDeparture == int.MaxValue` |
| TIER_MIN_DAYS | Each tier's `MinDaysBeforeDeparture >= 0` |
| TIER_MIN_DAYS | Each tier's MinDaysBeforeDeparture >= 0 |
| TIER_MAX_GE_MIN | Each tier's MaxDaysBeforeDeparture >= MinDaysBeforeDeparture |
| TIER_PENALTY_RANGE | Each tier's PenaltyPercentage must be between 0 and 100 inclusive |

### 3. EF Core Configuration

**Remove columns from `CancellationPolicies` table:**
- `MinDaysBeforeDeparture`
- `MaxDaysBeforeDeparture`
- `PenaltyPercentage`
- `ApplyOn`

**Add/update:**
- `Tiers` → JSONB column (`List<CancellationPolicyTier>`), stored as JSON array

### 4. Repository Interface

**Add new method:**
```csharp
Task<IReadOnlyList<CancellationPolicyEntity>> FindByTourScope(TourScope tourScope);
```

Returns all non-deleted policies (regardless of Status) for the given TourScope. Follows existing pattern: `!IsDeleted` only.

### 5. CalculateRefund Logic

**Request:**
```csharp
public sealed record CalculateRefundRequest(
    Guid TourId,
    DateTimeOffset CancellationDate,
    decimal DepositAmount);
```

**Response:**
```csharp
public sealed record CalculateRefundResponse(
    decimal DepositAmount,
    int DaysBeforeDeparture,
    CancellationPolicyTier? MatchingTier,
    string? PolicyCode,
    decimal RefundAmount,
    decimal PenaltyAmount,
    CalculationStatus Status);  // Calculated | NoPolicyAssigned | NoTierMatch | AfterDeparture

public enum CalculationStatus { Calculated, NoPolicyAssigned, NoTierMatch, AfterDeparture }
```

**Algorithm:**
1. Load `Tour` → get `CancellationPolicyId`
2. If `CancellationPolicyId` is null → return `RefundAmount = DepositAmount`, `Status = NoPolicyAssigned`
3. Load `CancellationPolicy` → get `Tiers`
4. Compute `daysBeforeDeparture = (Tour.DepartureDate - CancellationDate).Days`
5. If `daysBeforeDeparture < 0` → return `RefundAmount = 0`, `Status = AfterDeparture` (already departed)
6. Find matching tier: tier where `MinDaysBeforeDeparture <= daysBeforeDeparture <= MaxDaysBeforeDeparture`
7. If no tier matches → return `RefundAmount = 0`, `Status = NoTierMatch`
8. Compute `PenaltyAmount = DepositAmount * (PenaltyPercentage / 100)`
9. Compute `RefundAmount = DepositAmount - PenaltyAmount`, `Status = Calculated`

### 6. CQRS Commands

#### CreateCancellationPolicyCommand
```csharp
public sealed record CreateCancellationPolicyCommand(
    TourScope TourScope,
    List<CancellationPolicyTier> Tiers,
    Dictionary<string, CancellationPolicyTranslationData>? Translations = null
) : ICommand<ErrorOr<CancellationPolicyResponse>>;
```

#### UpdateCancellationPolicyCommand
```csharp
public sealed record UpdateCancellationPolicyCommand(
    Guid Id,
    TourScope TourScope,
    List<CancellationPolicyTier> Tiers,
    CancellationPolicyStatus? Status = null,
    Dictionary<string, CancellationPolicyTranslationData>? Translations = null
) : ICommand<ErrorOr<Success>>;
```

### 7. CQRS Queries

#### GetCancellationPoliciesByScopeQuery (new)
```csharp
public sealed record GetCancellationPoliciesByScopeQuery(TourScope TourScope)
    : IQuery<ErrorOr<IReadOnlyList<CancellationPolicyResponse>>>;
```

Existing queries unchanged: `GetAllCancellationPoliciesQuery`, `GetCancellationPolicyByIdQuery`.

### 8. API Endpoints

Existing endpoints unchanged (POST, PUT, DELETE, GET all, GET by id).

New endpoint:
- `GET /api/cancellation-policies/scope/{scope}` → `GetCancellationPoliciesByScopeQuery`
- `POST /api/cancellation-policies/calculate-refund` → `CalculateRefundQuery`

## Out of Scope

- Frontend UI redesign (form/list) — backend only
- Changing Tour → CancellationPolicyId relationship
- Migrating existing CancellationPolicy data — requires a sequential migration: (1) add new `Tiers` JSONB column first, (2) populate `Tiers` from existing columns, (3) only then drop old columns. Out of scope: the migration script itself.
- Multi-language tier labels (tiers are numeric/ranges, translations stay at policy level for description)
