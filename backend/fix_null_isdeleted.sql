UPDATE "TourClassifications" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
UPDATE "TourDays" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
UPDATE "TourDayActivities" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
UPDATE "TourPlanRoutes" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
UPDATE "TourPlanAccommodations" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
UPDATE "TourInsurances" SET "IsDeleted" = false WHERE "IsDeleted" IS NULL;
