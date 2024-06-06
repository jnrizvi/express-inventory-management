import { Request, Response } from "express";
import { productService } from "../services";

const allProducts = async (_: Request, res: Response) => {
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

const allInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;

  const products = await productService.allInventory(storeId);

  res.send(products);
};

const specificInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;

  const product = await productService.specificInventory(storeId, productId);

  res.send(product);
};

const createInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const payload = req.body;

  const products = await productService.createInventory(storeId, payload);

  res.send(products);
};

const updateInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;
  const payload = req.body;

  const product = await productService.updateInventory(
    storeId,
    productId,
    payload
  );

  res.send(product);
};

const deleteInventory = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const productId = +req.params.productId;

  const inventory = await productService.deleteInventory(storeId, productId);

  res.send(inventory);
};

export default {
  allProducts,
  specificProduct,
  createProduct,
  updateProduct,
  allInventory,
  specificInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
