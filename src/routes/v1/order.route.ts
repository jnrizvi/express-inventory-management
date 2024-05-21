import express from "express";
import auth from "../../middleware/auth";
import { orderController } from "../../controllers";

const router = express.Router();

// Sales Orders
router
  .route("/shops/:storeId/sales-orders")
  .get(auth("getOrders"), orderController.allSalesOrders)
  .post(auth("manageOrders"), orderController.placeSalesOrder);

router
  .route("/shops/:storeId/sales-orders/:orderId")
  .get(auth("getOrders"), orderController.specificSalesOrder)
  .put(auth("manageOrders"), orderController.processSalesOrder)
  .delete(auth("manageOrders"), (_, res) => res.send("Not implemented"));

// Purchase Orders
router
  .route("/vendors/:storeId/purchase-orders")
  .get(auth("getOrders"), orderController.allPurchaseOrders)
  .post(auth("manageOrders"), orderController.placePurchaseOrder);

router
  .route("/vendors/:storeId/purchase-orders/:orderId")
  .get(auth("getOrders"), orderController.specificPurchaseOrder)
  .put(auth("manageOrders"), orderController.receivePurchaseOrder)
  .delete(auth("manageOrders"), (_, res) => res.send("Not implemented"));

// Transfer Orders
router
  .route("/shops/:storeId/transfer-orders")
  .get(auth("getOrders"), orderController.allTransferOrders)
  .post(auth("manageOrders"), orderController.placeTransferOrder);

router
  .route("/shops/:storeId/transfer-orders/:orderId")
  .get(auth("getOrders"), orderController.specificTransferOrder)
  .put(auth("manageOrders"), orderController.receiveTransferOrder)
  .delete(auth("manageOrders"), (_, res) => res.send("Not implemented"));

export default router;
