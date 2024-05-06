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

// Should I not return anything?
const specificStoreOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.specificStoreOrder(storeId, orderId);
  res.send(order);
};

// Should I not return anything?
const placeSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  // TODO: userId should come from some user auth service, not payload.
  const userId = +req.body.userId;
  const payload = req.body;

  const order = await orderService.placeSalesOrder(storeId, userId, payload);
  res.send(order);
};

const fulfillSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.fulfillSalesOrder(storeId, orderId);
  res.send(order);
};

export default {
  allStoreOrders,
  specificStoreOrder,
  placeSalesOrder,
  fulfillSalesOrder,
};
