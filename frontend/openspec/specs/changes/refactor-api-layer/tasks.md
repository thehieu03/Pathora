## 1. Create Type Definitions

- [x] 1.1 Create `src/types/api.ts` with `ApiResponse<T>` generic interface
- [x] 1.2 Add `ApiError` interface with code, message, details
- [x] 1.3 Add `PaginatedResponse<T>` interface with metadata
- [x] 1.4 Export all types from a central location

## 2. Implement Error Handling

- [x] 2.1 Update `src/api/axiosInstance.ts` to add response interceptor
- [x] 2.2 Implement error toast notification in interceptor
- [x] 2.3 Add error logging with appropriate sanitization
- [x] 2.4 Add i18n translation keys for error messages (en.json, vi.json)

## 3. Implement Retry Logic

- [x] 3.1 Create retry adapter configuration with exponential backoff
- [x] 3.2 Configure max 3 retries for timeout and 5xx errors
- [x] 3.3 Ensure 4xx errors do not trigger retry
- [x] 3.4 Test retry behavior in development

## 4. Create Utility Functions

- [x] 4.1 Update `src/utils/apiResponse.ts` with helper functions
- [x] 4.2 Add `handleApiError` utility for consistent error handling
- [x] 4.3 Add `extractData` helper for typed response extraction

## 5. Update Service Functions

- [x] 5.1 Update `catalogService` to use typed responses
- [x] 5.2 Update `orderService` to use typed responses
- [x] 5.3 Update remaining services to use typed responses

## 6. Validation

- [x] 6.1 Run `npm run lint` to check for errors
- [ ] 6.2 Run `npm run build` to verify production build
- [ ] 6.3 Manual test error scenarios (network error, 500, 400)

Build was executed but failed due environment network restrictions when fetching Google Fonts (`Geist`, `Geist Mono`) during Next.js production build.
