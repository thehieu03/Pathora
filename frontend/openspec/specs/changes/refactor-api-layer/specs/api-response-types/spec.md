## ADDED Requirements

### Requirement: ApiResponse Generic Type
The system SHALL provide a generic `ApiResponse<T>` type that wraps all API responses with consistent structure including data, success status, and optional error information.

#### Scenario: Successful response
- **WHEN** API returns 2xx status with data
- **THEN** response is typed as `ApiResponse<T>` with `success: true` and `data: T`

#### Scenario: Error response
- **WHEN** API returns 4xx or 5xx status
- **THEN** response is typed as `ApiResponse<T>` with `success: false` and `error: ApiError`

### Requirement: PaginatedResponse Type
The system SHALL provide a `PaginatedResponse<T>` type for list endpoints with consistent pagination metadata.

#### Scenario: Paginated list request
- **WHEN** client requests a paginated list
- **THEN** response includes `items: T[]`, `total: number`, `page: number`, `pageSize: number`, `totalPages: number`

### Requirement: Service Function Return Types
All service functions in `src/services/` SHALL return typed `ApiResponse<T>` to enable consistent handling.

#### Scenario: Typed service call
- **WHEN** service function is called
- **THEN** return type is `Promise<ApiResponse<T>>` with proper TypeScript generics
