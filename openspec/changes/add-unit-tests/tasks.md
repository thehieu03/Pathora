## 1. Install Dependencies

- [ ] 1.1 Install jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jest-environment-jsdom
- [ ] 1.2 Install @types/jest and ts-jest for TypeScript support

## 2. Configure Jest

- [ ] 2.1 Create jest.config.js with Next.js preset
- [ ] 2.2 Configure test environment (jsdom)
- [ ] 2.3 Add module name mapping for @/* aliases
- [ ] 2.4 Add test script to package.json
- [ ] 2.5 Create test setup file with @testing-library/jest-dom

## 3. Create Test Utilities

- [ ] 3.1 Create mock for axios/AxiosInstance
- [ ] 3.2 Create mock for Redux store
- [ ] 3.3 Create mock for SignalR service

## 4. Add Hook Tests

- [ ] 4.1 Create test for useAuth hook
- [ ] 4.2 Create test for useRealtimeRefresh hook

## 5. Add Utility Tests

- [ ] 5.1 Create test for formatCurrency function
- [ ] 5.2 Create test for apiResponse helpers

## 6. Add Component Tests

- [ ] 6.1 Create test for Button component
- [ ] 6.2 Create test for Input component
- [ ] 6.3 Create test for Modal component

## 7. CI Integration

- [ ] 7.1 Add test script to CI pipeline
- [ ] 7.2 Verify tests run on pull request
