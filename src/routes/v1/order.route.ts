import express from "express";
import { orderController } from "../../controllers";

const router = express.Router();

// Return all sales orders for a specific shop
router.get("/shops/:storeId/sales-orders", orderController.allSalesOrders);

// Return a specific sales order for a specific shop
router.get(
  "/shops/:storeId/sales-orders/:orderId",
  orderController.specificSalesOrder
);

// Create a new sales order for a specific shop
router.post("/shops/:storeId/sales-orders", orderController.placeSalesOrder);

// Update a sales order for a specific shop
router.put(
  "/shops/:storeId/sales-orders/:orderId",
  orderController.processSalesOrder
);

// Delete a sales order for a specific shop
router.delete("/shops/:storeId/sales-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Return all purchase orders for a specific vendor
router.get(
  "/vendors/:storeId/purchase-orders",
  orderController.allPurchaseOrders
);

// Return a specific purchase order for a specific vendor
router.get(
  "/vendors/:storeId/purchase-orders/:orderId",
  orderController.specificPurchaseOrder
);

// Create a new purchase order for a specific vendor
// TODO: Add validator.
//       Must have a shippingAddress.
// TODO: Add middleware to check if the user has the required rights for the request.
router.post(
  "/vendors/:storeId/purchase-orders",
  orderController.placePurchaseOrder
);

// Update a purchase order for a specific vendor
router.put(
  "/vendors/:storeId/purchase-orders/:orderId",
  orderController.receivePurchaseOrder
);

// Delete a purchase order for a specific vendor
router.delete("/vendors/:storeId/purchase-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Return all transfer orders for a specific shop
router.get(
  "/shops/:storeId/transfer-orders",
  orderController.allTransferOrders
);

// Return a specific transfer order for a specific shop
router.get(
  "/shops/:storeId/transfer-orders/:orderId",
  orderController.specificTransferOrder
);

// Create a new transfer order for a specific shop
// TODO: Add validator.
// Must not have a transactionMethod.
// Must have a shippingAddress
router.post(
  "/shops/:storeId/transfer-orders",
  orderController.placeTransferOrder
);

// Update a transfer order for a specific shop
router.put(
  "/shops/:storeId/transfer-orders/:orderId",
  orderController.receiveTransferOrder
);

// Delete a transfer order for a specific shop
router.delete("/shops/:storeId/transfer-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

export default router;
