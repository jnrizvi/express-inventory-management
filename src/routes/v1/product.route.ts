import express from "express";
import { productController } from "../../controllers";
import validateTypes from "../../middleware/params";
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
// NOTE: We nest the url to describe the inventory resource because its id is composite.
//       These routes could go in their own inventory.route.ts file.
router
  .route("/shops/:storeId/products")
  .get(validateTypes(SHOP), productController.allStoreProducts)
  .post(validateTypes(SHOP), productController.addProductToStore);

router
  .route("/shops/:storeId/products/:productId")
  .get(validateTypes(SHOP), productController.specificStoreProduct)
  .put(validateTypes(SHOP), productController.updateProductInventory)
  .delete((_, res) => res.send("Not implemented"));

// Vendor Inventory
router
  .route("/vendors/:storeId/products")
  .get(validateTypes(VENDOR), productController.allStoreProducts)
  .post(validateTypes(VENDOR), productController.addProductToStore);

router
  .route("/vendors/:storeId/products/:productId")
  .get(validateTypes(VENDOR), productController.specificStoreProduct)
  .put(validateTypes(VENDOR), productController.updateProductInventory)
  .delete((_, res) => res.send("Not implemented"));

export default router;
