## ADDED Requirements

### Requirement: Axios Error Interceptor
The system SHALL implement an Axios response interceptor that handles all API errors centrally.

#### Scenario: Network error
- **WHEN** network request fails (timeout, DNS error, connection refused)
- **THEN** user sees toast notification with generic "Network error. Please try again."
- **AND** error is logged to console with full details

#### Scenario: 4xx client error
- **WHEN** API returns 400-499 status
- **THEN** user sees toast with error message from API response if available
- **AND** error is logged for debugging

#### Scenario: 5xx server error
- **WHEN** API returns 500-599 status
- **THEN** user sees toast with "Server error. Please try again later."
- **AND** error is logged with full response details

### Requirement: Automatic Retry Logic
The system SHALL automatically retry failed requests up to 3 times with exponential backoff for transient failures.

#### Scenario: Retry on timeout
- **WHEN** request times out
- **THEN** system retries up to 3 times with 1s, 2s, 4s delays
- **AND** user sees loading indicator during retries

#### Scenario: Retry on 5xx error
- **WHEN** API returns 502, 503, or 504
- **THEN** system retries up to 3 times
- **AND** if all retries fail, shows final error message

#### Scenario: No retry on 4xx error
- **WHEN** API returns 400-499 status (except 429)
- **THEN** system does NOT retry
- **AND** error is shown immediately

### Requirement: Error Logging
The system SHALL log all API errors with sufficient detail for debugging while sanitizing sensitive data.

#### Scenario: Log error details
- **WHEN** API request fails
- **THEN** console logs: endpoint, method, status code, timestamp
- **AND** full error object is available in development mode only
