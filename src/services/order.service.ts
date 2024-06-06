import { Order, OrderLine, Prisma } from "@prisma/client";
import prisma from "../client";

// TODO: Use a data transfer object instead of the prisma type
const allOrders = (
  storeId: number,
  orderType: string,
  orderStatus: string | null
): Promise<Order[]> => {
  return prisma.order.findMany({
    where: {
      store_id: storeId,
      order_type_key: orderType,
      ...(orderStatus && { order_status_key: orderStatus }),
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type
const specificOrder = (orderId: number): Promise<Order> => {
  return prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
  });
};

// We already have separate routes, and can define separate payload validators for each.
// TODO: Use a data transfer object instead of the prisma type. Also type.
const placeOrder = async (
  userId: number,
  storeId: number,
  payload: any,
  orderType: string
) => {
  const result = await matchInventoryWithOrderLines(
    storeId,
    payload.orderLines
  );

  if (typeof result === "string") {
    return {
      message: result,
      order: null,
    };
  } else {
    const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
    const createOrderLinesData: Prisma.OrderLineCreateManyOrderInput[] = [];
    const insufficientInventory = [];
    let total = 0;

    for (const item of result) {
      if (item.quantityStocked >= item.quantityOrdered) {
        createOrderLinesData.push({
          quantity_ordered: item.quantityOrdered,
          unit_price: item.unitPrice,
          product_id: item.productId,
        });

        updateInventoryArgs.push({
          where: {
            id: {
              product_id: item.productId,
              store_id: item.storeId,
            },
          },
          data: {
            quantity_stocked: item.quantityStocked - item.quantityOrdered,
            quantity_reserved: item.quantityReserved + item.quantityOrdered,
          },
        });

        total += item.unitPrice * item.quantityOrdered;
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
          (item) =>
            `${item.productName} (Only ${item.quantityStocked} in stock)`
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
          user_id: userId,
          store_id: storeId,
          order_status_key: "OPEN",
          order_type_key: orderType,
          orderLines: {
            createMany: {
              data: createOrderLinesData,
            },
          },
          ...(payload.transactionMethod && {
            transactions: {
              create: {
                transaction_status_key: "PENDING",
                transaction_type_key: "SALE",
                transaction_method_key: payload.transactionMethod,
                amount: total,
              },
            },
          }),
          ...(payload.shippingAddress && {
            shipments: {
              create: {
                address: {
                  connectOrCreate: {
                    where: {
                      ...payload.shippingAddress,
                    },
                    create: {
                      ...payload.shippingAddress,
                    },
                  },
                },
              },
            },
          }),
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

      return { message: "Order was successfully placed.", order: order };
    });
  }
};

// TODO: Types
const fulfillOrder = async (storeId: number, orderId: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderLines: true,
    },
  });

  if (order && order.order_status_key === "OPEN") {
    const result = await matchInventoryWithOrderLines(
      storeId,
      order.orderLines
    );

    if (typeof result === "string") {
      return {
        message: "Order could not be fulfilled.",
        order: order,
      };
    } else {
      const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
      const insufficientInventory = [];

      for (const item of result) {
        if (item.quantityReserved >= item.quantityOrdered) {
          updateInventoryArgs.push({
            where: {
              id: {
                product_id: item.productId,
                store_id: item.storeId,
              },
            },
            data: {
              quantity_reserved: item.quantityReserved - item.quantityOrdered,
            },
          });
        } else {
          insufficientInventory.push(item);
        }
      }

      if (insufficientInventory.length) {
        return {
          message: `Insufficient reserves for ${
            insufficientInventory.length
          } product(s):
        ${insufficientInventory.map(
          (item) => `${item.productName} (${item.quantityReserved} reserved)`
        )}
        `,
          order: null,
        };
      }

      return prisma.$transaction(async (trx) => {
        await Promise.all(
          updateInventoryArgs.map((args) => trx.inventory.update(args))
        );

        const order = await trx.order.update({
          where: {
            id: orderId,
          },
          data: {
            order_status_key: "ARCHIVED",
          },
        });

        return {
          message: "Order was successfully fulfilled.",
          order: order,
        };
      });
    }
  } else {
    return {
      message: "The specified order does not exist or cannot be fulfilled.",
      order: order,
    };
  }
};

const receiveOrder = async (
  storeId: number,
  orderId: number,
  payload: any,
  orderType: string
) => {
  // This storeId parameter indicates the receiving store which the shipment is bound for
  const shipmentToReceivingStore = await prisma.shipment.findUnique({
    where: {
      id: {
        order_id: orderId,
        address_id: payload.store.address_id,
      },
      order: {
        order_type_key: orderType,
      },
    },
    include: {
      order: {
        include: {
          orderLines: true,
          store: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  });

  // Can only receive an order if it has a shipment.
  if (shipmentToReceivingStore) {
    const shippingInventory = await matchInventoryWithOrderLines(
      shipmentToReceivingStore.order.store_id,
      shipmentToReceivingStore.order.orderLines
    );

    const receivingInventory = await matchInventoryWithOrderLines(
      storeId,
      shipmentToReceivingStore.order.orderLines
    );

    if (
      typeof shippingInventory === "string" ||
      typeof receivingInventory === "string"
    ) {
      return {
        message: "Order could not be received.",
        order: shipmentToReceivingStore.order,
      };
    } else {
      const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
      const insufficientInventory = [];

      for (const item of shippingInventory) {
        if (item.quantityReserved >= item.quantityOrdered) {
          updateInventoryArgs.push({
            where: {
              id: {
                product_id: item.productId,
                store_id: item.storeId,
              },
            },
            data: {
              quantity_reserved: item.quantityReserved - item.quantityOrdered,
            },
          });
        } else {
          insufficientInventory.push(item);
        }
      }

      for (const item of receivingInventory) {
        updateInventoryArgs.push({
          where: {
            id: {
              product_id: item.productId,
              store_id: item.storeId,
            },
          },
          data: {
            quantity_stocked: item.quantityStocked + item.quantityOrdered,
          },
        });
      }

      if (insufficientInventory.length) {
        return {
          message: `Insufficient reserves for ${
            insufficientInventory.length
          } product(s):
        ${insufficientInventory.map(
          (item) => `${item.productName} (${item.quantityReserved} reserved)`
        )}
        `,
          order: null,
        };
      }

      return prisma.$transaction(async (trx) => {
        await Promise.all(
          updateInventoryArgs.map((args) => trx.inventory.update(args))
        );

        const order = await trx.order.update({
          where: {
            id: orderId,
          },
          data: {
            order_status_key: "ARCHIVED",
          },
        });

        return {
          message: "Order was successfully received.",
          order: order,
        };
      });
    }
  } else {
    return "Order does not have a shipment to the receiving store.";
  }
};

const deleteOrder = (orderId: number) => {
  return prisma.transaction.delete({
    where: {
      id: orderId,
    },
  });
};

const allOrderTransactions = (orderId: number) => {
  return prisma.transaction.findMany({
    where: {
      order_id: orderId,
    },
  });
};

const specificTransaction = (transactionId: number) => {
  return prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });
};

const createTransaction = (orderId: number, payload: any) => {
  return prisma.transaction.create({
    data: {
      order_id: orderId,
      transaction_status_key: payload.transactionStatusKey,
      transaction_type_key: payload.transactionTypeKey,
      transaction_method_key: payload.transactionMethodKey,
      amount: payload.amount,
    },
  });
};

const updateTransaction = (transactionId: number, payload: any) => {
  return prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      transaction_status_key: payload.transactionStatusKey,
      transaction_method_key: payload.transactionMethodKey,
      amount: payload.amount,
    },
  });
};

const deleteTransaction = (transactionId: number) => {
  return prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
};

// TODO: Figure out how to do the error handling properly
const matchInventoryWithOrderLines = async (
  storeId: number,
  orderLines: OrderLine[]
) => {
  const productQuantityHashMap = new Map<number, number>();
  for (const orderLine of orderLines) {
    productQuantityHashMap.set(
      orderLine.product_id,
      orderLine.quantity_ordered
    );
  }

  const matchingInventory = await prisma.inventory.findMany({
    where: {
      store_id: storeId,
      product_id: {
        in: orderLines.map((orderLine) => orderLine.product_id),
      },
    },
    include: {
      product: true,
    },
  });

  // TODO: Rename this
  const inventoryOrdered = [];
  const unavailableInventory = [];

  for (const item of matchingInventory) {
    const quantityOrdered: number | undefined = productQuantityHashMap.get(
      item.product_id
    );

    if (quantityOrdered) {
      inventoryOrdered.push({
        storeId: storeId,
        productId: item.product_id,
        quantityStocked: item.quantity_stocked,
        quantityReserved: item.quantity_reserved,
        quantityOrdered: quantityOrdered,
        unitPrice: item.product.price,
        productName: item.product.name,
      });
    } else {
      unavailableInventory.push(item);
    }
  }

  if (unavailableInventory.length) {
    return `${
      unavailableInventory.length
    } unavailable product(s): ${unavailableInventory.map(
      (item) => `${item.product.name}`
    )}`;
  }

  return inventoryOrdered;
};

export default {
  allOrders,
  specificOrder,
  placeOrder,
  fulfillOrder,
  receiveOrder,
  deleteOrder,
  allOrderTransactions,
  specificTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
