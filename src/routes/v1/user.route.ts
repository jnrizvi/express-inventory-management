import express from "express";

const router = express.Router();

// Return all customers
router.get("/customers", (_, res) => res.send("Not implemented"));

// Return a specific customer
router.get("/customers/:userId", (_, res) => res.send("Not implemented"));

// Create a new customer
router.post("/customers", (_, res) => res.send("Not implemented"));

// Update a customer
router.put("/customers/:userId", (_, res) => res.send("Not implemented"));

// Delete a customer
router.delete("/customers/:userId", (_, res) => res.send("Not implemented"));

// Return all staff members
router.get("/staff", (_, res) => res.send("Not implemented"));

// Return a specific staff member
router.get("/staff/:userId", (_, res) => res.send("Not implemented"));

// Create a new staff member
router.post("/staff", (_, res) => res.send("Not implemented"));

// Update a staff member
router.put("/staff/:userId", (_, res) => res.send("Not implemented"));

// Delete a staff member
router.delete("/staff/:userId", (_, res) => res.send("Not implemented"));
