import express from "express";

const router = express.Router();

// Return all records in the inventory at a specific shop
router.get("/shops/:storeId/inventory", (_, res) =>
  res.send("Not implemented")
);

// Return a specific record in the inventory at a specific shop
router.get("/shops/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);

// Create a new record in the inventory at a specific shop
router.post("/shops/:storeId/inventory", (_, res) =>
  res.send("Not implemented")
);

// Update a record in the inventory at a specific shop
router.put("/shops/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);

// Delete a record in the inventory at a specific shop
router.delete("/shops/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);

// Return all records in the inventory at a specific vendor
router.get("/vendors/:storeId/inventory", (_, res) =>
  res.send("Not implemented")
);

// Return a specific record in the inventory at a specific vendor
router.get("/vendors/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);

// Create a new record in the inventory at a specific vendor
router.post("/vendors/:storeId/inventory", (_, res) =>
  res.send("Not implemented")
);

// Update a record in the inventory at a specific vendor
router.put("/vendors/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);

// Delete a record in the inventory at a specific vendor
router.delete("/vendors/:storeId/inventory/:inventoryId", (_, res) =>
  res.send("Not implemented")
);
