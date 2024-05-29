import { Request, Response } from "express";
import { orderService } from "../services";

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

const specificOrder =
  (orderType: string) => async (req: Request, res: Response) => {
    const storeId = +req.params.storeId;
    const orderId = +req.params.orderId;

    const order = await orderService.specificOrder(storeId, orderId, orderType);

    res.send(order);
  };

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

const receiveOrder =
  (orderType: string) => async (req: Request, res: Response) => {
    const storeId = +req.params.storeId;
    const orderId = +req.params.orderId;
    const payload = req.body;

    const order = await orderService.receiveOrder(
      storeId,
      orderId,
      payload,
      orderType
    );

    res.send(order);
  };

const fulfillSalesOrder = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const orderId = +req.params.orderId;

  const order = await orderService.fulfillOrder(storeId, orderId);
  res.send(order);
};

export default {
  allOrders,
  specificOrder,
  placeOrder,
  fulfillSalesOrder,
  receiveOrder,
};
