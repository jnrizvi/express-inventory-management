import { CUSTOMER, STAFF, SHOP, VENDOR } from "../util/constants";

// NOTE: The customer never interacts with this system.
//       These roles are for maintaining data integrity.
//       For example, the user_id of an order record can only be the user.id of a customer,
//       and the store_id can only be the store.id of a shop.
// A sales order can only be placed at a shop by a customer.
// A purchase order can only be placed at a vendor by a staff member.
// A transfer order can only be placed at a shop by a staff member.
const allRoles = {
  [CUSTOMER]: [SHOP],
  [STAFF]: [SHOP, VENDOR],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
