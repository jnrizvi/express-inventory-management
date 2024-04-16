import express from "express";
import { productController } from "../../controllers";

const router = express.Router();

router.get("/store/:storeId/products", productController.allStoreProducts);
router.get(
  "/store/:storeId/product/:productId",
  productController.specificStoreProduct
);

export default router;
