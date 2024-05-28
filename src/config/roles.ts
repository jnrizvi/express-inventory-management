import {
  CUSTOMER,
  STAFF,
  PURCHASE_ORDER,
  SALES_ORDER,
  TRANSFER_ORDER,
  SHOP,
  VENDOR,
} from "../util/constants";

// NOTE: The customer never uses the system. This is just for enforcing the rules of the system.
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

// map order types to the permitted user and store types
const contextRules = {
  [SALES_ORDER]: {
    userTypes: [CUSTOMER],
    storeTypes: [SHOP],
  },
  [PURCHASE_ORDER]: {
    userTypes: [STAFF],
    storeTypes: [VENDOR],
  },
  [TRANSFER_ORDER]: {
    userTypes: [STAFF],
    storeTypes: [SHOP],
  },
};

export const orderTypes = Object.keys(contextRules);
export const orderTypeRules = new Map(Object.entries(contextRules));
