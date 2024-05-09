import { Request, Response } from "express";
import { productService } from "../services";

// Should I not return anything?
const allShopProducts = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;

  const products = await productService.allShopProducts(storeId);
  res.send(products);
};

const specificShopProduct = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;

  const product = await productService.specificShopProduct(storeId, productId);
  res.send(product);
};

export default {
  allShopProducts,
  specificShopProduct,
};
