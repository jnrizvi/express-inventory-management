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
  .get(validateTypes(SHOP), productController.allInventory)
  .post(validateTypes(SHOP), productController.createInventory);

router
  .route("/shops/:storeId/products/:productId")
  .get(validateTypes(SHOP), productController.specificInventory)
  .put(validateTypes(SHOP), productController.updateInventory)
  .delete(validateTypes(SHOP), productController.deleteInventory);

// Vendor Inventory
router
  .route("/vendors/:storeId/products")
  .get(validateTypes(VENDOR), productController.allInventory)
  .post(validateTypes(VENDOR), productController.createInventory);

router
  .route("/vendors/:storeId/products/:productId")
  .get(validateTypes(VENDOR), productController.specificInventory)
  .put(validateTypes(VENDOR), productController.updateInventory)
  .delete(validateTypes(VENDOR), productController.deleteInventory);

export default router;
