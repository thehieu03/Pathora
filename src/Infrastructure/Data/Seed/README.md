# Seed Data Workflow

This folder contains the startup seed pipeline for `AppDbContext`.

## Class-to-JSON contract

Each `*ContextSeed` class that loads file-based data must have exactly one JSON file in `Seeddata/`.

| Seed class | JSON file |
| --- | --- |
| `BookingAccommodationDetailContextSeed` | `booking-accommodation-detail.json` |
| `BookingActivityReservationContextSeed` | `booking-activity-reservation.json` |
| `BookingContextSeed` | `booking.json` |
| `BookingParticipantContextSeed` | `booking-participant.json` |
| `BookingTourGuideContextSeed` | `booking-tour-guide.json` |
| `BookingTransportDetailContextSeed` | `booking-transport-detail.json` |
| `CustomerDepositContextSeed` | `customer-deposit.json` |
| `CustomerPaymentContextSeed` | `customer-payment.json` |
| `DepartmentContextSeed` | `department.json` |
| `DynamicPricingTierContextSeed` | `dynamic-pricing-tier.json` |
| `FileMetadataContextSeed` | `file-metadata.json` |
| `FunctionContextSeed` | `function.json` |
| `OtpContextSeed` | `otp.json` |
| `PassportContextSeed` | `passport.json` |
| `PositionContextSeed` | `position.json` |
| `RefreshTokenContextSeed` | `refresh-token.json` |
| `RegisterContextSeed` | `register.json` |
| `ReviewContextSeed` | `review.json` |
| `RoleContextSeed` | `role.json` |
| `RoleFunctionContextSeed` | `role-function.json` |
| `SupplierContextSeed` | `supplier.json` |
| `SupplierPayableContextSeed` | `supplier-payable.json` |
| `SupplierReceiptContextSeed` | `supplier-receipt.json` |
| `TourClassificationContextSeed` | `tour-classification.json` |
| `TourContextSeed` | `tour.json` |
| `TourDayActivityContextSeed` | `tour-day-activity.json` |
| `TourDayActivityGuideContextSeed` | `tour-day-activity-guide.json` |
| `TourDayActivityStatusContextSeed` | `tour-day-activity-status.json` |
| `TourDayContextSeed` | `tour-day.json` |
| `TourGuideContextSeed` | `tour-guide.json` |
| `TourInstanceContextSeed` | `tour-instance.json` |
| `TourInsuranceContextSeed` | `tour-insurance.json` |
| `TourPlanAccommodationContextSeed` | `tour-plan-accommodation.json` |
| `TourPlanLocationContextSeed` | `tour-plan-location.json` |
| `TourPlanRouteContextSeed` | `tour-plan-route.json` |
| `TourRequestContextSeed` | `tour-request.json` |
| `UserContextSeed` | `user.json` |
| `UserRoleContextSeed` | `user-role.json` |
| `VisaApplicationContextSeed` | `visa-application.json` |
| `VisaContextSeed` | `visa.json` |

The canonical mapping and required field checks are defined in `SeedFileManifest`.

## Supported JSON root shapes

- Raw array: `[{ ... }]`
- Envelope object: `{ "data": [{ ... }] }`

Any other shape is treated as invalid by preflight validation.

## Quality Contract

The seed data validation pipeline enforces the following rules:

### Phase 1: Structural Validation
1. Required file exists
2. JSON is readable and parseable
3. Root shape is supported (array or `{ "data": [...] }`)
4. Required fields per file are present (for each item)
5. Required fields are not null or empty strings

### Phase 2: Duplicate ID Validation
- Files with an `IdField` defined in the manifest are checked for duplicate IDs
- Each ID must be unique within its file

### Phase 3: Cross-File Reference Validation
- Foreign key references are validated against parent file IDs
- Reference fields must point to existing records in referenced files

### File Categories

| Category | Description | Validation Rules |
|----------|-------------|------------------|
| **Entity files** | Files with primary IDs (e.g., `user.json`, `booking.json`) | Required fields + Duplicate ID check |
| **Relationship files** | Junction tables (e.g., `user-role.json`, `role-function.json`) | Required fields + Reference integrity |
| **Reference files** | Lookup tables (e.g., `role.json`, `department.json`) | Required fields + Duplicate ID check |

### Cross-File Reference Map

| Reference Field | Target File |
|----------------|-------------|
| `UserId` | `user.json` |
| `RoleId` | `role.json` |
| `TourId` | `tour.json` |
| `ClassificationId` | `tour-classification.json` |
| `TourInstanceId` | `tour-instance.json` |
| `BookingId` | `booking.json` |
| `BookingActivityReservationId` | `booking-activity-reservation.json` |
| `BookingParticipantId` | `booking-participant.json` |
| `TourDayId` | `tour-day.json` |
| `TourDayActivityStatusId` | `tour-day-activity-status.json` |
| `TourGuideId` | `tour-guide.json` |
| `SupplierId` | `supplier.json` |
| `SupplierPayableId` | `supplier-payable.json` |
| `PassportId` | `passport.json` |
| `VisaApplicationId` | `visa-application.json` |
| `FunctionId` | `function.json` |
| `CategoryId` | `function.json` |

## Startup behavior

Before executing seed batches, `AppDbContextSeed` runs a preflight validation:

1. Phase 1: Structural validation (required fields, JSON shape)
2. Phase 2: Duplicate ID detection
3. Phase 3: Cross-file reference integrity

If validation fails, startup seeding aborts with a detailed error listing file path, item index, and issue description.

## Adding a new seed class

When adding a new `*ContextSeed` class:

1. Add its JSON file under `Seeddata/`.
2. Add a mapping entry in `SeedFileManifest`.
3. Define required fields for validation.
4. If the file has cross-file references, add reference field mappings.
5. Add/update tests in `tests/Domain.Specs/Infrastructure`.
