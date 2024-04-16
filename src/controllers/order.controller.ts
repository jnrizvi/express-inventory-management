import { Request, Response } from "express";
import { orderService } from "../services";

// Should I not return anything?
const allStoreOrders = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderType = req.query.orderType as string;
  const orderStatus = req.query.orderStatus as string;

  const orders = await orderService.allStoreOrders(
    storeId,
    orderType,
    orderStatus
  );
  res.send(orders);
};

const specificStoreOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.specificStoreOrder(storeId, orderId);
  res.send(order);
};

export default {
  allStoreOrders,
  specificStoreOrder,
};
