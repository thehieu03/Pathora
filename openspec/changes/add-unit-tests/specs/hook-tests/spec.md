## ADDED Requirements

### Requirement: useAuth Hook Tests
The system SHALL have unit tests for the useAuth custom hook.

#### Scenario: useAuth returns auth state
- **WHEN** useAuth is called
- **THEN** it returns user, isAuthenticated, login, logout functions

#### Scenario: useAuth login function
- **WHEN** login function is called with credentials
- **THEN** authentication is performed and state updates

#### Scenario: useAuth logout function
- **WHEN** logout function is called
- **THEN** user is cleared from state

### Requirement: useRealtimeRefresh Hook Tests
The system SHALL have unit tests for the useRealtimeRefresh custom hook.

#### Scenario: useRealtimeRefresh triggers refetch
- **WHEN** useRealtimeRefresh is called with queryFn
- **THEN** it returns a refresh function that calls the queryFn

#### Scenario: useRealtimeRefresh cleanup
- **WHEN** Component unmounts
- **THEN** no memory leaks from subscriptions
