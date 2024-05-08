import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userRole.createMany({
    data: [
      {
        key: "CUSTOMER",
        description: "User who purchases products from a store.",
      },
      {
        key: "OWNER",
        description: "User who runs a store.",
      },
    ],
  });

  await prisma.storeType.createMany({
    data: [
      {
        key: "SHOP",
        description: "Store that customers purchase products from.",
      },
      {
        key: "VENDOR",
        description: "Store that supplies products to a store.",
      },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      userRole: {
        connect: {
          key: "CUSTOMER",
        },
      },
      address: {
        create: {
          unit_number: 987,
          address_line1: "Sesame Street",
          postal_code: "Z9Y8X7",
          city: "Edmonton",
          country: "Canada",
        },
      },
    },
  });

  await prisma.store.create({
    data: {
      name: "Real Good Beverage Co.",
      email: "contact@realgoodbeverage.com",
      storeType: {
        connect: {
          key: "STORE",
        },
      },
      address: {
        create: {
          unit_number: 123,
          address_line1: "Sesame Street",
          postal_code: "A1B2C3",
          city: "Edmonton",
          country: "Canada",
        },
      },
      inventory: {
        create: [
          {
            quantity_stocked: 5,
            product: {
              create: {
                name: "Lemonade",
                description:
                  "A refreshing glass of freshly squeezed lemons, cane sugar, and ice-cold water.",
                price: 99,
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
        key: "SALES_ORDER",
        description:
          "An order placed by a customer to purchase a product from a store.",
      },
      {
        key: "PURCHASE_ORDER",
        description:
          "An order placed by an owner to purchase a product from a vendor.",
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
