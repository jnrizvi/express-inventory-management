import express from "express";
import { productController } from "../../controllers";
import validateStore from "../../middleware/params";
import { SHOP, VENDOR } from "../../util/constants";

const router = express.Router();

router
  .route("/products")
  .get(productController.allProducts)
  .post(productController.createProduct);

router
  .route("/products/:productId")
  .get(productController.specificProduct)
  .put(productController.updateProduct)
  .delete((_, res) => res.send("Not implemented"));

// Shop Inventory
router
  .route("/shops/:storeId/products")
  .get(validateStore(SHOP), productController.allStoreProducts)
  .post(validateStore(SHOP), productController.addProductToStore);

router
  .route("/shops/:storeId/products/:productId")
  .get(validateStore(SHOP), productController.specificStoreProduct)
  .put(validateStore(SHOP), productController.updateProductInventory)
  .delete((_, res) => res.send("Not implemented"));

// Vendor Inventory
router
  .route("/vendors/:storeId/products")
  .get(validateStore(VENDOR), productController.allStoreProducts)
  .post(validateStore(VENDOR), productController.addProductToStore);

router
  .route("/vendors/:storeId/products/:productId")
  .get(validateStore(VENDOR), productController.specificStoreProduct)
  .put(validateStore(VENDOR), productController.updateProductInventory)
  .delete((_, res) => res.send("Not implemented"));

export default router;
