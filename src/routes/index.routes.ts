import { Router } from "express";
import {authRoutes} from "./auth.routes.js"
import productsRoutes from "./product.routes.js";
import addressRoutes from "./user.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/address', addressRoutes);
rootRouter.use('/carts', cartRoutes);
rootRouter.use('/orders', orderRoutes)

export default rootRouter;