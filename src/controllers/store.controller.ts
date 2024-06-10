import { Request, Response } from "express";
import { storeService } from "../services";

const allStores = (storeType: string) => async (_: Request, res: Response) => {
  const stores = await storeService.allStores(storeType);

  res.send(stores);
};

const specificStore = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;

  const store = await storeService.specificStore(storeId);

  res.send(store);
};

const createStore =
  (storeType: string) => async (req: Request, res: Response) => {
    const payload = req.body;

    const store = await storeService.createStore(payload, storeType);

    res.send(store);
  };

const updateStore = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;
  const payload = req.body;

  const store = await storeService.updateStore(storeId, payload);

  res.send(store);
};

const deleteStore = async (req: Request, res: Response) => {
  const storeId = +req.params.storeId;

  const store = await storeService.deleteStore(storeId);

  res.send(store);
};

export default {
  allStores,
  specificStore,
  createStore,
  updateStore,
  deleteStore,
};
