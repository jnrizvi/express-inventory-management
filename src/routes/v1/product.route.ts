import express from "express";
import { productController } from "../../controllers";

const router = express.Router();

// Return all products
router.get("/products", (_, res) => res.send("Not implemented"));

// Return a specific product
router.get("/products/:productId", (_, res) => res.send("Not implemented"));

// Create a new product
router.post("/products", (_, res) => res.send("Not implemented"));

// Update a product
router.put("/products/:productId", (_, res) => res.send("Not implemented"));

// Delete a product
router.delete("/products/:productId", (_, res) => res.send("Not implemented"));

// Return all products at a specific shop
router.get("/shops/:storeId/products", productController.allShopProducts);

// Return a specific product at a specific shop
router.get(
  "/shops/:storeId/products/:productId",
  productController.specificShopProduct
);

export default router;
