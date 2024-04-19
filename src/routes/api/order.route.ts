import express from "express";
import { orderController } from "../../controllers";

const router = express.Router();

router.get("/store/:storeId/orders", orderController.allStoreOrders);
router.get(
  "/store/:storeId/order/:orderId",
  orderController.specificStoreOrder
);
router.post("/store/:storeId/order", orderController.placeStoreOrder);
router.put("/store/:storeId/order/:orderId", orderController.fulfillStoreOrder);

export default router;
