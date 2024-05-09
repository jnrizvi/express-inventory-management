import express from "express";

const router = express.Router();

// Return all shops
router.get("/shops", (_, res) => res.send("Not implemented"));

// Return a specific shop
router.get("/shops/:storeId", (_, res) => res.send("Not implemented"));

// Create a new shop
router.post("/stores", (_, res) => res.send("Not implemented"));

// Update a shop
router.put("/shops/:storeId", (_, res) => res.send("Not implemented"));

// Delete a shop
router.delete("/shops/:storeId", (_, res) => res.send("Not implemented"));

// Return all vendors
router.get("/vendors", (_, res) => res.send("Not implemented"));

// Return a specific vendor
router.get("/vendors/:storeId", (_, res) => res.send("Not implemented"));

// Create a new vendor
router.post("/vendors", (_, res) => res.send("Not implemented"));

// Update a vendor
router.put("/vendors/:storeId", (_, res) => res.send("Not implemented"));

// Delete a vendors
router.delete("/vendors/:storeId", (_, res) => res.send("Not implemented"));
