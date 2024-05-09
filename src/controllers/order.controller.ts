import { Request, Response } from "express";
import { orderService } from "../services";

// Should I not return anything?
const allSalesOrders = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderStatus = req.query.orderStatus as string;

  const orders = await orderService.allSalesOrders(storeId, orderStatus);
  res.send(orders);
};

// Should I not return anything?
const specificSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.specificSalesOrder(storeId, orderId);
  res.send(order);
};

// Should I not return anything?
// TODO: userId should come from some user auth service, not request body.
const placeSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const userId = +req.body.userId;
  const payload = req.body;

  const order = await orderService.placeSalesOrder(storeId, userId, payload);
  res.send(order);
};

const processSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.processSalesOrder(storeId, orderId);
  res.send(order);
};

export default {
  allSalesOrders,
  specificSalesOrder,
  placeSalesOrder,
  processSalesOrder,
};
