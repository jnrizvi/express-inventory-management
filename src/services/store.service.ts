import { Store } from "@prisma/client";
import prisma from "../client";

const allStores = (storeType: string): Promise<Store[]> => {
  return prisma.store.findMany({
    where: {
      store_type_key: storeType,
    },
  });
};

const specificStore = (storeId: number): Promise<Store | null> => {
  return prisma.store.findUnique({
    where: {
      id: storeId,
    },
  });
};

const createStore = async (payload: any, storeType: string): Promise<Store> => {
  return prisma.$transaction(async (trx) => {
    let address = await trx.address.findFirst({
      where: {
        unit_number: payload.unitNumber,
        address_line1: payload.addressLine1,
        ...(payload.addressLine2 && { address_line2: payload.addressLine2 }),
        postal_code: payload.postalCode,
        city: payload.city,
        country: payload.country,
      },
    });

    if (!address) {
      address = await trx.address.create({
        data: {
          unit_number: payload.unitNumber,
          address_line1: payload.addressLine1,
          ...(payload.addressLine2 && { address_line2: payload.addressLine2 }),
          postal_code: payload.postalCode,
          city: payload.city,
          country: payload.country,
        },
      });
    }

    return trx.store.create({
      data: {
        name: payload.name,
        email: payload.email,
        address_id: address.id,
        store_type_key: storeType,
      },
    });
  });
};

const updateStore = (storeId: number, payload: any): Promise<Store> => {
  return prisma.store.update({
    where: {
      id: storeId,
    },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.email && { email: payload.email }),
    },
  });
};

const deleteStore = (storeId: number): Promise<Store> => {
  return prisma.store.delete({
    where: {
      id: storeId,
    },
  });
};

export default {
  allStores,
  specificStore,
  createStore,
  updateStore,
  deleteStore,
};
