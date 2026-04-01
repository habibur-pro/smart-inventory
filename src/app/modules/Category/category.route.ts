import express from 'express'
import { CategoryControllers } from './category.controller'

const router = express.Router()

router.post(
  '/',
  // validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
)

router.get(
  '/',
  CategoryControllers.getAllCategory,
)

router.get(
  '/:id',
  CategoryControllers.getSingleCategory,
)

router.patch(
  '/:id',
 //  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.updateCategory,
)

router.delete(
  '/:id',
  CategoryControllers.deleteCategory,
)

export const CategoryRoutes = router
