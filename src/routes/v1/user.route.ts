import express from "express";
import { userController } from "../../controllers";
import { CUSTOMER, STAFF } from "../../util/constants";

const router = express.Router();

// Customers
router
  .route("/customers")
  .get(userController.allUsers(CUSTOMER))
  .post(userController.createUser(CUSTOMER));

router
  .route("/customers/:userId")
  .get(userController.specificUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Staff
router
  .route("/staff")
  .get(userController.allUsers(STAFF))
  .post(userController.createUser(STAFF));

router
  .route("/staff/:userId")
  .get(userController.specificUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
