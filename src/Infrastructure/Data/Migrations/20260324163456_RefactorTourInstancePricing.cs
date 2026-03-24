using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactorTourInstancePricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
    -- Step 1: Add BasePrice as nullable
    ALTER TABLE ""TourInstances"" ADD COLUMN ""BasePrice"" numeric(18,2);

    -- Step 2: Copy from AdultPrice (if AdultPrice > 0)
    UPDATE ""TourInstances"" ti
    SET ""BasePrice"" = ti.""AdultPrice""
    WHERE ti.""AdultPrice"" IS NOT NULL AND ti.""AdultPrice"" > 0;

    -- Step 3: Fallback to Classification.BasePrice if AdultPrice is 0 or null
    UPDATE ""TourInstances"" ti
    SET ""BasePrice"" = COALESCE(tc.""BasePrice"", 0)
    FROM ""TourClassifications"" tc
    WHERE ti.""ClassificationId"" = tc.""Id""
      AND (ti.""BasePrice"" IS NULL OR ti.""BasePrice"" = 0);

    -- Step 4: Drop old columns (each as separate statement)
    ALTER TABLE ""TourInstances"" DROP COLUMN ""AdultPrice"";
    ALTER TABLE ""TourInstances"" DROP COLUMN ""ChildPrice"";
    ALTER TABLE ""TourInstances"" DROP COLUMN ""InfantPrice"";

    -- Step 5: Set NOT NULL only after data is guaranteed
    ALTER TABLE ""TourInstances"" ALTER COLUMN ""BasePrice"" SET NOT NULL;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
    ALTER TABLE ""TourInstances"" ADD COLUMN ""AdultPrice"" numeric(18,2) NOT NULL DEFAULT 0;
    ALTER TABLE ""TourInstances"" ADD COLUMN ""ChildPrice"" numeric(18,2) NOT NULL DEFAULT 0;
    ALTER TABLE ""TourInstances"" ADD COLUMN ""InfantPrice"" numeric(18,2) NOT NULL DEFAULT 0;
    UPDATE ""TourInstances"" SET ""AdultPrice"" = ""BasePrice"", ""ChildPrice"" = 0, ""InfantPrice"" = 0;
    ALTER TABLE ""TourInstances"" ALTER COLUMN ""AdultPrice"" DROP NOT NULL;
    ALTER TABLE ""TourInstances"" ALTER COLUMN ""ChildPrice"" DROP NOT NULL;
    ALTER TABLE ""TourInstances"" ALTER COLUMN ""InfantPrice"" DROP NOT NULL;
    ALTER TABLE ""TourInstances"" DROP COLUMN ""BasePrice"";
");
        }
    }
}
