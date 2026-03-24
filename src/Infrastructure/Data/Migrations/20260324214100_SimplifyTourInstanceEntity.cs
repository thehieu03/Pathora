using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations;

public partial class SimplifyTourInstanceEntity : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            DO $$
            BEGIN
                -- Drop FKs if they exist
                IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_TourInstances_DepositPolicies_DepositPolicyId' AND table_name = 'TourInstances') THEN
                    ALTER TABLE ""TourInstances"" DROP CONSTRAINT ""FK_TourInstances_DepositPolicies_DepositPolicyId"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FK_TourInstances_VisaPolicies_VisaPolicyId' AND table_name = 'TourInstances') THEN
                    ALTER TABLE ""TourInstances"" DROP CONSTRAINT ""FK_TourInstances_VisaPolicies_VisaPolicyId"";
                END IF;

                -- Drop indexes if they exist
                IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_TourInstances_DepositPolicyId' AND tablename = 'TourInstances') THEN
                    DROP INDEX ""IX_TourInstances_DepositPolicyId"";
                END IF;

                IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_TourInstances_VisaPolicyId' AND tablename = 'TourInstances') THEN
                    DROP INDEX ""IX_TourInstances_VisaPolicyId"";
                END IF;

                -- Drop columns if they exist
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'AdultPrice') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""AdultPrice"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'ChildPrice') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""ChildPrice"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'InfantPrice') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""InfantPrice"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'DepositPerPerson') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""DepositPerPerson"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'DepositPolicyId') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""DepositPolicyId"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'Guide') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""Guide"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'MinParticipation') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""MinParticipation"";
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'VisaPolicyId') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""VisaPolicyId"";
                END IF;

                -- Ensure BasePrice column exists with correct type
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'BasePrice') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""BasePrice"" numeric(18,2) NOT NULL DEFAULT 0;
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
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'AdultPrice') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""AdultPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'ChildPrice') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""ChildPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'InfantPrice') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""InfantPrice"" numeric(18,2) NOT NULL DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'DepositPerPerson') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""DepositPerPerson"" numeric NOT NULL DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'DepositPolicyId') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""DepositPolicyId"" uuid;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'Guide') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""Guide"" jsonb;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'MinParticipation') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""MinParticipation"" integer NOT NULL DEFAULT 0;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'VisaPolicyId') THEN
                    ALTER TABLE ""TourInstances"" ADD COLUMN ""VisaPolicyId"" uuid;
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'TourInstances' AND column_name = 'BasePrice') THEN
                    ALTER TABLE ""TourInstances"" DROP COLUMN ""BasePrice"";
                END IF;

                -- Recreate indexes
                IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_TourInstances_DepositPolicyId' AND tablename = 'TourInstances') THEN
                    CREATE INDEX ""IX_TourInstances_DepositPolicyId"" ON ""TourInstances"" (""DepositPolicyId"");
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IX_TourInstances_VisaPolicyId' AND tablename = 'TourInstances') THEN
                    CREATE INDEX ""IX_TourInstances_VisaPolicyId"" ON ""TourInstances"" (""VisaPolicyId"");
                END IF;

                -- Recreate FKs (no-op since referenced tables may not exist)
            END $$;
        ");
    }
}
