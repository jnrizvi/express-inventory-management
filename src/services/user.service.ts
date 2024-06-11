import { User } from "@prisma/client";
import prisma from "../client";

const allUsers = (userRole: string): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      user_role_key: userRole,
    },
    include: {
      address: true,
    },
  });
};

const specificUser = (userId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      address: true,
    },
  });
};

const createUser = (payload: any, userRole: string): Promise<User> => {
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

    return trx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        address_id: address.id,
        user_role_key: userRole,
      },
    });
  });
};

const updateUser = (userId: number, payload: any): Promise<User> => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.email && { email: payload.email }),
    },
  });
};

const deleteUser = (userId: number): Promise<User> => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export default {
  allUsers,
  specificUser,
  createUser,
  updateUser,
  deleteUser,
};
