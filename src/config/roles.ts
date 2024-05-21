import { CUSTOMER, STAFF } from "../util/constants";

const allRoles = {
  [CUSTOMER]: ["placeSalesOrder"],
  [STAFF]: ["placePurchaseOrder", "placeTransferOrder"],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
