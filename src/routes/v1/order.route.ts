import express from "express";
import authorization from "../../middleware/auth";
import { orderController } from "../../controllers";
import { SHOP, VENDOR } from "../../util/constants";

const router = express.Router();

// Sales Orders
router
  .route("/shops/:storeId/sales-orders")
  .get(authorization(SHOP), orderController.allSalesOrders)
  .post(authorization(SHOP), orderController.placeSalesOrder);

router
  .route("/shops/:storeId/sales-orders/:orderId")
  .get(authorization(SHOP), orderController.specificSalesOrder)
  .put(authorization(SHOP), orderController.processSalesOrder)
  .delete(authorization(SHOP), (_, res) => res.send("Not implemented"));

// Purchase Orders
router
  .route("/vendors/:storeId/purchase-orders")
  .get(authorization(VENDOR), orderController.allPurchaseOrders)
  .post(authorization(VENDOR), orderController.placePurchaseOrder);

router
  .route("/vendors/:storeId/purchase-orders/:orderId")
  .get(authorization(VENDOR), orderController.specificPurchaseOrder)
  .put(authorization(VENDOR), orderController.receivePurchaseOrder)
  .delete(authorization(VENDOR), (_, res) => res.send("Not implemented"));

// Transfer Orders
router
  .route("/shops/:storeId/transfer-orders")
  .get(authorization(SHOP), orderController.allTransferOrders)
  .post(authorization(SHOP), orderController.placeTransferOrder);

router
  .route("/shops/:storeId/transfer-orders/:orderId")
  .get(authorization(SHOP), orderController.specificTransferOrder)
  .put(authorization(SHOP), orderController.receiveTransferOrder)
  .delete(authorization(SHOP), (_, res) => res.send("Not implemented"));

export default router;
