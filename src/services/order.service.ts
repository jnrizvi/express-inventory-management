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
const placeSalesOrder = async (storeId: number, payload: any) => {
  const matchingInventory = await prisma.inventory.findFirst({
    where: {
      store_id: storeId,
      product_id: payload.productId,
    },
    include: {
      product: true,
    },
  });

  if (
    matchingInventory &&
    matchingInventory.quantity_stocked >= payload.quantity
  ) {
    await prisma.inventory.update({
      where: {
        id: matchingInventory.id,
      },
      data: {
        quantity_reserved:
          matchingInventory.quantity_reserved + payload.quantity,
        quantity_stocked: matchingInventory.quantity_stocked - payload.quantity,
      },
    });

    await prisma.order.create({
      data: {
        user_id: payload.userId,
        store_id: storeId,
        order_status_key: "OPEN",
        order_type_key: "SALES_ORDER",
        orderLines: {
          create: {
            quantity_ordered: payload.quantity,
            unit_price: matchingInventory.product.price,
            product: {
              connect: {
                id: payload.productId,
              },
            },
          },
        },
        transactions: {
          create: {
            transaction_status_key: "PENDING",
            transaction_type_key: "SALE",
            transaction_method_key: "CASH_ON_DELIVERY",
            amount: matchingInventory.product.price * payload.quantity,
          },
        },
      },
    });

    return { message: "Your order was successfully placed." };
  } else if (
    matchingInventory &&
    matchingInventory.quantity_stocked < payload.quantity
  ) {
    return {
      message: `Only ${matchingInventory.quantity_stocked} unit(s) are in stock for the product "${matchingInventory.product.name}".`,
    };
  } else {
    return { message: "The specified product is not available at this store." };
  }
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
  placeSalesOrder,
  fulfillStoreOrder,
};
