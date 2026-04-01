import express from "express";
import { OrderControllers } from "./order.controller";

const router = express.Router();

router.post(
  "/",
  // validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get("/", OrderControllers.getAllOrder);

router.get("/:id", OrderControllers.getSingleOrder);
router.post(
  "/:id/cancel",
  // validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.cancelOrder,
);
router.post(
  "/:id/update-status",
  // validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.updateStatus,
);
router.patch(
  "/:id",
  //  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.updateOrder,
);

router.delete("/:id", OrderControllers.deleteOrder);

export const OrderRoutes = router;
