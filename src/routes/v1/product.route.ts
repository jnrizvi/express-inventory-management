import express from "express";
import { productController } from "../../controllers";

const router = express.Router();

/*
products management (4)
- CRUD products
*/

router.get("/store/:storeId/products", productController.allStoreProducts);
router.get(
  "/store/:storeId/product/:productId",
  productController.specificStoreProduct
);

export default router;
