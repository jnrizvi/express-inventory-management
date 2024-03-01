/*
  Warnings:

  - You are about to drop the column `order_status_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `order_type_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_sold` on the `order_product` table. All the data in the column will be lost.
  - The primary key for the `order_status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `order_status` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `order_status` table. All the data in the column will be lost.
  - The primary key for the `order_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `order_type` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `order_type` table. All the data in the column will be lost.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_method_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type_id` on the `transaction` table. All the data in the column will be lost.
  - The primary key for the `transaction_method` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `transaction_method` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `transaction_method` table. All the data in the column will be lost.
  - The primary key for the `transaction_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `transaction_type` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `transaction_type` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `order_status_key` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_type_key` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_ordered` to the `order_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `order_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `order_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `order_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `order_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_method_key` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_status_key` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type_key` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `transaction_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `transaction_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `transaction_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `transaction_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_key` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_order_status_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_order_type_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_transaction_method_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_transaction_type_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropIndex
DROP INDEX "order_status_name_key";

-- DropIndex
DROP INDEX "order_type_name_key";

-- DropIndex
DROP INDEX "role_name_key";

-- DropIndex
DROP INDEX "transaction_method_name_key";

-- DropIndex
DROP INDEX "transaction_type_name_key";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "order_status_id",
DROP COLUMN "order_type_id",
ADD COLUMN     "order_status_key" TEXT NOT NULL,
ADD COLUMN     "order_type_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_product" DROP COLUMN "quantity_sold",
ADD COLUMN     "quantity_ordered" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_status" DROP CONSTRAINT "order_status_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "order_status_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "order_type" DROP CONSTRAINT "order_type_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "order_type_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "role" DROP CONSTRAINT "role_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "role_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "transaction_method_id",
DROP COLUMN "transaction_type_id",
ADD COLUMN     "transaction_method_key" TEXT NOT NULL,
ADD COLUMN     "transaction_status_key" TEXT NOT NULL,
ADD COLUMN     "transaction_type_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction_method" DROP CONSTRAINT "transaction_method_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "transaction_method_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "transaction_type" DROP CONSTRAINT "transaction_type_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "transaction_type_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role_id",
ADD COLUMN     "role_key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transaction_status" (
    "key" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "transaction_status_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_key_fkey" FOREIGN KEY ("role_key") REFERENCES "role"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_order_type_key_fkey" FOREIGN KEY ("order_type_key") REFERENCES "order_type"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_order_status_key_fkey" FOREIGN KEY ("order_status_key") REFERENCES "order_status"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_type_key_fkey" FOREIGN KEY ("transaction_type_key") REFERENCES "transaction_type"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_status_key_fkey" FOREIGN KEY ("transaction_status_key") REFERENCES "transaction_status"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transaction_method_key_fkey" FOREIGN KEY ("transaction_method_key") REFERENCES "transaction_method"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
