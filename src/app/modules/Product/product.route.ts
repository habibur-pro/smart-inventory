import express from 'express'
import { ProductControllers } from './product.controller'

const router = express.Router()

router.post(
  '/',
  // validateRequest(ProductValidation.createProductValidationSchema),
  ProductControllers.createProduct,
)

router.get(
  '/',
  ProductControllers.getAllProduct,
)

router.get(
  '/:id',
  ProductControllers.getSingleProduct,
)

router.patch(
  '/:id',
 //  validateRequest(ProductValidation.createProductValidationSchema),
  ProductControllers.updateProduct,
)

router.delete(
  '/:id',
  ProductControllers.deleteProduct,
)

export const ProductRoutes = router
