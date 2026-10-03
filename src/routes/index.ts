import { Router } from "express";
import {authRoutes} from "./auth.js"
import productsRoutes from "./product.routes.js";
import addressRoutes from "./address.routes.js";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/address', addressRoutes);

export default rootRouter;