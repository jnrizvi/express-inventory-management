import { Product } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const allShopProducts = (storeId: number): Promise<Product[]> => {
  return prisma.product.findMany({
    where: {
      inventory: {
        every: {
          store_id: storeId,
        },
      },
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const specificShopProduct = (
  storeId: number,
  productId: number
): Promise<Product> => {
  return prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      inventory: {
        every: {
          store_id: storeId,
          product_id: productId,
        },
      },
    },
  });
};

export default {
  allShopProducts,
  specificShopProduct,
};
