import express from "express";
import { storeController } from "../../controllers";
import { SHOP, VENDOR } from "../../util/constants";

const router = express.Router();

// Shops
router
  .route("/shops")
  .get(storeController.allStores(SHOP))
  .post(storeController.createStore(SHOP));

router
  .route("/shops/:storeId")
  .get(storeController.specificStore)
  .put(storeController.updateStore)
  .delete(storeController.deleteStore);

// Vendors
router
  .route("/vendors")
  .get(storeController.allStores(VENDOR))
  .post(storeController.createStore(VENDOR));

router
  .route("/vendors/:storeId")
  .get(storeController.specificStore)
  .put(storeController.updateStore)
  .delete(storeController.deleteStore);

export default router;
