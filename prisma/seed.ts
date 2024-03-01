import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        key: "CUSTOMER",
        description: "User who purchases products from a store.",
      },
      {
        key: "OWNER",
        description: "User who owns a store.",
      },
      {
        key: "SUPPLIER",
        description: "User who supplies products for a store.",
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Bob",
        email: "bob@example.com",
        role_key: "CUSTOMER",
      },
      {
        name: "Roger",
        email: "roger@example.com",
        role_key: "OWNER",
      },
      {
        name: "Hudson",
        email: "hudson@example.com",
        role_key: "SUPPLIER",
      },
    ],
  });

  await prisma.store.create({
    data: {
      name: "Power Up Fitness",
      storeProduct: {
        create: [
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Resistance Superbands",
                price: 499,
              },
            },
          },
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Deluxe Floor Mat",
                price: 999,
              },
            },
          },
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Medium Density Foam Roller (Black)",
                price: 1199,
              },
            },
          },
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Spikey Massage Ball (8.5 CM)",
                price: 699,
              },
            },
          },
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Power Medicine Balls",
                price: 2999,
              },
            },
          },
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Adjustable Skipping Rope",
                price: 1499,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.orderType.createMany({
    data: [
      {
        key: "CUSTOMER_ORDER",
        description:
          "An order placed by a customer to purchase a product from a store.",
      },
      {
        key: "SUPPLIER_ORDER",
        description:
          "An order placed by an owner to purchase a product from a supplier.",
      },
    ],
  });

  await prisma.orderStatus.createMany({
    data: [
      {
        key: "OPEN",
      },
      {
        key: "ARCHIVED",
      },
      {
        key: "CANCELED",
      },
    ],
  });

  await prisma.transactionType.createMany({
    data: [
      {
        key: "SALE",
      },
      {
        key: "REFUND",
      },
    ],
  });

  await prisma.transactionStatus.createMany({
    data: [
      {
        key: "PENDING",
      },
      {
        key: "PAID",
      },
      {
        key: "REFUNDED",
      },
      {
        key: "UNPAID",
      },
      {
        key: "VOIDED",
      },
    ],
  });

  await prisma.transactionMethod.createMany({
    data: [
      {
        key: "CASH_ON_DELIVERY",
      },
      {
        key: "STRIPE",
      },
      {
        key: "APPLE_PAY",
      },
      {
        key: "VISA",
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
