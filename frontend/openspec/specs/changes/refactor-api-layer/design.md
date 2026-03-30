## Context

The current API layer in `frontend/src/api/` uses Axios for HTTP requests but lacks consistent patterns for:
- TypeScript typing of API responses
- Error handling with user-friendly messages
- Retry logic for transient network failures
- Loading state management

The codebase uses Redux Toolkit with RTK Query for some data fetching, but service functions (`src/services/*.ts`) directly use Axios without consistent typing.

## Goals / Non-Goals

**Goals:**
- Create standardized TypeScript interfaces for all API responses
- Implement centralized error handling with toast notifications
- Add automatic retry logic for transient failures (network timeouts, 5xx errors)
- Provide consistent return types for all service functions
- Maintain backward compatibility with existing code

**Non-Goals:**
- Migrating all existing API calls to RTK Query
- Adding request/response caching (handled by RTK Query)
- Authentication token refresh logic (already handled)
- Rate limiting implementation

## Decisions

### Decision 1: Generic Response Wrapper Type
**Chosen:** Create a generic `ApiResponse<T>` type that wraps all responses
**Rationale:** Provides consistency across all service functions, easy to extend with pagination metadata
**Alternative:** Use individual types per endpoint - leads to duplication

### Decision 2: Error Handling in Axios Interceptor
**Chosen:** Handle errors in Axios response interceptor
**Rationale:** Centralized, applies to all API calls automatically
**Alternative:** Handle errors in each service function - error-prone, repetitive

### Decision 3: Toast Notifications via react-toastify
**Chosen:** Use existing react-toastify for user-facing error messages
**Rationale:** Already in dependencies, consistent with existing error display pattern
**Alternative:** Create custom notification system - unnecessary complexity

### Decision 4: Retry Logic with Exponential Backoff
**Chosen:** Implement retry in Axios adapter with max 3 retries and exponential backoff
**Rationale:** Handles transient failures gracefully, prevents thundering herd
**Alternative:** No retry - users experience more failures on temporary network issues

## Risks / Trade-offs

- **Risk**: Breaking existing service function contracts → **Mitigation**: Keep existing function signatures, add typed return types as optional generic
- **Risk**: Error messages may reveal sensitive info → **Mitigation**: Sanitize error messages, log full details server-side
- **Risk**: Retry logic may delay error display → **Mitigation**: Show loading indicator during retry attempts

## Migration Plan

1. Create new type definitions in `src/types/api.ts`
2. Add error handling interceptor to `src/api/axiosInstance.ts`
3. Create retry adapter configuration
4. Update utility functions in `src/utils/apiResponse.ts`
5. Update service functions to use new types (non-breaking)
6. Add i18n translation keys for new error messages
7. Run lint and build to verify

**Rollback:** Revert changes to affected files; types are additive so existing code continues working.
