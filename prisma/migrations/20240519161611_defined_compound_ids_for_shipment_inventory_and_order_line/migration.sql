/*
  Warnings:

  - The primary key for the `inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `inventory` table. All the data in the column will be lost.
  - The primary key for the `order_line` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `order_line` table. All the data in the column will be lost.
  - The primary key for the `shipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "inventory_pkey" PRIMARY KEY ("product_id", "store_id");

-- AlterTable
ALTER TABLE "order_line" DROP CONSTRAINT "order_line_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "order_line_pkey" PRIMARY KEY ("order_id", "product_id");

-- AlterTable
ALTER TABLE "shipment" DROP CONSTRAINT "shipment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "shipment_pkey" PRIMARY KEY ("order_id", "address_id");
