import { Order } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const allStoreOrders = (
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
const specificStoreOrder = (
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
// TODO: Should not be able to place the order if products are not in stock
// TODO: Create transaction record. Transaction status should be PENDING.
const placeStoreOrder = (payload: any): Promise<Order> => {
  return prisma.order.create({
    data: {
      ...payload.order,
      orderLines: {
        createMany: {
          data: payload.orderLines,
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

// TODO: Set transaction status to PAID
const fulfillStoreOrder = async (
  storeId: number,
  orderId: number
): Promise<Order | string> => {
  // I don't know if Prisma will inner join, that's why I'm doing it like this...
  // I would rather not index by 0 in the code below.
  const order = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
      store_id: storeId,
    },
    include: {
      orderLines: {
        include: {
          product: {
            include: {
              inventory: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const insufficientQuantityProducts = [];
  const updatedInventory = [];

  for (const orderLine of order.orderLines) {
    if (
      orderLine.product.inventory[0].quantity_stocked <
      orderLine.quantity_ordered
    ) {
      insufficientQuantityProducts.push(orderLine.product);
    } else {
      updatedInventory.push({
        id: orderLine.product.inventory[0].id,
        product_id: orderLine.product.id,
        store_id: orderLine.product.inventory[0].store_id,
        quantity_stocked:
          orderLine.product.inventory[0].quantity_stocked -
          orderLine.quantity_ordered,
      });
    }
  }

  if (insufficientQuantityProducts.length) {
    return "Limited quantity available for product(s)...";
  } else {
    await Promise.all(
      updatedInventory.map((inventoryItem) => {
        return prisma.inventory.update({
          where: {
            id: inventoryItem.id,
          },
          data: {
            quantity_stocked: inventoryItem.quantity_stocked,
          },
        });
      })
    );

    return prisma.order.update({
      where: {
        id: orderId,
        store_id: storeId,
        order_status_key: "OPEN",
      },
      data: {
        order_status_key: "ARCHIVED",
      },
    });
  }
};

export default {
  allStoreOrders,
  specificStoreOrder,
  placeStoreOrder,
  fulfillStoreOrder,
};
