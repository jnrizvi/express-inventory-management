import express from "express";

const router = express.Router();

// Customers
router
  .route("/customers")
  .get((_, res) => res.send("Not implemented"))
  .post((_, res) => res.send("Not implemented"));

router
  .route("/customers/:userId")
  .get((_, res) => res.send("Not implemented"))
  .put((_, res) => res.send("Not implemented"))
  .delete((_, res) => res.send("Not implemented"));

// Staff
router
  .route("/staff")
  .get((_, res) => res.send("Not implemented"))
  .post((_, res) => res.send("Not implemented"));

router
  .route("/staff/:userId")
  .get((_, res) => res.send("Not implemented"))
  .put((_, res) => res.send("Not implemented"))
  .delete((_, res) => res.send("Not implemented"));
