DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'BookingActivityReservations'
    )
    AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'BookingActivityReservations'
          AND column_name = 'SupplierName'
    ) THEN
        INSERT INTO "Suppliers"
        (
            "Id",
            "SupplierCode",
            "SupplierType",
            "Name",
            "IsActive",
            "IsDeleted",
            "CreatedOnUtc",
            "CreatedBy",
            "LastModifiedOnUtc",
            "LastModifiedBy"
        )
        SELECT
            (
                substr(md5(trim(legacy."SupplierName")), 1, 8) || '-' ||
                substr(md5(trim(legacy."SupplierName")), 9, 4) || '-' ||
                substr(md5(trim(legacy."SupplierName")), 13, 4) || '-' ||
                substr(md5(trim(legacy."SupplierName")), 17, 4) || '-' ||
                substr(md5(trim(legacy."SupplierName")), 21, 12)
            )::uuid,
            'SUP-' || upper(substr(md5(trim(legacy."SupplierName")), 1, 8)),
            COALESCE(NULLIF(legacy."SupplierType", ''), 'Other'),
            trim(legacy."SupplierName"),
            TRUE,
            FALSE,
            timezone('utc', now()),
            'backfill-script',
            timezone('utc', now()),
            'backfill-script'
        FROM (
            SELECT DISTINCT
                "SupplierName",
                "SupplierType"
            FROM "BookingActivityReservations"
            WHERE "SupplierName" IS NOT NULL
              AND length(trim("SupplierName")) > 0
        ) AS legacy
        ON CONFLICT ("SupplierCode") DO NOTHING;
    END IF;
END $$;
