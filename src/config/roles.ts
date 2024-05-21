import { CUSTOMER, STAFF } from "../util/constants";

const allRoles = {
  [CUSTOMER]: [],
  [STAFF]: ["getOrders", "manageOrders"],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
