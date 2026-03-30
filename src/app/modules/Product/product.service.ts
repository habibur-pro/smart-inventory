import prisma from '../../../shared/prisma'
      import QueryBuilder from '../../../helpers/queryBuilder';
      import { Product } from "@prisma/client";

const createProductIntoDB = async (payload: Product) => {
  const newProduct = await prisma.product.create({data: payload})
  return newProduct
}

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  
  const allproductQuery = new QueryBuilder(prisma.product, query);
  const result = await allproductQuery
    .search(['product'])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allproductQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
}

const getSingleProductFromDB = async (id: string) => {
  return await prisma.product.findUniqueOrThrow({
    where: {
      id: id
    }
  })
}

const updateProductIntoDB = async (id: string, payload: Partial<Product>) => {
  const updatedProduct = await prisma.product.update({
      where: { id },
      data: payload,
    })
  return updatedProduct
}

const deleteProductFromDB = async (id: string) => {
  return await prisma.product.delete({
    where: { id }
  })
}

export const ProductServices = {
  createProductIntoDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
}
