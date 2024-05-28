import { Request, Response } from "express";
import { orderService } from "../services";
import { PURCHASE_ORDER, SALES_ORDER, TRANSFER_ORDER } from "../util/constants";

// Curried
const allOrders =
  (orderType: string) => async (req: Request, res: Response) => {
    const storeId = +req.params.storeId;
    const orderStatus = req.query.orderStatus as string;

    const orders = await orderService.allOrders(
      storeId,
      orderType,
      orderStatus
    );

    res.send(orders);
  };

// Curried
const specificOrder =
  (orderType: string) => async (req: Request, res: Response) => {
    const storeId = +req.params.storeId;
    const orderId = +req.params.orderId;

    const order = await orderService.specificOrder(storeId, orderId, orderType);

    res.send(order);
  };

// Curried
const placeOrder =
  (orderType: string) => async (req: Request, res: Response) => {
    const payload = req.body;

    const order = await orderService.placeOrder(
      payload.user.id,
      payload.store.id,
      payload,
      orderType
    );

    res.status(200).send(order);
  };

// Curried
const receiveOrder =
  (orderType: string) => async (req: Request, res: Response) => {
    const storeId = +req.params.storeId;
    const orderId = +req.params.orderId;

    const order = await orderService.receiveOrder(storeId, orderId, orderType);

    res.send(order);
  };

const fulfillSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.fulfillOrder(storeId, orderId);
  res.send(order);
};

export default {
  fulfillSalesOrder,
  // TODO: Rather than repeating controller code just to specify the ordertype, add some
  // middleware to validate if the user has permission to place a certain type of order
  // and the store type matches what the provided ID points to.
  // Currying controller functions to avoid repitition
  allOrders,
  specificOrder,
  placeOrder,
  receiveOrder,
};
