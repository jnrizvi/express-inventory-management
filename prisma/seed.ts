import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.store.createMany({
    data: [
      {
        name: "",
      },
      {
        name: "",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: "",
        description: "",
        price: 4,
      },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      // This works
      userRoles: {
        create: {
          role: {
            create: {
              name: "CUSTOMER",
            },
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Roger",
      email: "roger@example.com",
      // This works
      userRoles: {
        create: {
          role: {
            create: {
              name: "OWNER",
            },
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Hudson",
      email: "hudson@example.com",
      // This works
      userRoles: {
        create: {
          role: {
            create: {
              name: "SUPPLIER",
            },
          },
        },
      },
    },
  });

  await prisma.orderType.createMany({
    data: [
      {
        name: "CUSTOMER_ORDER",
      },
      {
        name: "SUPPLIER_ORDER",
      },
    ],
  });

  await prisma.orderStatus.createMany({
    data: [
      {
        name: "COMPLETE",
      },
    ],
  });

  await prisma.transactionType.createMany({
    data: [
      {
        name: "SALE",
      },
      {
        name: "REFUND",
      },
    ],
  });

  await prisma.transactionMethod.createMany({
    data: [
      {
        name: "STRIPE",
      },
      {
        name: "APPLE_PAY",
      },
      {
        name: "VISA",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
