
import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { OrderServices } from './order.service'

const createOrder = catchAsync(async (req, res) => {
  // const user = req.user
  // req.body.createdBy = user._id
  const result = await OrderServices.createOrderIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  })
})

const getAllOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrderFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    // meta: result.meta,
    data: result,
  })
})

const getSingleOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.getSingleOrderFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  })
})

const updateOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.updateOrderIntoDB(req.params.id, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  })
})

const deleteOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrderFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  })
})

export const OrderControllers = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
}
