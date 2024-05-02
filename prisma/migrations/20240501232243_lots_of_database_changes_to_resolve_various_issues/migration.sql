/*
  Warnings:

  - You are about to drop the column `date` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `role_key` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `order_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_type_key` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_role_key` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_product" DROP CONSTRAINT "order_product_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_product" DROP CONSTRAINT "order_product_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_user" DROP CONSTRAINT "product_user_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_user" DROP CONSTRAINT "product_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "store_product" DROP CONSTRAINT "store_product_product_id_fkey";

-- DropForeignKey
ALTER TABLE "store_product" DROP CONSTRAINT "store_product_store_id_fkey";

-- DropForeignKey
ALTER TABLE "store_user" DROP CONSTRAINT "store_user_store_id_fkey";

-- DropForeignKey
ALTER TABLE "store_user" DROP CONSTRAINT "store_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_key_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "date",
DROP COLUMN "total",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "store_type_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role_key",
ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_role_key" TEXT NOT NULL;

-- DropTable
DROP TABLE "order_product";

-- DropTable
DROP TABLE "product_user";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "store_product";

-- DropTable
DROP TABLE "store_user";

-- CreateTable
CREATE TABLE "user_role" (
    "key" TEXT NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "order_line" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "quantity_ordered" INTEGER NOT NULL,

    CONSTRAINT "order_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "quantity_stocked" INTEGER NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_type" (
    "key" TEXT NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "store_type_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "unit_number" INTEGER NOT NULL,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "postal_code" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "date_expected" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_email_key" ON "store"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_role_key_fkey" FOREIGN KEY ("user_role_key") REFERENCES "user_role"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_store_type_key_fkey" FOREIGN KEY ("store_type_key") REFERENCES "store_type"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
