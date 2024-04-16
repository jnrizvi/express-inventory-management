import { Product } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const allStoreProducts = async (storeId: number): Promise<Product[]> => {
  return prisma.product.findMany({
    where: {
      storeProducts: {
        every: {
          store_id: storeId,
        },
      },
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const specificStoreProduct = async (
  storeId: number,
  productId: number
): Promise<Product> => {
  return prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      storeProducts: {
        every: {
          store_id: storeId,
          product_id: productId,
        },
      },
    },
  });
};

export default {
  allStoreProducts,
  specificStoreProduct,
};
