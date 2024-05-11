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
router.post(
  "/vendors/:storeId/purchase-orders",
  orderController.placePurchaseOrder
);

// Update a purchase order for a specific vendor
router.put("/vendors/:storeId/purchase-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Delete a purchase order for a specific vendor
router.delete("/vendors/:storeId/purchase-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Return all transfer orders for a specific shop
router.get("/shops/:storeId/transfer-orders", (_, res) =>
  res.send("Not implemented")
);

// Return a specific transfer order for a specific shop
router.get("/shops/:storeId/transfer-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Create a new transfer order for a specific shop
router.post("/shops/:storeId/transfer-orders", (_, res) =>
  res.send("Not implemented")
);

// Update a transfer order for a specific shop
router.put("/shops/:storeId/transfer-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

// Delete a transfer order for a specific shop
router.delete("/shops/:storeId/transfer-orders/:orderId", (_, res) =>
  res.send("Not implemented")
);

export default router;
