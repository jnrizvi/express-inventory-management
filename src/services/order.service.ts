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
const placeStoreOrder = (payload: any): Promise<Order> => {
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
      orderProducts: {
        include: {
          product: {
            include: {
              storeProducts: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const insufficientQuantityProducts = [];
  const updatedStoreProducts = [];

  for (const orderProduct of order.orderProducts) {
    if (
      orderProduct.product.storeProducts[0].quantity_stocked <
      orderProduct.quantity_ordered
    ) {
      insufficientQuantityProducts.push(orderProduct.product);
    } else {
      updatedStoreProducts.push({
        id: orderProduct.product.storeProducts[0].id,
        product_id: orderProduct.product.id,
        store_id: orderProduct.product.storeProducts[0].store_id,
        quantity_stocked:
          orderProduct.product.storeProducts[0].quantity_stocked -
          orderProduct.quantity_ordered,
      });
    }
  }

  if (insufficientQuantityProducts.length) {
    return "Limited quantity available for product(s)...";
  } else {
    await Promise.all(
      updatedStoreProducts.map((storeProduct) => {
        return prisma.storeProduct.update({
          where: {
            id: storeProduct.id,
          },
          data: {
            quantity_stocked: storeProduct.quantity_stocked,
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
