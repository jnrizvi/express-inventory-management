import { Request, Response, NextFunction } from "express";
import prisma from "../client";

const validateStore =
  (storeType: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const store = await prisma.store.findUnique({
      where: { id: +req.params.storeId },
    });

    if (store && store.store_type_key === storeType) {
      next();
    }

    return res.status(400).send("Bad request.");
  };

// const validateParameters =
//   (...paramTypes: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     for (const paramType of paramTypes) {
//       if (paramType === SHOP || paramType === VENDOR) {
//         const store = await prisma.store.findUnique({
//           where: { id: +req.params.storeId },
//         });

//         if (store?.store_type_key !== paramType) {
//           return res.status(400).send("Bad request.");
//         }
//       } else if (
//         paramType === SALES_ORDER ||
//         paramType === PURCHASE_ORDER ||
//         paramType === TRANSFER_ORDER
//       ) {
//         const order = await prisma.order.findUnique({
//           where: { id: +req.params.orderId },
//         });

//         if (order?.order_type_key !== paramType) {
//           return res.status(400).send("Bad request.");
//         }
//       }
//     }

//     next();
//   };

export default validateStore;
