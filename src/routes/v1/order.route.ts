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

router.get("/store/:storeId/orders", orderController.allStoreOrders);
router.get(
  "/store/:storeId/order/:orderId",
  orderController.specificStoreOrder
);
router.post("/store/:storeId/order", orderController.placeSalesOrder);
router.put("/store/:storeId/order/:orderId", orderController.fulfillSalesOrder);

export default router;
