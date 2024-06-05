import express from "express";
import { orderController } from "../../controllers";
import {
  CUSTOMER,
  STAFF,
  SHOP,
  VENDOR,
  SALES_ORDER,
  PURCHASE_ORDER,
  TRANSFER_ORDER,
} from "../../util/constants";
import validateTypes from "../../middleware/params";

const router = express.Router();

// Sales Orders
router
  .route("/shops/:storeId/sales-orders")
  .get(validateTypes(SHOP), orderController.allOrders(SALES_ORDER))
  .post(validateTypes(SHOP, CUSTOMER), orderController.placeOrder(SALES_ORDER));

router
  .route("/shops/:storeId/sales-orders/:orderId")
  .get(validateTypes(SHOP, SALES_ORDER), orderController.specificOrder)
  .put(validateTypes(SHOP, SALES_ORDER), orderController.fulfillSalesOrder)
  .delete((_, res) => res.send("Not implemented"));

router
  .route("/shops/:storeId/sales-orders/:orderId/transactions")
  .get(validateTypes(SHOP, SALES_ORDER), orderController.allOrderTransactions)
  .post(validateTypes(SHOP, SALES_ORDER), orderController.createTransaction);

router
  .route("/shops/:storeId/sales-orders/:orderId/transactions/:transactionId")
  .get(validateTypes(SHOP, SALES_ORDER), orderController.specificTransaction)
  .put(validateTypes(SHOP, SALES_ORDER), orderController.updateTransaction)
  .delete(validateTypes(SHOP, SALES_ORDER), orderController.deleteTransaction);

// Purchase Orders
router
  .route("/vendors/:storeId/purchase-orders")
  .get(validateTypes(VENDOR), orderController.allOrders(PURCHASE_ORDER))
  .post(
    validateTypes(VENDOR, STAFF),
    orderController.placeOrder(PURCHASE_ORDER)
  );

router
  .route("/vendors/:storeId/purchase-orders/:orderId")
  .get(validateTypes(VENDOR, PURCHASE_ORDER), orderController.specificOrder)
  .put(
    validateTypes(VENDOR, PURCHASE_ORDER),
    orderController.receiveOrder(PURCHASE_ORDER)
  )
  .delete((_, res) => res.send("Not implemented"));

router
  .route("/vendors/:storeId/purchase-orders/:orderId/transactions")
  .get(
    validateTypes(VENDOR, PURCHASE_ORDER),
    orderController.allOrderTransactions
  )
  .post(
    validateTypes(VENDOR, PURCHASE_ORDER),
    orderController.createTransaction
  );

router
  .route(
    "/vendors/:storeId/purchase-orders/:orderId/transactions/:transactionId"
  )
  .get(
    validateTypes(VENDOR, PURCHASE_ORDER),
    orderController.specificTransaction
  )
  .put(validateTypes(VENDOR, PURCHASE_ORDER), orderController.updateTransaction)
  .delete(
    validateTypes(VENDOR, PURCHASE_ORDER),
    orderController.deleteTransaction
  );

// Transfer Orders
router
  .route("/shops/:storeId/transfer-orders")
  .get(validateTypes(SHOP), orderController.allOrders(TRANSFER_ORDER))
  .post(validateTypes(SHOP, STAFF), orderController.placeOrder(TRANSFER_ORDER));

router
  .route("/shops/:storeId/transfer-orders/:orderId")
  .get(validateTypes(SHOP, TRANSFER_ORDER), orderController.specificOrder)
  .put(
    validateTypes(SHOP, TRANSFER_ORDER),
    orderController.receiveOrder(TRANSFER_ORDER)
  )
  .delete((_, res) => res.send("Not implemented"));

export default router;
