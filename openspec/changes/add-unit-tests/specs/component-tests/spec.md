## ADDED Requirements

### Requirement: Button Component Tests
The system SHALL have unit tests for the Button UI component.

#### Scenario: Button renders with text
- **WHEN** Button is rendered with children "Click me"
- **THEN** the button displays "Click me" text

#### Scenario: Button handles click
- **WHEN** Button is clicked
- **THEN** onClick handler is called exactly once

#### Scenario: Button disabled state
- **WHEN** Button is rendered with disabled prop
- **THEN** the button is not clickable

### Requirement: Input Component Tests
The system SHALL have unit tests for the Input UI component.

#### Scenario: Input renders with placeholder
- **WHEN** Input is rendered with placeholder "Enter name"
- **THEN** the input displays the placeholder

#### Scenario: Input handles change
- **WHEN** User types in Input
- **THEN** onChange handler is called with new value

#### Scenario: Input disabled state
- **WHEN** Input is rendered with disabled prop
- **THEN** the input is not editable

### Requirement: Modal Component Tests
The system SHALL have unit tests for the Modal UI component.

#### Scenario: Modal renders when open
- **WHEN** Modal is rendered with isOpen=true
- **THEN** modal content is visible

#### Scenario: Modal hides when closed
- **WHEN** Modal is rendered with isOpen=false
- **THEN** modal content is not visible

#### Scenario: Modal calls onClose
- **WHEN** Close button is clicked
- **THEN** onClose handler is called
