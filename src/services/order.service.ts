import { Order, Prisma } from "@prisma/client";
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
  } else {
    return {
      message:
        "Request includes product(s) that are currently unavailable at this store.",
      order: null,
    };
  }
};

// TODO: Types
const processOrder = async (
  storeId: number,
  orderId: number,
  orderType: string
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderLines: true,
    },
  });

  if (
    order?.order_status_key !== "OPEN" ||
    order?.order_type_key !== orderType
  ) {
    return {
      message: "The specified order does not exist or cannot be fulfilled.",
      order: order,
    };
  } else {
    const productQuantityHashMap = new Map<number, number>();
    for (const orderLine of order.orderLines) {
      productQuantityHashMap.set(
        orderLine.product_id,
        orderLine.quantity_ordered
      );
    }

    const matchingInventory = await prisma.inventory.findMany({
      where: {
        store_id: storeId,
        product_id: {
          in: order.orderLines.map((orderLine) => orderLine.product_id),
        },
      },
      include: {
        product: true,
      },
    });

    if (matchingInventory.length === order.orderLines.length) {
      const updateInventoryArgs: Prisma.InventoryUpdateArgs[] = [];
      const insufficientInventory = [];

      for (const item of matchingInventory) {
        const quantityOrdered: number | undefined = productQuantityHashMap.get(
          item.product_id
        );

        if (quantityOrdered && item.quantity_reserved >= quantityOrdered) {
          updateInventoryArgs.push({
            where: { id: item.id },
            data: {
              quantity_reserved: item.quantity_reserved - quantityOrdered,
            },
          });
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
    } else {
      return {
        message:
          "Order includes product(s) that are currently unavailable at this store.",
        order: null,
      };
    }
  }
};

export default {
  allOrders,
  specificOrder,
  placeOrder,
  processOrder,
};
