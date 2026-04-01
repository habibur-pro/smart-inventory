import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ImageRoutes } from "../modules/Image/Image.route";
import { ProductRoutes } from "../modules/Product/product.route";
import { UserRoutes } from "../modules/User/user.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { OrderRoutes } from "../modules/Order/order.route";

// import { paymentRoutes } from "../modules/Payment/payment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },

  {
    path: "/files",
    route: ImageRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
