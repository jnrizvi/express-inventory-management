import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { roleRights } from "../config/roles";
import ApiError from "../util/ApiError";
import prisma from "../client";

// auth is a curried function that takes a variable number of string arguments as the
// first set of arguments, then the Express req, res, and next (function) as the
// second set of arguments.
const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.body.userId,
      },
    });

    return new Promise(
      (
        resolve: (value?: unknown) => void,
        reject: (reason?: unknown) => void
      ) => {
        if (user && requiredRights.length) {
          const userRights = roleRights.get(user.user_role_key) ?? [];
          const hasRequiredRights = requiredRights.every((requiredRight) =>
            userRights.includes(requiredRight)
          );
          if (!hasRequiredRights) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
        }

        resolve();
      }
    )
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
