
import { Router } from "express"
import { errorHandler } from "../error.handler.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { cancleOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/order.controller.js"
import adminMiddleware from "../middlewares/admin.middleware.js"

const orderRoutes: Router = Router()

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/',[authMiddleware], errorHandler(listOrders));
orderRoutes.put('/:id', [authMiddleware], errorHandler(cancleOrder));
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
orderRoutes.put('/status', [authMiddleware, adminMiddleware], errorHandler(changeStatus))
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;