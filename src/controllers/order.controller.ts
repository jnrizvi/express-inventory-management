import { Request, Response } from "express";
import { orderService } from "../services";
import { PURCHASE_ORDER, SALES_ORDER } from "../util/constants";

// Should I not return anything?
const allSalesOrders = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderStatus = req.query.orderStatus as string;

  const orders = await orderService.allOrders(
    storeId,
    SALES_ORDER,
    orderStatus
  );
  res.send(orders);
};

// Should I not return anything?
const specificSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.specificOrder(storeId, orderId, SALES_ORDER);
  res.send(order);
};

// Should I not return anything?
// TODO: userId should come from some user auth service, not request body.
const placeSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const userId = +req.body.userId;
  const payload = req.body;

  const order = await orderService.placeOrder(
    storeId,
    userId,
    payload,
    SALES_ORDER
  );
  res.send(order);
};

const processSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.fulfillOrder(storeId, orderId);
  res.send(order);
};

// Should I not return anything?
const allPurchaseOrders = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderStatus = req.query.orderStatus as string;

  const orders = await orderService.allOrders(
    storeId,
    PURCHASE_ORDER,
    orderStatus
  );
  res.send(orders);
};

// Should I not return anything?
const specificPurchaseOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.specificOrder(
    storeId,
    orderId,
    PURCHASE_ORDER
  );
  res.send(order);
};

// Should I not return anything?
// TODO: A shipment must be created when placing a purchase order or transfer order.
//       placeOrder function can't be used.
// TODO: userId should come from some user auth service, not request body.
const placePurchaseOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const userId = +req.body.userId;
  const payload = req.body;

  const order = await orderService.placeOrder(
    storeId,
    userId,
    payload,
    PURCHASE_ORDER
  );
  res.send(order);
};

export default {
  allSalesOrders,
  specificSalesOrder,
  placeSalesOrder,
  processSalesOrder,
  // TODO: Rather than repeating controller code just to specify the ordertype, add some
  // middleware to validate if the user has permission to place a certain type of order
  // and the store type matches what the provided ID points to.
  allPurchaseOrders,
  specificPurchaseOrder,
  placePurchaseOrder,
};
