import { Router } from "express";
import productRoute from './product.route'

const router = Router();

router.use(productRoute)

export default router
