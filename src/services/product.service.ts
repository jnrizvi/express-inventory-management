import { Inventory, Product } from "@prisma/client";
import prisma from "../client";

const allProducts = (): Promise<Product[]> => {
  return prisma.product.findMany();
};

const specificProduct = (productId: number): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
};

const createProduct = (payload: any): Promise<Product> => {
  return prisma.product.create({
    data: {
      name: payload.name,
      price: payload.price,
      description: payload.description,
    },
  });
};

const updateProduct = (productId: number, payload: any): Promise<Product> => {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: payload.name,
      price: payload.price,
      description: payload.description,
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const allStoreProducts = (storeId: number): Promise<Inventory[]> => {
  return prisma.inventory.findMany({
    where: {
      store_id: storeId,
    },
    include: {
      product: true,
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const specificStoreProduct = (
  storeId: number,
  productId: number
): Promise<Inventory | null> => {
  return prisma.inventory.findUnique({
    where: {
      id: {
        store_id: storeId,
        product_id: productId,
      },
    },
    include: {
      product: true,
    },
  });
};

const addProductToStore = (storeId: number, payload: any) => {
  return prisma.inventory.create({
    data: {
      store_id: storeId,
      product_id: payload.productId,
      quantity_stocked: payload.quantityStocked,
      quantity_reserved: payload.quantityReserved,
    },
  });
};

const updateProductInventory = (
  storeId: number,
  productId: number,
  payload: any
) => {
  return prisma.inventory.update({
    where: {
      id: {
        store_id: storeId,
        product_id: productId,
      },
    },
    data: {
      quantity_stocked: payload.quantityStocked,
    },
  });
};

export default {
  allProducts,
  specificProduct,
  createProduct,
  updateProduct,
  allStoreProducts,
  specificStoreProduct,
  addProductToStore,
  updateProductInventory,
};
