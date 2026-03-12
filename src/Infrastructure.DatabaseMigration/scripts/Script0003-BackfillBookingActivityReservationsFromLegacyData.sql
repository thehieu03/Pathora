DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'LegacyBookingActivities'
    )
    AND EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'BookingActivityReservations'
    ) THEN
        INSERT INTO "BookingActivityReservations"
        (
            "Id",
            "BookingId",
            "SupplierId",
            "Order",
            "ActivityType",
            "Title",
            "Description",
            "StartTime",
            "EndTime",
            "TotalServicePrice",
            "TotalServicePriceAfterTax",
            "Status",
            "Note",
            "CreatedOnUtc",
            "CreatedBy",
            "LastModifiedOnUtc",
            "LastModifiedBy"
        )
        SELECT
            COALESCE(legacy."Id", (
                substr(md5(legacy."BookingId"::text || ':' || legacy."ActivityOrder"::text), 1, 8) || '-' ||
                substr(md5(legacy."BookingId"::text || ':' || legacy."ActivityOrder"::text), 9, 4) || '-' ||
                substr(md5(legacy."BookingId"::text || ':' || legacy."ActivityOrder"::text), 13, 4) || '-' ||
                substr(md5(legacy."BookingId"::text || ':' || legacy."ActivityOrder"::text), 17, 4) || '-' ||
                substr(md5(legacy."BookingId"::text || ':' || legacy."ActivityOrder"::text), 21, 12)
            )::uuid),
            legacy."BookingId",
            legacy."SupplierId",
            legacy."ActivityOrder",
            COALESCE(NULLIF(legacy."ActivityType", ''), 'Activity'),
            COALESCE(NULLIF(legacy."Title", ''), 'Legacy activity'),
            legacy."Description",
            legacy."StartTime",
            legacy."EndTime",
            COALESCE(legacy."TotalServicePrice", 0),
            COALESCE(legacy."TotalServicePriceAfterTax", COALESCE(legacy."TotalServicePrice", 0)),
            COALESCE(NULLIF(legacy."Status", ''), 'Pending'),
            legacy."Note",
            COALESCE(legacy."CreatedOnUtc", timezone('utc', now())),
            COALESCE(legacy."CreatedBy", 'backfill-script'),
            COALESCE(legacy."LastModifiedOnUtc", timezone('utc', now())),
            COALESCE(legacy."LastModifiedBy", 'backfill-script')
        FROM "LegacyBookingActivities" legacy
        WHERE NOT EXISTS (
            SELECT 1
            FROM "BookingActivityReservations" current
            WHERE current."BookingId" = legacy."BookingId"
              AND current."Order" = legacy."ActivityOrder"
        );
    END IF;
END $$;
