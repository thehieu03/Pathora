## Why

The frontend codebase currently has no automated tests. This leads to regressions being caught late, difficulty refactoring with confidence, and manual testing overhead. Adding unit tests will improve code quality, catch bugs early, and enable safer refactoring.

## What Changes

- Install Jest and React Testing Library
- Configure test environment and matchers
- Add unit tests for critical UI components
- Add unit tests for custom hooks
- Add unit tests for utility functions
- Configure CI to run tests on PRs

## Capabilities

### New Capabilities

- `unit-test-infrastructure`: Jest and React Testing Library setup with proper configuration
- `component-tests`: Unit tests for reusable UI components (Button, Input, Modal, etc.)
- `hook-tests`: Unit tests for custom hooks (useAuth, useRealtimeRefresh, etc.)
- `utility-tests`: Unit tests for utility functions (formatCurrency, apiResponse helpers, etc.)

### Modified Capabilities

- None - this is a net new capability

## Impact

- `package.json` - Add jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- `jest.config.js` - Jest configuration for Next.js/React
- `src/components/ui/*.test.tsx` - Tests for UI primitives
- `src/hooks/*.test.ts` - Tests for custom hooks
- `src/utils/*.test.ts` - Tests for utility functions
- GitHub Actions - Add test runner to CI pipeline
