import { Order, Prisma } from "@prisma/client";
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
  const productQuantityHashMap = new Map<number, number>();
  for (const product of payload.products) {
    productQuantityHashMap.set(product.id, product.quantityOrdered);
  }

  const matchingInventory = await prisma.inventory.findMany({
    where: {
      store_id: storeId,
      product_id: { in: payload.products.map((product: any) => product.id) },
    },
    include: {
      product: true,
    },
  });

  if (matchingInventory.length === payload.products.length) {
    const createOrderLinesData: Prisma.OrderLineCreateManyOrderInput[] = [];
    const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
    const insufficientInventory = [];
    let total: number = 0;

    for (const item of matchingInventory) {
      const quantityOrdered: number | undefined = productQuantityHashMap.get(
        item.product_id
      );

      if (quantityOrdered && item.quantity_stocked >= quantityOrdered) {
        createOrderLinesData.push({
          quantity_ordered: quantityOrdered,
          unit_price: item.product.price,
          product_id: item.product_id,
        });

        updateInventoryArgs.push({
          where: { id: item.id },
          data: {
            quantity_reserved: item.quantity_reserved + quantityOrdered,
            quantity_stocked: item.quantity_stocked - quantityOrdered,
          },
        });

        total += item.product.price * quantityOrdered;
      } else {
        insufficientInventory.push(item);
      }
    }

    if (insufficientInventory.length) {
      return {
        message: `Insufficient stock for ${
          insufficientInventory.length
        } product(s):
        ${insufficientInventory.map(
          (item) => `${item.product.name} (${item.quantity_stocked} in stock)`
        )}
        `,
        order: null,
      };
    }

    return prisma.$transaction(async (trx) => {
      await Promise.all(
        updateInventoryArgs.map((args) => trx.inventory.update(args))
      );

      const order = await trx.order.create({
        data: {
          user_id: payload.userId,
          store_id: storeId,
          order_status_key: "OPEN",
          order_type_key: "SALES_ORDER",
          orderLines: {
            createMany: {
              data: createOrderLinesData,
            },
          },
          transactions: {
            create: {
              transaction_status_key: "PENDING",
              transaction_type_key: "SALE",
              transaction_method_key: "CASH_ON_DELIVERY",
              amount: total,
            },
          },
        },
        include: {
          transactions: true,
          orderLines: {
            include: {
              product: true,
            },
          },
          store: {
            include: {
              address: true,
            },
          },
          user: true,
        },
      });

      return { message: "Sales order was successfully placed.", order: order };
    });
  } else {
    return {
      message:
        "Request includes product(s) that are currently unavailable at this store.",
      order: null,
    };
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
