import express from "express";

const router = express.Router();

// Shops
router
  .route("/shops")
  .get((_, res) => res.send("Not implemented"))
  .post((_, res) => res.send("Not implemented"));

router
  .route("/shops/:storeId")
  .get((_, res) => res.send("Not implemented"))
  .put((_, res) => res.send("Not implemented"))
  .delete((_, res) => res.send("Not implemented"));

// Vendors
router
  .route("/vendors")
  .get((_, res) => res.send("Not implemented"))
  .post((_, res) => res.send("Not implemented"));

router
  .route("/vendors/:storeId")
  .get((_, res) => res.send("Not implemented"))
  .put((_, res) => res.send("Not implemented"))
  .delete((_, res) => res.send("Not implemented"));
