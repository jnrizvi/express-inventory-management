-- AlterTable
ALTER TABLE "order_status" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_type" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "role" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transaction_method" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transaction_status" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transaction_type" ALTER COLUMN "description" DROP NOT NULL;
