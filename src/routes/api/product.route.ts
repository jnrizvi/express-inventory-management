import express from 'express';
import { productController } from '../../controllers'

const router = express.Router();

router.get('/products', productController.getProducts);

export default router;