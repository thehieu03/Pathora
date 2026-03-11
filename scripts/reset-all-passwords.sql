BEGIN;

UPDATE "Users"
SET
    "Password" = '$2a$11$aHevJ1elHGxm6wftReimVu5LFYUs5rwTBVEPfJ5mn7C0ZgkKna7C.',
    "ForcePasswordChange" = FALSE,
    "LastModifiedBy" = 'script.reset-all-passwords',
    "LastModifiedOnUtc" = NOW()
WHERE "IsDeleted" = FALSE;

DELETE FROM "RefreshTokens";

COMMIT;
