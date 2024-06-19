ALTER TABLE "address" RENAME COLUMN "address_line1" to "line_1";
ALTER TABLE "address" RENAME COLUMN "address_line2" to "line_2";
ALTER TABLE "address" RENAME COLUMN "city" to "locality";
ALTER TABLE "address" RENAME COLUMN "postal_code" to "zip_or_postal_code";
ALTER TABLE "address" DROP COLUMN IF EXISTS "unit_number";
ALTER TABLE "address" ADD COLUMN IF NOT EXISTS "line_3" VARCHAR(255);
ALTER TABLE "address" ADD COLUMN IF NOT EXISTS "region" VARCHAR(255) NOT NULL DEFAULT 'Unspecified';