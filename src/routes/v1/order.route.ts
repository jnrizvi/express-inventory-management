import express from "express";
import { orderController } from "../../controllers";
import { PURCHASE_ORDER, SALES_ORDER, TRANSFER_ORDER } from "../../util/constants";

const router = express.Router();

// Sales Orders
router
  .route("/shops/:storeId/sales-orders")
  .get(orderController.allOrders(SALES_ORDER))
  .post(orderController.placeOrder(SALES_ORDER));

router
  .route("/shops/:storeId/sales-orders/:orderId")
  .get(orderController.specificOrder(SALES_ORDER))
  .put(orderController.fulfillSalesOrder)
  .delete((_, res) => res.send("Not implemented"));

// Purchase Orders
router
  .route("/vendors/:storeId/purchase-orders")
  .get(orderController.allOrders(PURCHASE_ORDER))
  .post(orderController.placeOrder(PURCHASE_ORDER));

router
  .route("/vendors/:storeId/purchase-orders/:orderId")
  .get(orderController.specificOrder(PURCHASE_ORDER))
  .put(orderController.receiveOrder(PURCHASE_ORDER))
  .delete((_, res) => res.send("Not implemented"));

// Transfer Orders
router
  .route("/shops/:storeId/transfer-orders")
  .get(orderController.allOrders(TRANSFER_ORDER))
  .post(orderController.placeOrder(TRANSFER_ORDER));

router
  .route("/shops/:storeId/transfer-orders/:orderId")
  .get(orderController.specificOrder(TRANSFER_ORDER))
  .put(orderController.receiveOrder(TRANSFER_ORDER))
  .delete((_, res) => res.send("Not implemented"));

export default router;
