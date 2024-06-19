import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (trx) => {
    await trx.userRole.createMany({
      data: [
        {
          key: "CUSTOMER",
          description: "User who purchases products from a shop.",
        },
        {
          key: "STAFF",
          description: "User who operates one or more shops.",
        },
      ],
    });

    await trx.storeType.createMany({
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

    await trx.orderType.createMany({
      data: [
        {
          key: "SALES_ORDER",
          description:
            "An order placed by a customer to purchase a product from a store.",
        },
        {
          key: "PURCHASE_ORDER",
          description:
            "An order placed by a staff member to purchase a product from a vendor.",
        },
        {
          key: "TRANSFER_ORDER",
          description:
            "An order placed by a staff member to move a product between two shops.",
        },
      ],
    });

    await trx.orderStatus.createMany({
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

    await trx.transactionType.createMany({
      data: [
        {
          key: "SALE",
        },
        {
          key: "REFUND",
        },
      ],
    });

    await trx.transactionStatus.createMany({
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

    await trx.transactionMethod.createMany({
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
          key: "DEBIT",
        },
        {
          key: "CREDIT",
        },
      ],
    });

    await trx.user.create({
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
            line_1: "987 Sesame Street",
            zip_or_postal_code: "Z9Y8X7",
            locality: "Edmonton",
            region: "Alberta",
            country: "Canada",
          },
        },
      },
    });

    await trx.store.create({
      data: {
        name: "Real Good Beverage Co.",
        email: "contact@realgoodbeverage.com",
        storeType: {
          connect: {
            key: "SHOP",
          },
        },
        address: {
          create: {
            line_1: "123 Sesame Street",
            zip_or_postal_code: "A1B2C3",
            locality: "Edmonton",
            region: "Alberta",
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
