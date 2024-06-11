import { Request, Response, NextFunction } from "express";
import prisma from "../client";

const validateTypes =
  (...requiredTypes: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const store = req.params.storeId
      ? await prisma.store.findUnique({
          where: { id: +req.params.storeId },
        })
      : null;

    const user = req.body.email
      ? await prisma.user.findUnique({
          where: { email: req.body.email },
        })
      : null;

    const order = req.params.orderId
      ? await prisma.order.findUnique({
          where: { id: +req.params.orderId },
          include: { user: true },
        })
      : null;

    const presentTypes: string[] = [];
    if (store) {
      req.body.store = store;
      presentTypes.push(store.store_type_key);
    }
    if (user) {
      req.body.user = user;
      presentTypes.push(user.user_role_key);
    }
    if (order) {
      req.body.order = order;
      presentTypes.push(order.order_type_key);
    }

    const hasRequiredTypes = requiredTypes.every((requiredType) =>
      presentTypes.includes(requiredType)
    );

    if (!hasRequiredTypes) {
      return res.status(400).send("Bad request.");
    } else if (presentTypes.length > requiredTypes.length) {
      // Developer's responsibility to provide all required types
      return res.status(500).send("Server error.");
    }

    next();
  };

export default validateTypes;
