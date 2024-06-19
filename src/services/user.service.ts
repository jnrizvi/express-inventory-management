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
