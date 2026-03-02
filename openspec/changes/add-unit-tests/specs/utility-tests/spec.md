## ADDED Requirements

### Requirement: formatCurrency Tests
The system SHALL have unit tests for the formatCurrency utility function.

#### Scenario: formatCurrency with USD
- **WHEN** formatCurrency(1234.56, "USD") is called
- **THEN** it returns "$1,234.56"

#### Scenario: formatCurrency with VND
- **WHEN** formatCurrency(1000000, "VND") is called
- **THEN** it returns "1,000,000 ₫"

#### Scenario: formatCurrency with zero
- **WHEN** formatCurrency(0, "USD") is called
- **THEN** it returns "$0.00"

### Requirement: apiResponse Helper Tests
The system SHALL have unit tests for API response utility functions.

#### Scenario: extractData from successful response
- **WHEN** extractData is called with { success: true, data: { id: 1 } }
- **THEN** it returns { id: 1 }

#### Scenario: handleApiError processes error
- **WHEN** handleApiError is called with error object
- **THEN** it returns user-friendly error message
