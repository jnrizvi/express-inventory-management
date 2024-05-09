import express from "express";
import { orderController } from "../../controllers";

const router = express.Router();

/*
orders management (12)
  sales management
  - CRUD sales orders

  purchases management
  - CRUD purchase orders

  transfers management
  - CRUD transfer orders
*/

router.get("/stores/:storeId/orders", orderController.allStoreOrders);
router.get(
  "/stores/:storeId/orders/:orderId",
  orderController.specificStoreOrder
);
router.post("/stores/:storeId/orders", orderController.placeSalesOrder);
router.put(
  "/stores/:storeId/orders/:orderId",
  orderController.fulfillSalesOrder
);

export default router;
