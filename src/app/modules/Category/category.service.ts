import prisma from '../../../shared/prisma'
      import QueryBuilder from '../../../helpers/queryBuilder';
      import { Category } from "@prisma/client";

const createCategoryIntoDB = async (payload: Category) => {
  const newCategory = await prisma.category.create({data: payload})
  return newCategory
}

const getAllCategoryFromDB = async (query: Record<string, unknown>) => {
  
  const allcategoryQuery = new QueryBuilder(prisma.category, query);
  const result = await allcategoryQuery
    .search(['category'])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allcategoryQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
}

const getSingleCategoryFromDB = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: {
      id: id
    }
  })
}

const updateCategoryIntoDB = async (id: string, payload: Partial<Category>) => {
  const updatedCategory = await prisma.category.update({
      where: { id },
      data: payload,
    })
  return updatedCategory
}

const deleteCategoryFromDB = async (id: string) => {
  return await prisma.category.delete({
    where: { id }
  })
}

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
}
