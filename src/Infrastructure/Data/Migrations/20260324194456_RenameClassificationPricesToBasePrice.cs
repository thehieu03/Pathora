using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameClassificationPricesToBasePrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: If AdultPrice still exists, migrate data
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    -- If old columns exist, copy AdultPrice to BasePrice
                    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourClassifications' AND column_name = 'AdultPrice') THEN
                        -- Check if BasePrice already exists (add if missing)
                        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourClassifications' AND column_name = 'BasePrice') THEN
                            ALTER TABLE ""TourClassifications"" ADD COLUMN ""BasePrice"" numeric(18,2) NOT NULL DEFAULT 0;
                        END IF;

                        -- Copy data
                        UPDATE ""TourClassifications"" SET ""BasePrice"" = ""AdultPrice"" WHERE ""AdultPrice"" IS NOT NULL;

                        -- Drop old columns
                        ALTER TABLE ""TourClassifications"" DROP COLUMN IF EXISTS ""ChildPrice"";
                        ALTER TABLE ""TourClassifications"" DROP COLUMN IF EXISTS ""InfantPrice"";
                        ALTER TABLE ""TourClassifications"" DROP COLUMN ""AdultPrice"";
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourClassifications' AND column_name = 'AdultPrice') THEN
                        ALTER TABLE ""TourClassifications"" ADD COLUMN ""AdultPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                        ALTER TABLE ""TourClassifications"" ADD COLUMN ""ChildPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                        ALTER TABLE ""TourClassifications"" ADD COLUMN ""InfantPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                        UPDATE ""TourClassifications"" SET ""AdultPrice"" = ""BasePrice"" WHERE ""BasePrice"" IS NOT NULL;
                        ALTER TABLE ""TourClassifications"" DROP COLUMN ""BasePrice"";
                    END IF;
                END $$;
            ");
        }
    }
}
