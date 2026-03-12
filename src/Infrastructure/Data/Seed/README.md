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

## Mandatory EN/VI bilingual contract

The following seed files must include both `Translations.vi.*` and `Translations.en.*` values for these field paths:

| JSON file | Required bilingual paths |
| --- | --- |
| `tour.json` | `Translations.vi.TourName`, `Translations.vi.ShortDescription`, `Translations.vi.LongDescription`, `Translations.vi.SEOTitle`, `Translations.vi.SEODescription`, `Translations.en.TourName`, `Translations.en.ShortDescription`, `Translations.en.LongDescription`, `Translations.en.SEOTitle`, `Translations.en.SEODescription` |
| `tour-classification.json` | `Translations.vi.Name`, `Translations.vi.Description`, `Translations.en.Name`, `Translations.en.Description` |
| `tour-instance.json` | `Translations.vi.Title`, `Translations.vi.TourName`, `Translations.vi.Location`, `Translations.vi.ClassificationName`, `Translations.en.Title`, `Translations.en.TourName`, `Translations.en.Location`, `Translations.en.ClassificationName` |
| `tour-day.json` | `Translations.vi.Title`, `Translations.vi.Description`, `Translations.en.Title`, `Translations.en.Description` |
| `tour-day-activity.json` | `Translations.vi.Title`, `Translations.vi.Description`, `Translations.en.Title`, `Translations.en.Description` |
| `tour-plan-location.json` | `Translations.vi.LocationName`, `Translations.vi.LocationDescription`, `Translations.en.LocationName`, `Translations.en.LocationDescription` |

## Supported JSON root shapes

- Raw array: `[{ ... }]`
- Envelope object: `{ "data": [{ ... }] }`

Any other shape is treated as invalid by preflight validation.

## Startup behavior

Before executing seed batches, `AppDbContextSeed` runs a preflight validation:

1. Required file exists.
2. JSON is readable and parseable.
3. Root shape is supported.
4. Required fields per file are present (for each item).

If validation fails, startup seeding aborts with diagnostics that include file name, file path, failing item index, item key (when available), and missing/invalid field path.

## Adding a new seed class

When adding a new `*ContextSeed` class:

1. Add its JSON file under `Seeddata/`.
2. Add a mapping entry in `SeedFileManifest`.
3. Define required fields for validation.
4. Add/update tests in `tests/Domain.Specs/Infrastructure`.
