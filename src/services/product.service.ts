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
      ...(payload.name && { name: payload.name }),
      ...(payload.price && { price: payload.price }),
      ...(payload.description && { description: payload.description }),
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const allInventory = (storeId: number): Promise<Inventory[]> => {
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
const specificInventory = (
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

const createInventory = (storeId: number, payload: any) => {
  return prisma.inventory.create({
    data: {
      store_id: storeId,
      product_id: payload.productId,
      quantity_stocked: payload.quantityStocked,
      quantity_reserved: payload.quantityReserved,
    },
  });
};

const updateInventory = (storeId: number, productId: number, payload: any) => {
  return prisma.inventory.update({
    where: {
      id: {
        store_id: storeId,
        product_id: productId,
      },
    },
    data: {
      ...(payload.quantityStocked && {
        quantity_stocked: payload.quantityStocked,
      }),
    },
  });
};

const deleteInventory = (storeId: number, productId: number) => {
  return prisma.inventory.delete({
    where: {
      id: {
        store_id: storeId,
        product_id: productId,
      },
    },
  });
};

export default {
  allProducts,
  specificProduct,
  createProduct,
  updateProduct,
  allInventory,
  specificInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
