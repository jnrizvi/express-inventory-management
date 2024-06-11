import { Router } from "express";
import userRoute from "./user.route";
import storeRoute from "./store.route";
import productRoute from "./product.route";
import orderRoute from "./order.route";

const router = Router();

router.use(userRoute);

router.use(storeRoute);

router.use(productRoute);

router.use(orderRoute);

export default router;
