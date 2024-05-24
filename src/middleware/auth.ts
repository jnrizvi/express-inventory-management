import { Request, Response, NextFunction } from "express";
import { orderTypeRules } from "../config/roles";
import prisma from "../client";

// authorization is a curried function that takes a string argument as the
// first set of arguments, then the Express req, res, and next (function) as the
// second set of arguments.
const authorization =
  (orderType: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await prisma.user.findUnique({ where: { email: req.body.email } });
      const store = await prisma.store.findUnique({ where: { id: +req.params.storeId } });

      if (user && store) {
        const rules = orderTypeRules.get(orderType)
        // Check if the order type is in line with the types of the provided user and store.
        if (rules && rules.userTypes.includes(user.user_role_key) && rules.storeTypes.includes(store.store_type_key)) {
          next()
        }
      }
      return res.status(400).send("Bad request.");
    };

export default authorization;
