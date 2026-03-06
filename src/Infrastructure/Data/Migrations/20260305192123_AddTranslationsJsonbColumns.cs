using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationsJsonbColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "Tours",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourPlanRoutes",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourPlanLocations",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourPlanAccommodations",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourDays",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourDayActivities",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourClassifications",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");

            // Data migration: copy existing translatable fields into Translations["vi"]
            migrationBuilder.Sql("""
                UPDATE "Tours"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'TourName', "TourName",
                        'ShortDescription', "ShortDescription",
                        'LongDescription', "LongDescription",
                        'SEOTitle', "SEOTitle",
                        'SEODescription', "SEODescription"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourClassifications"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'Name', "Name",
                        'Description', "Description"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourDays"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'Title', "Title",
                        'Description', "Description"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourDayActivities"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'Title', "Title",
                        'Description', "Description",
                        'Note', "Note"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourPlanLocations"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'LocationName', "LocationName",
                        'LocationDescription', "LocationDescription",
                        'Note', "Note"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourPlanAccommodations"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'AccommodationName', "AccommodationName",
                        'SpecialRequest', "SpecialRequest",
                        'Note', "Note"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE "TourPlanRoutes"
                SET "Translations" = jsonb_build_object(
                    'vi', jsonb_build_object(
                        'TransportationName', "TransportationName",
                        'TransportationNote', "TransportationNote",
                        'Note', "Note"
                    )
                )
                WHERE "Translations" = '{}'::jsonb OR "Translations" IS NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourClassifications");
        }
    }
}
