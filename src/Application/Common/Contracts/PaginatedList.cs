namespace Application.Common.Contracts;

public record PaginatedList<T>(
    int Total,
    List<T> Data
);