import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpers/queryBuilder";
import { Order, OrderStatus, RestockPriority } from "@prisma/client";
import { IOrderPayload } from "./order.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createOrderIntoDB = async (payload: IOrderPayload) => {
  const prices = await Promise.all(
    payload.items.map(async (item) => {
      const product = await prisma.product.findUniqueOrThrow({
        where: { id: item.productId },
      });

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Product ${product.name} is out of stock`,
        );
      }

      return product.price * item.quantity;
    }),
  );

  const totalPrice = prices.reduce((sum, price) => sum + price, 0);
  return await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerName: payload.customerName,
        totalPrice: totalPrice,
        products: {
          createMany: {
            data: payload.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      },
    });
    await Promise.all(
      payload.items.map(async (item) => {
        const product = await tx.product.findUniqueOrThrow({
          where: { id: item.productId },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: product.stockQuantity - item.quantity,
            status:
              product.stockQuantity - item.quantity <= 0
                ? "STOCK_OUT"
                : "ACTIVE",
          },
        });
        // Check if the stock quantity after the order is below the minimum threshold
        const remainingStock = product.stockQuantity - item.quantity;
        const minimumStockThreshold = product.minimumStockThreshold;
        if (minimumStockThreshold >= remainingStock) {
          let priority = "HIGH" as RestockPriority;

          if (remainingStock <= minimumStockThreshold / 3) {
            priority = "HIGH";
          } else if (remainingStock <= minimumStockThreshold / 2) {
            priority = "MEDIUM";
          } else {
            priority = "LOW";
          }

          await tx.restockQueue.upsert({
            where: { productId: item.productId },
            update: {
              priority: priority,
            },
            create: {
              productId: item.productId,
              priority: priority,
            },
          });
        }
      }),
    );
    return newOrder;
  });
};

const cancelOrderIntoDB = async (id: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: { products: true },
  });
  await Promise.all(
    order.products.map(async (product) => {
      const productData = await prisma.product.findUniqueOrThrow({
        where: { id: product.productId },
      });
      await prisma.product.update({
        where: { id: product.productId },
        data: {
          stockQuantity: productData.stockQuantity + product.quantity,
          status:
            productData.stockQuantity + product.quantity > 0
              ? "ACTIVE"
              : "STOCK_OUT",
        },
      });
    }),
  );
  return await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

const updateStatusIntoDB = async (id: string, status: OrderStatus) => {
  const order = await prisma.order.findFirst({
    where: { id, status: { not: "CANCELLED" } },
  });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

const getAllOrderFromDB = async (query: Record<string, unknown>) => {
  const allorderQuery = new QueryBuilder(prisma.order, query);
  const result = await allorderQuery
    .search(["order"])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allorderQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
};

const getSingleOrderFromDB = async (id: string) => {
  return await prisma.order.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
};

const updateOrderIntoDB = async (id: string, payload: Partial<Order>) => {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: payload,
  });
  return updatedOrder;
};

const deleteOrderFromDB = async (id: string) => {
  return await prisma.order.delete({
    where: { id },
  });
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
  updateOrderIntoDB,
  deleteOrderFromDB,
  cancelOrderIntoDB,
  updateStatusIntoDB,
};
