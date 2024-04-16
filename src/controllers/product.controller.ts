import { Request, Response } from "express";
import { productService } from "../services";

// Should I not return anything?
const allStoreProducts = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;

  const products = await productService.allStoreProducts(storeId);
  res.send(products);
};

const specificStoreProduct = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;

  const product = await productService.specificStoreProduct(storeId, productId);
  res.send(product);
};

export default {
  allStoreProducts,
  specificStoreProduct,
};
