import express from 'express'
import { OrderControllers } from './order.controller'

const router = express.Router()

router.post(
  '/',
  // validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.createOrder,
)

router.get(
  '/',
  OrderControllers.getAllOrder,
)

router.get(
  '/:id',
  OrderControllers.getSingleOrder,
)

router.patch(
  '/:id',
 //  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.updateOrder,
)

router.delete(
  '/:id',
  OrderControllers.deleteOrder,
)

export const OrderRoutes = router
