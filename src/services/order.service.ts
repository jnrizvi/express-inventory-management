import { Order, OrderLine, Prisma } from "@prisma/client";
import prisma from "../client";
import { SALES_ORDER } from "../util/constants";

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
const specificOrder = (
  storeId: number,
  orderId: number,
  orderType: string
): Promise<Order> => {
  return prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
      store_id: storeId,
      order_type_key: orderType,
    },
  });
};

// TODO: Use a data transfer object instead of the prisma type. Also type.
// TODO: Validate whether the user has permission to place the order
// TODO: Validate whether the store ID points to the right store
const placeOrder = async (
  storeId: number,
  userId: number,
  payload: any,
  orderType: string
) => {
  const result = await verifyQuantity(storeId, payload.order_lines);

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
            id: item.inventoryId,
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
          transactions: {
            create: {
              transaction_status_key: "PENDING",
              transaction_type_key: "SALE",
              transaction_method_key: payload.transactionMethod,
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

      return { message: "Order was successfully placed.", order: order };
    });
  }
};

// TODO: Types
const fulfillOrder = async (storeId: number, orderId: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      order_type_key: SALES_ORDER,
    },
    include: {
      orderLines: true,
    },
  });

  if (order && order.order_status_key === "OPEN") {
    const result = await verifyQuantity(storeId, order.orderLines);

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
            where: { id: item.inventoryId },
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

// This storeId parameter indicates the store which the shipment is bound for
// In general, the storeId parameter always indicates the store attended to by the user
const receiveOrder = async (storeId: number, orderId: number) => {
  // Verify storeId parameter by checking if
  // shipment.address_id = store.address_id where store.id = storeId
  const receivingStore = await prisma.store.findUniqueOrThrow({
    where: {
      id: storeId,
    },
    include: {
      inventory: true,
    },
  });

  // TODO: change this name
  const matchingShipments = await prisma.shipment.findMany({
    where: {
      order_id: orderId,
      address_id: receivingStore.address_id,
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
  if (matchingShipments.length === 1) {
    const result = await verifyQuantity(
      matchingShipments[0].order.store_id,
      matchingShipments[0].order.orderLines
    );

    const receivingStoreResult = await verifyQuantity(
      storeId,
      matchingShipments[0].order.orderLines
    );

    if (
      typeof result === "string" ||
      typeof receivingStoreResult === "string"
    ) {
      return {
        message: "Order could not be received.",
        order: matchingShipments[0].order,
      };
    } else {
      const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
      const insufficientInventory = [];

      for (const item of result) {
        if (item.quantityReserved >= item.quantityOrdered) {
          updateInventoryArgs.push({
            where: { id: item.inventoryId },
            data: {
              quantity_reserved: item.quantityReserved - item.quantityOrdered,
            },
          });
        } else {
          insufficientInventory.push(item);
        }
      }

      for (const item of receivingStoreResult) {
        updateInventoryArgs.push({
          where: { id: item.inventoryId },
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

        return {
          message: "Order was successfully received.",
          order: order,
        };
      });
    }
  } else {
    return "Order does not have a single, terminating shipment at the specified store.";
  }
};

// TODO: Rename function
// TODO: Figure out how to do the error handling properly
const verifyQuantity = async (storeId: number, orderLines: OrderLine[]) => {
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

  const arrayOfSomethingDto = [];
  const unavailableInventory = [];

  for (const item of matchingInventory) {
    const quantityOrdered: number | undefined = productQuantityHashMap.get(
      item.product_id
    );

    if (quantityOrdered) {
      arrayOfSomethingDto.push({
        storeId: storeId,
        productId: item.product_id,
        inventoryId: item.id,
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

  return arrayOfSomethingDto;
};

export default {
  allOrders,
  specificOrder,
  placeOrder,
  fulfillOrder,
};
