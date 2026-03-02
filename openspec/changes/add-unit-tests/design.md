## Context

The Pathora frontend currently has no test suite. The codebase uses Next.js 16, React 19, Redux Toolkit, and various UI components. Adding unit tests will improve code quality and prevent regressions.

## Goals / Non-Goals

**Goals:**
- Set up Jest and React Testing Library with proper configuration
- Add tests for UI components (Button, Input, Modal, Dropdown)
- Add tests for custom hooks (useAuth, useRealtimeRefresh)
- Add tests for utility functions
- Run tests in CI pipeline

**Non-Goals:**
- End-to-end testing (out of scope)
- Snapshot testing (avoid due to maintenance overhead)
- Testing third-party library internals
- 100% code coverage (unrealistic target)

## Decisions

### Decision 1: Jest + React Testing Library
**Chosen:** Use Jest as test runner with React Testing Library for component testing
**Rationale:** Industry standard, well-supported, great integration with React
**Alternative:** Vitest - similar but Jest is more established

### Decision 2: Co-located Tests
**Chosen:** Place test files next to source files with `.test.ts` / `.test.tsx` naming
**Rationale:** Easier to find, clear ownership, follows common pattern
**Alternative:** Central `__tests__` directory - harder to locate related files

### Decision 3: No Snapshot Testing
**Chosen:** Avoid snapshot tests for UI components
**Rationale:** High maintenance, false positives on whitespace changes, not actionable
**Alternative:** Use explicit assertions instead

### Decision 4: Mock External Dependencies
**Chosen:** Mock API calls, Redux store, and external services in tests
**Rationale:** Tests should be fast, isolated, and not depend on network
**Alternative:** Use real services - fragile, slow, requires backend

## Risks / Trade-offs

- **Risk**: Tests become an afterthought → **Mitigation**: Require tests for new features in PR review
- **Risk**: Flaky tests from timing issues → **Mitigation**: Use waitFor, act() for async operations
- **Risk**: Maintenance burden → **Mitigation**: Keep tests simple, focus on critical paths

## Migration Plan

1. Install dependencies (jest, @testing-library/*, jest-environment-jsdom)
2. Configure Jest in `jest.config.js`
3. Add test scripts to `package.json`
4. Create test utilities and mocks
5. Add tests incrementally by priority (hooks > utils > components)
6. Add GitHub Actions workflow for running tests

**Rollback:** Remove test dependencies and scripts; tests are non-breaking.
