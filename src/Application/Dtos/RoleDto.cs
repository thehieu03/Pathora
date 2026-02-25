using Domain.Enums;

namespace Application.Dtos;

public sealed record RoleDto(
    Guid Id,
    string Name,
    string Description,
    int Type,
    RoleStatus Status,
    bool IsDeleted,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
