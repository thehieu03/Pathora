using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class BackfillTourInstanceTranslationsViEn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                WITH "Normalized" AS (
                    SELECT
                        "Id",
                        CASE
                            WHEN "Translations" IS NULL OR jsonb_typeof("Translations") <> 'object' THEN '{}'::jsonb
                            ELSE "Translations"
                        END AS "NormalizedTranslations",
                        jsonb_build_object(
                            'Title', "Title",
                            'Location', "Location",
                            'IncludedServices', COALESCE("IncludedServices", '[]'::jsonb),
                            'CancellationReason', "CancellationReason"
                        ) AS "FallbackPayload"
                    FROM "TourInstances"
                )
                UPDATE "TourInstances" AS ti
                SET "Translations" = jsonb_set(
                    jsonb_set(
                        n."NormalizedTranslations",
                        '{vi}',
                        COALESCE(n."NormalizedTranslations"->'vi', n."FallbackPayload"),
                        true
                    ),
                    '{en}',
                    COALESCE(n."NormalizedTranslations"->'en', n."FallbackPayload"),
                    true
                )
                FROM "Normalized" AS n
                WHERE ti."Id" = n."Id"
                  AND (
                      ti."Translations" IS NULL
                      OR jsonb_typeof(ti."Translations") <> 'object'
                      OR NOT (n."NormalizedTranslations" ? 'vi')
                      OR NOT (n."NormalizedTranslations" ? 'en')
                  );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
