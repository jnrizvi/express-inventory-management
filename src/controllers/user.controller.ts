import { Request, Response } from "express";
import { userService } from "../services";

const allUsers = (userRole: string) => async (_: Request, res: Response) => {
  const users = await userService.allUsers(userRole);

  res.send(users);
};

const specificUser = async (req: Request, res: Response) => {
  const userId = +req.params.userId;

  const user = await userService.specificUser(userId);

  res.send(user);
};

const createUser =
  (userRole: string) => async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await userService.createUser(payload, userRole);

    res.send(user);
  };

const updateUser = async (req: Request, res: Response) => {
  const userId = +req.params.userId;
  const payload = req.body;

  const user = await userService.updateUser(userId, payload);

  res.send(user);
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = +req.params.userId;

  const user = await userService.deleteUser(userId);

  res.send(user);
};

export default {
  allUsers,
  specificUser,
  createUser,
  updateUser,
  deleteUser,
};
