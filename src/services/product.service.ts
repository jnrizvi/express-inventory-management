import { Product } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const getProductsByStoreId = async (storeId: number): Promise<Product[]> => {
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

export default {
  getProductsByStoreId,
};
