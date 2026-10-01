import { Router } from "express";
import {authRoutes} from "./auth.js"
import productsRoutes from "./product.routes.js";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes)

export default rootRouter;