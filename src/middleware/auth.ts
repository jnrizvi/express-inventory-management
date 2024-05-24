import { Request, Response, NextFunction } from "express";
import { roleRights } from "../config/roles";
import prisma from "../client";

// authorization is a curried function that takes a string argument as the
// first set of arguments, then the Express req, res, and next (function) as the
// second set of arguments.
const authorization =
  (storeType: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    //
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    const store = await prisma.store.findUnique({
      where: {
        id: +req.params.storeId,
      },
    });

    // Make sure the storeId points to a store whose type matches what the route requires
    if (user && store && storeType === store.store_type_key) {
      // This tells me which type(s) of store the user is permitted to place an order at.
      const permittedStoreTypes = roleRights.get(user.user_role_key) ?? [];

      const canOrderFromStore = permittedStoreTypes.includes(
        store.store_type_key
      );

      if (!canOrderFromStore) {
        return res
          .status(403)
          .send("This user is not authorized to place such an order.");
      }
    } else {
      return res.status(400).send("Bad request.");
    }

    next();
  };

export default authorization;
