## Why

The current API layer lacks consistent error handling patterns and proper TypeScript typing for API responses. This leads to runtime errors, inconsistent error messages displayed to users, and difficulty maintaining the API integration code. A refactor will improve developer experience and application reliability.

## What Changes

- Create centralized API response types with proper generics
- Implement standardized error handling with toast notifications
- Add retry logic for transient failures
- Create typed service functions with consistent return types
- Add loading state management patterns

## Capabilities

### New Capabilities

- `api-response-types`: Standardized TypeScript interfaces for all API responses including success, error, and pagination types
- `api-error-handler`: Centralized error handling with user-friendly messages, automatic retry for network errors, and consistent logging

### Modified Capabilities

- None - this is a refactoring of existing implementation

## Impact

- `src/api/axiosInstance.ts` - Modified to add interceptors for error handling
- `src/api/endpoints.ts` - Typed response structures
- `src/services/*.ts` - Updated to use new typed response helpers
- `src/utils/apiResponse.ts` - New utility functions for response handling
- `src/i18n/locales/` - May need new translation keys for error messages
