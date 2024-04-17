import { Order } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const allStoreOrders = async (
  storeId: number,
  orderType: string | null,
  orderStatus: string | null
): Promise<Order[]> => {
  return prisma.order.findMany({
    where: {
      store_id: storeId,
      ...(orderType && { order_type_key: orderType }),
      ...(orderStatus && { order_status_key: orderStatus }),
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const specificStoreOrder = async (
  storeId: number,
  orderId: number
): Promise<Order> => {
  return prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
      store_id: storeId,
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type. Also type.
const placeStoreOrder = async (payload: any): Promise<Order> => {
  return prisma.order.create({
    data: {
      ...payload.order,
      orderProducts: {
        createMany: {
          data: payload.orderProducts,
        },
      },
      transactions: {
        createMany: {
          data: payload.transactions,
        },
      },
    },
  });
};

export default {
  allStoreOrders,
  specificStoreOrder,
  placeStoreOrder,
};
