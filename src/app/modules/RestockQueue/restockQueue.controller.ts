import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { RestockQueueServices } from "./restockQueue.service";

const getAllRestockQueue: RequestHandler = catchAsync(async (req, res) => {
  const result = await RestockQueueServices.getAllRestockQueueFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "RestockQueues retrieved successfully",
    // meta: result.meta,
    data: result,
  });
});

const restockQueue: RequestHandler = catchAsync(async (req, res) => {
  const result = await RestockQueueServices.restock(
    req.params.id,
    req.body.quantity,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "RestockQueue restocked successfully",
    data: result,
  });
});

const deleteRestockQueue: RequestHandler = catchAsync(async (req, res) => {
  const result = await RestockQueueServices.deleteRestockQueueFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "RestockQueue deleted successfully",
    data: result,
  });
});

export const RestockQueueControllers = {
  getAllRestockQueue,
  restockQueue,
  deleteRestockQueue,
};
