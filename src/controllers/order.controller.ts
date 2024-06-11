import { Request, Response } from "express";
import { orderService } from "../services";

const allOrders =
  (orderType: string) => async (req: Request, res: Response) => {
    const orderStatus = req.query.orderStatus as string;

    const orders = await orderService.allOrders(
      req.body.store,
      orderType,
      orderStatus
    );

    res.send(orders);
  };

const specificOrder = async (req: Request, res: Response) => {
  const orderId = +req.params.orderId;

  const order = await orderService.specificOrder(orderId);

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

const deleteOrder = async (req: Request, res: Response) => {
  const orderId = +req.params.orderId;

  const order = await orderService.deleteOrder(orderId);

  res.send(order);
};

const allOrderTransactions = async (req: Request, res: Response) => {
  const orderId = +req.params.orderId;

  const transactions = await orderService.allOrderTransactions(orderId);

  res.send(transactions);
};

const specificTransaction = async (req: Request, res: Response) => {
  const transactionId = +req.params.transactionId;

  const transaction = await orderService.specificTransaction(transactionId);

  res.send(transaction);
};

const createTransaction = async (req: Request, res: Response) => {
  const orderId = +req.params.orderId;
  const payload = req.body;

  const transaction = await orderService.createTransaction(orderId, payload);

  res.send(transaction);
};

const updateTransaction = async (req: Request, res: Response) => {
  const transactionId = +req.params.transactionId;
  const payload = req.body;

  const transaction = await orderService.updateTransaction(
    transactionId,
    payload
  );

  res.send(transaction);
};

const deleteTransaction = async (req: Request, res: Response) => {
  const transactionId = +req.params.transactionId;

  const transaction = await orderService.deleteTransaction(transactionId);

  res.send(transaction);
};

export default {
  allOrders,
  specificOrder,
  placeOrder,
  fulfillSalesOrder,
  receiveOrder,
  deleteOrder,
  allOrderTransactions,
  specificTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
