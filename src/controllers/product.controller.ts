import { Request, Response } from "express";
import { productService } from "../services";

const allProducts = async (req: Request, res: Response) => {
  const products = await productService.allProducts();

  res.send(products);
};

const specificProduct = async (req: Request, res: Response) => {
  const productId = +req.params.productId;

  const product = await productService.specificProduct(productId);

  res.send(product);
};

const createProduct = async (req: Request, res: Response) => {
  const payload = req.body;

  const product = await productService.createProduct(payload);

  res.send(product);
};

const updateProduct = async (req: Request, res: Response) => {
  const productId = +req.params.productId;
  const payload = req.body;

  const product = await productService.updateProduct(productId, payload);

  res.send(product);
};

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

const addProductToStore = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const payload = req.body;

  const products = await productService.addProductToStore(storeId, payload);

  res.send(products);
};

const updateProductInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;
  const payload = req.body;

  const product = await productService.updateProductInventory(
    storeId,
    productId,
    payload
  );

  res.send(product);
};

export default {
  allProducts,
  specificProduct,
  createProduct,
  updateProduct,
  allStoreProducts,
  specificStoreProduct,
  addProductToStore,
  updateProductInventory,
};
