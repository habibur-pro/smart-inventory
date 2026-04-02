import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpers/queryBuilder";
import { RestockQueue } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const getAllRestockQueueFromDB = async (query: Record<string, unknown>) => {
  const allrestockQueueQuery = new QueryBuilder(prisma.restockQueue, query);
  const result = await allrestockQueueQuery
    .search(["restockQueue"])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allrestockQueueQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
};

const restock = async (queueId: string, quantity: number) => {
  const restockQueue = await prisma.restockQueue.findUnique({
    where: { id: queueId },
    include: { product: true },
  });
  if (!restockQueue) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restock queue not found");
  }
  const product = restockQueue.product;
  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: product.id },
      data: { stockQuantity: product.stockQuantity + quantity },
    });
    const totalStock = product.stockQuantity + quantity;
    // Update or delete the restock queue based on the new stock quantity
    // If the total stock is above the minimum threshold, delete the restock queue
    // If the total stock is between the minimum threshold and half of it, set priority to LOW
    // If the total stock is between half of the minimum threshold and a third of it, set priority to MEDIUM
    // If the total stock is below a third of the minimum threshold, set priority to HIGH
    if (totalStock > product.minimumStockThreshold) {
      await tx.restockQueue.delete({ where: { id: queueId } });
    } else if (totalStock > product.minimumStockThreshold / 2) {
      await tx.restockQueue.update({
        where: { id: queueId },
        data: { priority: "LOW" },
      });
    } else if (totalStock > product.minimumStockThreshold / 3) {
      await tx.restockQueue.update({
        where: { id: queueId },
        data: { priority: "MEDIUM" },
      });
    } else {
      await tx.restockQueue.update({
        where: { id: queueId },
        data: { priority: "HIGH" },
      });
    }
  });
};

const deleteRestockQueueFromDB = async (id: string) => {
  return await prisma.restockQueue.delete({
    where: { id },
  });
};

export const RestockQueueServices = {
  getAllRestockQueueFromDB,
  deleteRestockQueueFromDB,
  restock,
};
