import { Router } from "express";
import productRoute from "./product.route";
import orderRoute from "./order.route";

const router = Router();

router.use(productRoute);

router.use(orderRoute);

export default router;
