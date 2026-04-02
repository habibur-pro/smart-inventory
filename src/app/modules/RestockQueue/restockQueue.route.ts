import express from "express";
import { RestockQueueControllers } from "./restockQueue.controller";

const router = express.Router();

router.get("/", RestockQueueControllers.getAllRestockQueue);

router.post(
  "/:id/restock",
  //  validateRequest(RestockQueueValidation.createRestockQueueValidationSchema),
  RestockQueueControllers.restockQueue,
);


router.delete("/:id", RestockQueueControllers.deleteRestockQueue);

export const RestockQueueRoutes = router;
