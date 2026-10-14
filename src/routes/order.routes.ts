
import { Router } from "express"
import { errorHandler } from "../error.handler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { cancleOrder, createOrder, getOrderById, listOrders } from "../controllers/order.controller.js"

const orderRoutes: Router = Router()

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/',[authMiddleware], errorHandler(listOrders));
orderRoutes.put('/', [authMiddleware], errorHandler(cancleOrder));
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;