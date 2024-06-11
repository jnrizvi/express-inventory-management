import express from "express";
import { orderController } from "../../controllers";
import {
  CUSTOMER,
  STAFF,
  SHOP,
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
  .delete(validateTypes(SHOP, SALES_ORDER), orderController.deleteOrder);

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
  .route("/shops/:storeId/purchase-orders")
  .get(validateTypes(SHOP), orderController.allOrders(PURCHASE_ORDER))
  .post(validateTypes(SHOP, STAFF), orderController.placeOrder(PURCHASE_ORDER));

router
  .route("/shops/:storeId/purchase-orders/:orderId")
  .get(validateTypes(SHOP, PURCHASE_ORDER), orderController.specificOrder)
  .put(
    validateTypes(SHOP, PURCHASE_ORDER),
    orderController.receiveOrder(PURCHASE_ORDER)
  )
  .delete(validateTypes(SHOP, PURCHASE_ORDER), orderController.deleteOrder);

router
  .route("/shops/:storeId/purchase-orders/:orderId/transactions")
  .get(
    validateTypes(SHOP, PURCHASE_ORDER),
    orderController.allOrderTransactions
  )
  .post(validateTypes(SHOP, PURCHASE_ORDER), orderController.createTransaction);

router
  .route("/shops/:storeId/purchase-orders/:orderId/transactions/:transactionId")
  .get(validateTypes(SHOP, PURCHASE_ORDER), orderController.specificTransaction)
  .put(validateTypes(SHOP, PURCHASE_ORDER), orderController.updateTransaction)
  .delete(
    validateTypes(SHOP, PURCHASE_ORDER),
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
  .delete(validateTypes(SHOP, STAFF), orderController.deleteOrder);

export default router;
