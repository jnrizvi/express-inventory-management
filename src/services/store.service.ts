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
        line_1: payload.line1,
        ...(payload.line2 && { line_2: payload.line2 }),
        ...(payload.line3 && { line_3: payload.line3 }),
        zip_or_postal_code: payload.zipOrPostalCode,
        locality: payload.locality,
        region: payload.region,
        country: payload.country,
      },
    });

    if (!address) {
      address = await trx.address.create({
        data: {
          line_1: payload.line1,
          ...(payload.line2 && { line_2: payload.line2 }),
          ...(payload.line3 && { line_3: payload.line3 }),
          zip_or_postal_code: payload.zipOrPostalCode,
          locality: payload.locality,
          region: payload.region,
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
