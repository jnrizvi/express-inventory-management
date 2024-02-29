import {Request, Response} from 'express';
import { productService } from '../services';

// Should I not return anything?
const getProducts = async (req: Request, res: Response) => {
    const { storeId } = req.body;
    const products = await productService.getProductsByStoreId(storeId)
    res.send(products)
}

export default {
    getProducts
}