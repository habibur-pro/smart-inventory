import prisma from '../../../shared/prisma'
      import QueryBuilder from '../../../helpers/queryBuilder';
      import { Order } from "@prisma/client";

const createOrderIntoDB = async (payload: Order) => {
  const newOrder = await prisma.order.create({data: payload})
  return newOrder
}

const getAllOrderFromDB = async (query: Record<string, unknown>) => {
  
  const allorderQuery = new QueryBuilder(prisma.order, query);
  const result = await allorderQuery
    .search(['order'])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allorderQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
}

const getSingleOrderFromDB = async (id: string) => {
  return await prisma.order.findUniqueOrThrow({
    where: {
      id: id
    }
  })
}

const updateOrderIntoDB = async (id: string, payload: Partial<Order>) => {
  const updatedOrder = await prisma.order.update({
      where: { id },
      data: payload,
    })
  return updatedOrder
}

const deleteOrderFromDB = async (id: string) => {
  return await prisma.order.delete({
    where: { id }
  })
}

export const OrderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
  updateOrderIntoDB,
  deleteOrderFromDB,
}
